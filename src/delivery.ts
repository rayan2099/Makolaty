import { extractCoordinatesFromText } from './mapsLinkResolver';

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface DeliveryQuote {
  distanceKm: number;
  fee: number;
  isAllowed: boolean;
  minimumSubtotal?: number;
  messageAr: string;
}

export const RESTAURANT_LOCATION: Coordinates = {
  lat: 26.3651328,
  lng: 43.9386112,
};

const EARTH_RADIUS_KM = 6371;

const toRadians = (value: number) => value * (Math.PI / 180);

export const calculateDistanceKm = (from: Coordinates, to: Coordinates) => {
  const latDelta = toRadians(to.lat - from.lat);
  const lngDelta = toRadians(to.lng - from.lng);
  const fromLat = toRadians(from.lat);
  const toLat = toRadians(to.lat);

  const a =
    Math.sin(latDelta / 2) ** 2 +
    Math.cos(fromLat) * Math.cos(toLat) * Math.sin(lngDelta / 2) ** 2;

  return 2 * EARTH_RADIUS_KM * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

export const extractCoordinatesFromMapsLink = (value: string): Coordinates | null => {
  return extractCoordinatesFromText(value.trim());
};

export const isShortMapsLink = (value: string) => {
  const trimmed = value.trim().toLowerCase();
  return trimmed.includes('maps.app.goo.gl') || trimmed.includes('goo.gl/maps');
};

export const getDeliveryQuote = (subtotal: number, customerLocation: Coordinates): DeliveryQuote => {
  const distanceKm = calculateDistanceKm(RESTAURANT_LOCATION, customerLocation);
  const roundedDistance = Number(distanceKm.toFixed(2));
  const isNear = distanceKm <= 4;

  if (isNear) {
    return {
      distanceKm: roundedDistance,
      fee: subtotal >= 30 ? 5 : 10,
      isAllowed: true,
      messageAr: subtotal >= 30
        ? 'المسافة 4 كم أو أقل والفاتورة 30 ريال فأكثر: رسوم التوصيل 5 ريال.'
        : 'المسافة 4 كم أو أقل والفاتورة أقل من 30 ريال: رسوم التوصيل 10 ريال.',
    };
  }

  if (subtotal < 30) {
    return {
      distanceKm: roundedDistance,
      fee: 0,
      isAllowed: false,
      minimumSubtotal: 30,
      messageAr: 'المسافة أكثر من 4 كم. للتوصيل يجب أن تكون قيمة الطلب 30 ريال أو أكثر، أضف أصنافاً إضافية لإكمال الطلب.',
    };
  }

  return {
    distanceKm: roundedDistance,
    fee: subtotal >= 50 ? 5 : 10,
    isAllowed: true,
    messageAr: subtotal >= 50
      ? 'المسافة أكثر من 4 كم والفاتورة 50 ريال فأكثر: رسوم التوصيل 5 ريال.'
      : 'المسافة أكثر من 4 كم والفاتورة من 30 إلى أقل من 50 ريال: رسوم التوصيل 10 ريال.',
  };
};
