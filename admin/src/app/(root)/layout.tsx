'use client';
import { useApi } from '@/hooks/useApi';
import { ReactNode, useEffect } from 'react';

export default function Layout({ children }: { children: ReactNode }) {
  const api = useApi();

  useEffect(() => {
    const loadData = async () => {
      await api.get('/data');
    };
    loadData();
  }, []);
  return <>{children}</>;
}
