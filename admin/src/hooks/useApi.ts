'use client';

import { api } from '@/lib/api';
import { useAuth } from '@clerk/nextjs';

export function useApi() {
  const { getToken } = useAuth();

  api.interceptors.request.use(async (config) => {
    const token = await getToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  });
  return api;
}
