import assert from 'node:assert/strict';
import { calculateDistanceKm, extractCoordinatesFromMapsLink, getDeliveryQuote, RESTAURANT_LOCATION } from './delivery';
import { MapsLinkError, resolveGoogleMapsLink } from './mapsLinkResolver';

const pointAtDistanceKm = (northKm: number) => ({
  lat: RESTAURANT_LOCATION.lat + northKm / 111.32,
  lng: RESTAURANT_LOCATION.lng,
});

const nearLocation = pointAtDistanceKm(3);
const farLocation = pointAtDistanceKm(5);

const nearDistance = calculateDistanceKm(RESTAURANT_LOCATION, nearLocation);
const farDistance = calculateDistanceKm(RESTAURANT_LOCATION, farLocation);

const nearLow = getDeliveryQuote(20, nearDistance);
assert.equal(nearLow.isAllowed, true);
assert.equal(nearLow.fee, 10);

const nearHigh = getDeliveryQuote(30, nearDistance);
assert.equal(nearHigh.isAllowed, true);
assert.equal(nearHigh.fee, 5);

const farBlocked = getDeliveryQuote(29, farDistance);
assert.equal(farBlocked.isAllowed, false);
assert.equal(farBlocked.minimumSubtotal, 30);

const farMid = getDeliveryQuote(30, farDistance);
assert.equal(farMid.isAllowed, true);
assert.equal(farMid.fee, 10);

const farHigh = getDeliveryQuote(50, farDistance);
assert.equal(farHigh.isAllowed, true);
assert.equal(farHigh.fee, 5);

const parsedQ = extractCoordinatesFromMapsLink('https://www.google.com/maps?q=26.392082,43.9386112');
assert.deepEqual(parsedQ, { lat: 26.392082, lng: 43.9386112 });

const parsedAt = extractCoordinatesFromMapsLink('https://www.google.com/maps/place/test/@26.392082,43.9386112,17z');
assert.deepEqual(parsedAt, { lat: 26.392082, lng: 43.9386112 });

const exactDistance = calculateDistanceKm(RESTAURANT_LOCATION, RESTAURANT_LOCATION);
assert.equal(Number(exactDistance.toFixed(2)), 0);

assert.deepEqual(RESTAURANT_LOCATION, { lat: 26.4114298, lng: 43.9174798 });
const knownCustomerDistance = calculateDistanceKm(
  RESTAURANT_LOCATION,
  { lat: 26.3989811, lng: 43.9051056 }
);
assert.equal(Number(knownCustomerDistance.toFixed(2)), 1.85);
assert.equal(getDeliveryQuote(20, knownCustomerDistance).isAllowed, true);

const calibratedLocations = [
  { lat: 26.3989811, lng: 43.9051056 },
  { lat: 26.428, lng: 43.9175 },
  { lat: 26.4114, lng: 43.89 },
];
calibratedLocations.forEach(location => {
  const distance = calculateDistanceKm(RESTAURANT_LOCATION, location);
  assert.equal(getDeliveryQuote(20, distance).isAllowed, true);
});

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
