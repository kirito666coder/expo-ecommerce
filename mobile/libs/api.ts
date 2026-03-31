import { useAuth } from '@clerk/clerk-expo';
import axios from 'axios';
import { useEffect } from 'react';

const API_URl = 'http://172.22.176.1:5000/api';

const api = axios.create({
  baseURL: API_URl,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const useApi = () => {
  const { getToken } = useAuth();

  useEffect(() => {
    const interceptor = api.interceptors.request.use(async (config) => {
      const token = await getToken();

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      return config;
    });

    return () => {
      api.interceptors.request.eject(interceptor);
    };
  }, [getToken]);
  return api;
};
