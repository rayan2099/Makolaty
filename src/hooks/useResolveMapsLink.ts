import { useState } from 'react';
import { supabase } from '../supabase';
import type { Coordinates } from '../delivery';
import type { MapsLinkErrorCode } from '../mapsLinkResolver';

const ERROR_MESSAGES_AR: Record<MapsLinkErrorCode | 'METHOD_NOT_ALLOWED', string> = {
  MISSING_URL: 'يرجى لصق رابط خرائط Google أولاً.',
  INVALID_URL: 'الرابط غير صحيح. يرجى التأكد من رابط خرائط Google.',
  UNSUPPORTED_DOMAIN: 'نقبل روابط خرائط Google فقط.',
  COORDINATES_NOT_FOUND: 'لم نتمكن من قراءة الموقع. افتح خرائط Google، اضغط مشاركة، ثم انسخ رابطاً جديداً.',
  TIMEOUT: 'استغرق رابط الخرائط وقتاً طويلاً. انسخ رابط مشاركة جديداً من خرائط Google وحاول مرة أخرى.',
  RESOLUTION_FAILED: 'تعذر قراءة رابط الخرائط. انسخ رابط مشاركة جديداً من خرائط Google وحاول مرة أخرى.',
  METHOD_NOT_ALLOWED: 'حدث خطأ في طريقة الطلب. جرّب مرة أخرى.',
};

interface ResolveMapsLinkResponse extends Coordinates {
  resolvedUrl: string;
}

const getErrorMessage = async (error: unknown) => {
  const context = (error as { context?: unknown })?.context;
  let code: string | undefined;

  if (context instanceof Response) {
    const body = await context.clone().json().catch(() => null);
    code = typeof body?.error?.code === 'string' ? body.error.code : undefined;
  } else {
    code = (context as { error?: { code?: string } } | undefined)?.error?.code;
  }

  if (code && code in ERROR_MESSAGES_AR) {
    return ERROR_MESSAGES_AR[code as keyof typeof ERROR_MESSAGES_AR];
  }

  return ERROR_MESSAGES_AR.RESOLUTION_FAILED;
};

export const useResolveMapsLink = () => {
  const [isResolving, setIsResolving] = useState(false);
  const [error, setError] = useState('');

  const resolveLink = async (url: string): Promise<Coordinates | null> => {
    setIsResolving(true);
    setError('');

    try {
      const { data, error: functionError } = await supabase.functions.invoke<ResolveMapsLinkResponse>(
        'resolve-maps-link',
        { body: { url } }
      );

      if (functionError) {
        const message = await getErrorMessage(functionError);
        setError(message);
        return null;
      }

      if (!data || typeof data.lat !== 'number' || typeof data.lng !== 'number') {
        setError(ERROR_MESSAGES_AR.COORDINATES_NOT_FOUND);
        return null;
      }

      return { lat: data.lat, lng: data.lng };
    } catch (err) {
      setError(await getErrorMessage(err));
      return null;
    } finally {
      setIsResolving(false);
    }
  };

  return { resolveLink, isResolving, error, clearError: () => setError('') };
};
