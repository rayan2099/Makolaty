export type MapsLinkErrorCode =
  | 'MISSING_URL'
  | 'INVALID_URL'
  | 'UNSUPPORTED_DOMAIN'
  | 'COORDINATES_NOT_FOUND'
  | 'TIMEOUT'
  | 'RESOLUTION_FAILED';

export class MapsLinkError extends Error {
  code: MapsLinkErrorCode;
  status: number;

  constructor(code: MapsLinkErrorCode, message: string, status = 400) {
    super(message);
    this.name = 'MapsLinkError';
    this.code = code;
    this.status = status;
  }
}

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface ResolvedMapsLink extends Coordinates {
  resolvedUrl: string;
}

type FetchLike = (input: string, init?: RequestInit) => Promise<Response>;

const SUPPORTED_MAPS_HOSTS = new Set([
  'maps.app.goo.gl',
  'goo.gl',
  'google.com',
  'www.google.com',
  'maps.google.com',
]);

const parseCoordinatePair = (latValue: string, lngValue: string): Coordinates | null => {
  const lat = Number(latValue);
  const lng = Number(lngValue);

  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
  if (lat < -90 || lat > 90 || lng < -180 || lng > 180) return null;

  return { lat, lng };
};

export const isSupportedGoogleMapsUrl = (url: URL) => {
  const hostname = url.hostname.toLowerCase();
  return SUPPORTED_MAPS_HOSTS.has(hostname);
};

export const parseGoogleMapsUrl = (value: string) => {
  if (!value?.trim()) {
    throw new MapsLinkError('MISSING_URL', 'Missing Google Maps URL.');
  }

  try {
    const url = new URL(value.trim());
    if (!['http:', 'https:'].includes(url.protocol)) {
      throw new MapsLinkError('INVALID_URL', 'URL must use http or https.');
    }
    if (!isSupportedGoogleMapsUrl(url)) {
      throw new MapsLinkError('UNSUPPORTED_DOMAIN', 'Only Google Maps links are supported.');
    }
    return url;
  } catch (error) {
    if (error instanceof MapsLinkError) throw error;
    throw new MapsLinkError('INVALID_URL', 'Invalid Google Maps URL.');
  }
};

export const extractCoordinatesFromText = (value: string): Coordinates | null => {
  const decoded = decodeURIComponent(value);
  const patterns = [
    /@(-?\d+(?:\.\d+)?),\s*(-?\d+(?:\.\d+)?)(?:,\d+(?:\.\d+)?z)?/,
    /!3d(-?\d+(?:\.\d+)?)!4d(-?\d+(?:\.\d+)?)/,
    /[?&]saddr=(-?\d+(?:\.\d+)?),\s*(-?\d+(?:\.\d+)?)(?:[&#]|$)/,
    /[?&]q=(-?\d+(?:\.\d+)?),\s*(-?\d+(?:\.\d+)?)(?:[&#]|$)/,
    /[?&]ll=(-?\d+(?:\.\d+)?),\s*(-?\d+(?:\.\d+)?)(?:[&#]|$)/,
    /"(-?\d+(?:\.\d+)?),\s*(-?\d+(?:\.\d+)?)"/,
  ];

  for (const pattern of patterns) {
    const match = decoded.match(pattern);
    if (!match) continue;

    const coordinates = parseCoordinatePair(match[1], match[2]);
    if (coordinates) return coordinates;
  }

  return null;
};

export const resolveGoogleMapsLink = async (
  value: string,
  fetchImpl: FetchLike = fetch,
  timeoutMs = 5000
): Promise<ResolvedMapsLink> => {
  const url = parseGoogleMapsUrl(value);
  const requestUrl = new URL(url);
  if (requestUrl.hostname.toLowerCase() === 'maps.app.goo.gl') {
    requestUrl.search = '';
    requestUrl.hash = '';
  }
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetchImpl(requestUrl.toString(), {
      redirect: 'follow',
      signal: controller.signal,
      headers: {
        'user-agent': 'Makolaty/1.0 maps-link-resolver',
      },
    });

    const resolvedUrl = response.url || url.toString();
    const coordinatesFromUrl = extractCoordinatesFromText(resolvedUrl);
    if (coordinatesFromUrl) {
      return { ...coordinatesFromUrl, resolvedUrl };
    }

    const body = await response.text();
    const coordinatesFromBody = extractCoordinatesFromText(body);
    if (coordinatesFromBody) {
      return { ...coordinatesFromBody, resolvedUrl };
    }

    throw new MapsLinkError('COORDINATES_NOT_FOUND', 'Coordinates were not found in the Google Maps link.', 404);
  } catch (error) {
    if (error instanceof MapsLinkError) throw error;
    if (error instanceof Error && error.name === 'AbortError') {
      throw new MapsLinkError('TIMEOUT', 'Timed out while resolving the Google Maps link.', 408);
    }
    throw new MapsLinkError('RESOLUTION_FAILED', 'Failed to resolve the Google Maps link.', 502);
  } finally {
    clearTimeout(timeoutId);
  }
};
