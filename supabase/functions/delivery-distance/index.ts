declare const Deno: {
  env: { get: (name: string) => string | undefined };
  serve: (handler: (request: Request) => Response | Promise<Response>) => void;
};

interface Coordinates {
  lat: number;
  lng: number;
}

const RESTAURANT_LOCATION: Coordinates = {
  lat: 26.4114298,
  lng: 43.9174798,
};

const MAX_SNAP_RADIUS_METERS = 50;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const jsonResponse = (body: Record<string, unknown>, status = 200) => new Response(
  JSON.stringify(body),
  { status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
);

const toRadians = (value: number) => value * (Math.PI / 180);

const calculateHaversineKm = (from: Coordinates, to: Coordinates) => {
  const latDelta = toRadians(to.lat - from.lat);
  const lngDelta = toRadians(to.lng - from.lng);
  const fromLat = toRadians(from.lat);
  const toLat = toRadians(to.lat);
  const a = Math.sin(latDelta / 2) ** 2
    + Math.cos(fromLat) * Math.cos(toLat) * Math.sin(lngDelta / 2) ** 2;
  return 2 * 6371 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

const validCoordinates = (value: unknown): value is Coordinates => {
  const coordinates = value as Partial<Coordinates> | null;
  return Boolean(
    coordinates
    && Number.isFinite(coordinates.lat)
    && Number.isFinite(coordinates.lng)
    && Number(coordinates.lat) >= -90
    && Number(coordinates.lat) <= 90
    && Number(coordinates.lng) >= -180
    && Number(coordinates.lng) <= 180
  );
};

const fallbackResponse = (destination: Coordinates, reason: string) => {
  const distanceKm = Number(calculateHaversineKm(RESTAURANT_LOCATION, destination).toFixed(2));
  console.warn(JSON.stringify({
    event: 'delivery_distance_fallback',
    reason,
    destination,
    distanceKm,
  }));
  return jsonResponse({ distanceKm, source: 'haversine_fallback' });
};

Deno.serve(async request => {
  if (request.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  if (request.method !== 'POST') {
    return jsonResponse({ error: { code: 'METHOD_NOT_ALLOWED', message: 'Only POST is supported.' } }, 405);
  }

  const body = await request.json().catch(() => null);
  const destination = body?.destination;
  if (!validCoordinates(destination)) {
    return jsonResponse({ error: { code: 'INVALID_COORDINATES', message: 'Valid destination coordinates are required.' } }, 400);
  }

  const token = Deno.env.get('MAPBOX_ACCESS_TOKEN');
  if (!token) return fallbackResponse(destination, 'missing_mapbox_token');

  const origin = `${RESTAURANT_LOCATION.lng},${RESTAURANT_LOCATION.lat}`;
  const target = `${destination.lng},${destination.lat}`;
  const url = new URL(`https://api.mapbox.com/directions/v5/mapbox/driving/${origin};${target}`);
  url.searchParams.set('access_token', token);
  url.searchParams.set('alternatives', 'false');
  url.searchParams.set('overview', 'false');
  url.searchParams.set('steps', 'false');
  url.searchParams.set('radiuses', `${MAX_SNAP_RADIUS_METERS};${MAX_SNAP_RADIUS_METERS}`);

  const loggedUrl = new URL(url);
  loggedUrl.searchParams.set('access_token', '[redacted]');
  console.info(JSON.stringify({
    event: 'mapbox_directions_request',
    profile: 'mapbox/driving',
    origin: RESTAURANT_LOCATION,
    destination,
    requestUrl: loggedUrl.toString(),
  }));

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 6000);
  try {
    const response = await fetch(url, { signal: controller.signal });
    if (!response.ok) return fallbackResponse(destination, `mapbox_http_${response.status}`);

    const data = await response.json();
    const distanceMeters = data?.routes?.[0]?.distance;
    if (!Number.isFinite(distanceMeters) || distanceMeters < 0) {
      return fallbackResponse(destination, 'mapbox_route_missing');
    }

    return jsonResponse({
      distanceKm: Number((distanceMeters / 1000).toFixed(2)),
      source: 'mapbox_driving',
    });
  } catch (error) {
    const reason = error instanceof Error && error.name === 'AbortError'
      ? 'mapbox_timeout'
      : 'mapbox_request_failed';
    return fallbackResponse(destination, reason);
  } finally {
    clearTimeout(timeoutId);
  }
});
