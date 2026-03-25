'use client';

import { api as baseApi } from '@/lib/api';
import { useAuth } from '@clerk/nextjs';
import { useMemo } from 'react';
import axios from 'axios';

export function useApi() {
  const { getToken } = useAuth();

  const api = useMemo(() => {
    const instance = axios.create({ baseURL: baseApi.defaults.baseURL });

    instance.interceptors.request.use(async (config) => {
      const token = await getToken();
      if (token) config.headers.Authorization = `Bearer ${token}`;
      return config;
    });

    return instance;
  }, [getToken]);

  return api;
}
