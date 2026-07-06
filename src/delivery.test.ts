import assert from 'node:assert/strict';
import { calculateDistanceKm, extractCoordinatesFromMapsLink, getDeliveryQuote, RESTAURANT_LOCATION } from './delivery';
import { MapsLinkError, resolveGoogleMapsLink } from './mapsLinkResolver';

const pointAtDistanceKm = (northKm: number) => ({
  lat: RESTAURANT_LOCATION.lat + northKm / 111.32,
  lng: RESTAURANT_LOCATION.lng,
});

const nearLocation = pointAtDistanceKm(3);
const farLocation = pointAtDistanceKm(5);

const nearLow = getDeliveryQuote(20, nearLocation);
assert.equal(nearLow.isAllowed, true);
assert.equal(nearLow.fee, 10);

const nearHigh = getDeliveryQuote(30, nearLocation);
assert.equal(nearHigh.isAllowed, true);
assert.equal(nearHigh.fee, 5);

const farBlocked = getDeliveryQuote(29, farLocation);
assert.equal(farBlocked.isAllowed, false);
assert.equal(farBlocked.minimumSubtotal, 30);

const farMid = getDeliveryQuote(30, farLocation);
assert.equal(farMid.isAllowed, true);
assert.equal(farMid.fee, 10);

const farHigh = getDeliveryQuote(50, farLocation);
assert.equal(farHigh.isAllowed, true);
assert.equal(farHigh.fee, 5);

const parsedQ = extractCoordinatesFromMapsLink('https://www.google.com/maps?q=26.392082,43.9386112');
assert.deepEqual(parsedQ, { lat: 26.392082, lng: 43.9386112 });

const parsedAt = extractCoordinatesFromMapsLink('https://www.google.com/maps/place/test/@26.392082,43.9386112,17z');
assert.deepEqual(parsedAt, { lat: 26.392082, lng: 43.9386112 });

const exactDistance = calculateDistanceKm(RESTAURANT_LOCATION, RESTAURANT_LOCATION);
assert.equal(Number(exactDistance.toFixed(2)), 0);

const mockResponse = (url: string, body = '') => ({
  url,
  text: async () => body,
}) as Response;

const resolvedShortLink = await resolveGoogleMapsLink(
  'https://maps.app.goo.gl/PsEFCrFhaPtYmgpv7',
  async () => mockResponse('https://www.google.com/maps/place/test/@26.392082,43.9386112,17z')
);
assert.deepEqual(
  { lat: resolvedShortLink.lat, lng: resolvedShortLink.lng },
  { lat: 26.392082, lng: 43.9386112 }
);

const resolvedLongLink = await resolveGoogleMapsLink(
  'https://www.google.com/maps/place/test/@26.401,43.941,17z',
  async (url) => mockResponse(url)
);
assert.deepEqual(
  { lat: resolvedLongLink.lat, lng: resolvedLongLink.lng },
  { lat: 26.401, lng: 43.941 }
);

await assert.rejects(
  () => resolveGoogleMapsLink('https://example.com/maps?q=26.392082,43.9386112'),
  (error) => error instanceof MapsLinkError && error.code === 'UNSUPPORTED_DOMAIN'
);

await assert.rejects(
  () => resolveGoogleMapsLink(
    'https://www.google.com/maps/place/no-coordinates',
    async () => mockResponse('https://www.google.com/maps/place/no-coordinates', '<html>No coordinates here</html>')
  ),
  (error) => error instanceof MapsLinkError && error.code === 'COORDINATES_NOT_FOUND'
);

console.table([
  { case: '3km, subtotal 20', allowed: nearLow.isAllowed, fee: nearLow.fee, distanceKm: nearLow.distanceKm },
  { case: '3km, subtotal 30', allowed: nearHigh.isAllowed, fee: nearHigh.fee, distanceKm: nearHigh.distanceKm },
  { case: '5km, subtotal 29', allowed: farBlocked.isAllowed, fee: farBlocked.fee, distanceKm: farBlocked.distanceKm },
  { case: '5km, subtotal 30', allowed: farMid.isAllowed, fee: farMid.fee, distanceKm: farMid.distanceKm },
  { case: '5km, subtotal 50', allowed: farHigh.isAllowed, fee: farHigh.fee, distanceKm: farHigh.distanceKm },
]);

console.log('Delivery rule tests passed.');
