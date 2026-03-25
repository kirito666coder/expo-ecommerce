'use client';
import { useApi } from '@/hooks/useApi';
import { ReactNode, useEffect } from 'react';
import { useAuth } from '@clerk/nextjs';

export default function Layout({ children }: { children: ReactNode }) {
  const api = useApi();
  const { isSignedIn } = useAuth();

  useEffect(() => {
    // const loadData = async () => {
    //   try {
    //     const res = await api.get('/products');
    //     console.log(res.data);
    //   } catch (err) {
    //     console.error(err);
    //   }
    // };
    // if (isSignedIn) {
    //   loadData();
    // }
  }, [isSignedIn, api]);

  return (
    <div className="drawer lg:drawer-open">
      <input id="my-drawer" type="checkbox" className="drawer-toggle" defaultChecked />

      <div className="drawer-content">
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
