import { useEffect, useState } from 'react';
import { supabase } from '../supabase';
import type { Coordinates } from '../delivery';

export interface DeliveryDistanceResult {
  distanceKm: number;
  source: 'mapbox_driving' | 'haversine_fallback';
}

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

    setIsLoading(true);
    setResult(null);
    setError('');
    supabase.functions.invoke<DeliveryDistanceResult>('delivery-distance', {
      body: { destination },
    }).then(({ data, error: functionError }) => {
      if (!isCurrent) return;
      if (functionError || !data || !Number.isFinite(data.distanceKm)) {
        setError('تعذر حساب مسافة القيادة. حاول مرة أخرى.');
        return;
      }
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
