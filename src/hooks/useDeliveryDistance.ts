import { useEffect, useState } from 'react';
import { supabase } from '../supabase';
import type { Coordinates } from '../delivery';

export interface DeliveryDistanceResult {
  distanceKm: number;
  source: 'mapbox_driving' | 'haversine_fallback';
}

interface CachedDeliveryDistance {
  result: DeliveryDistanceResult;
  cachedAt: number;
}

const CACHE_PREFIX = 'makolaty:delivery-distance:';
const CACHE_TTL_MS = 30 * 60 * 1000;
const pendingRequests = new Map<string, Promise<DeliveryDistanceResult>>();

const getCacheKey = ({ lat, lng }: Coordinates) => (
  `${CACHE_PREFIX}${lat.toFixed(5)},${lng.toFixed(5)}`
);

const isValidResult = (value: unknown): value is DeliveryDistanceResult => {
  const result = value as Partial<DeliveryDistanceResult> | null;
  return Boolean(
    result
    && Number.isFinite(result.distanceKm)
    && (result.source === 'mapbox_driving' || result.source === 'haversine_fallback')
  );
};

const readCachedResult = (cacheKey: string) => {
  try {
    const stored = sessionStorage.getItem(cacheKey);
    if (!stored) return null;
    const cached = JSON.parse(stored) as CachedDeliveryDistance;
    if (!isValidResult(cached.result) || Date.now() - cached.cachedAt > CACHE_TTL_MS) {
      sessionStorage.removeItem(cacheKey);
      return null;
    }
    return cached.result;
  } catch {
    return null;
  }
};

const cacheResult = (cacheKey: string, result: DeliveryDistanceResult) => {
  try {
    sessionStorage.setItem(cacheKey, JSON.stringify({ result, cachedAt: Date.now() }));
  } catch {
    // Distance calculation still works when browser storage is unavailable.
  }
};

const requestDistance = (destination: Coordinates, cacheKey: string) => {
  const existingRequest = pendingRequests.get(cacheKey);
  if (existingRequest) return existingRequest;

  const request = supabase.functions.invoke<DeliveryDistanceResult>('delivery-distance', {
    body: { destination },
  }).then(({ data, error: functionError }) => {
    if (functionError || !isValidResult(data)) {
      throw new Error('Invalid delivery distance response');
    }
    cacheResult(cacheKey, data);
    return data;
  }).finally(() => {
    pendingRequests.delete(cacheKey);
  });

  pendingRequests.set(cacheKey, request);
  return request;
};

export const useDeliveryDistance = (destination: Coordinates | null) => {
  const [result, setResult] = useState<DeliveryDistanceResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let isCurrent = true;
    if (!destination) {
      setResult(null);
      setError('');
      setIsLoading(false);
      return () => { isCurrent = false; };
    }

    const cacheKey = getCacheKey(destination);
    const cachedResult = readCachedResult(cacheKey);
    if (cachedResult) {
      setResult(cachedResult);
      setError('');
      setIsLoading(false);
      return () => { isCurrent = false; };
    }

    setIsLoading(true);
    setResult(null);
    setError('');
    requestDistance(destination, cacheKey).then((data) => {
      if (!isCurrent) return;
      setResult(data);
    }).catch(() => {
      if (isCurrent) setError('تعذر حساب مسافة القيادة. حاول مرة أخرى.');
    }).finally(() => {
      if (isCurrent) setIsLoading(false);
    });

    return () => { isCurrent = false; };
  }, [destination?.lat, destination?.lng]);

  return { result, isLoading, error };
};
