import { useAuth } from '@clerk/clerk-expo';
import axios from 'axios';
import { useEffect } from 'react';
import Constants from 'expo-constants';

const getLocalApiUrl = () => {
  const hostUri = Constants.expoConfig?.hostUri;

  if (!hostUri) return 'http://localhost:5000/api';

  const ip = hostUri.split(':')[0]; // 👉 extract IP

  return `http://${ip}:5000/api`;
};

export const API_URL = getLocalApiUrl();

const api = axios.create({
  baseURL: API_URL,
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
