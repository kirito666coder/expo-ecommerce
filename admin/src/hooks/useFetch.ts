'use client';

import { useCallback, useState } from 'react';
import { useApi } from './useApi';
import { AxiosInstance, AxiosResponse } from 'axios';

type RequestFn<T> = (api: AxiosInstance) => Promise<AxiosResponse<T>>;

export function useFetch() {
  const api = useApi();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const request = useCallback(
    async <T>(fn: RequestFn<T>): Promise<T | null> => {
      setLoading(true);
      setError(null);

      try {
        const res = await fn(api);
        return res.data;
      } catch (err: any) {
        setError(err.message || 'Something went wrong');
        return null;
      } finally {
        setLoading(false);
      }
    },
    [api],
  );
  return { request, loading, error };
}
