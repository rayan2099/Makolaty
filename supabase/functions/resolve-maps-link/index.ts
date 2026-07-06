import { MapsLinkError, resolveGoogleMapsLink } from '../_shared/mapsLinkResolver.ts';

declare const Deno: {
  serve: (handler: (request: Request) => Response | Promise<Response>) => void;
};

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const jsonResponse = (body: Record<string, unknown>, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders,
      'Content-Type': 'application/json',
    },
  });

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  if (request.method !== 'POST') {
    return jsonResponse(
      { error: { code: 'METHOD_NOT_ALLOWED', message: 'Only POST requests are supported.' } },
      405
    );
  }

  try {
    const body = await request.json().catch(() => null);
    const url = typeof body?.url === 'string' ? body.url : '';
    const result = await resolveGoogleMapsLink(url, fetch, 5000);

    return jsonResponse({
      lat: result.lat,
      lng: result.lng,
      resolvedUrl: result.resolvedUrl,
    });
  } catch (error) {
    if (error instanceof MapsLinkError) {
      return jsonResponse(
        { error: { code: error.code, message: error.message } },
        error.status
      );
    }

    return jsonResponse(
      { error: { code: 'RESOLUTION_FAILED', message: 'Failed to resolve the Google Maps link.' } },
      502
    );
  }
});
