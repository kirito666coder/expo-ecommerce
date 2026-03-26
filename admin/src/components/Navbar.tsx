'Use client';
import { UserButton } from '@clerk/nextjs';
import {
  ClipboardListIcon,
  HomeIcon,
  PanelLeftIcon,
  ShoppingBagIcon,
  UsersIcon,
} from 'lucide-react';
import { usePathname } from 'next/navigation';

export const NAVIGATION = [
  { name: 'Dashboard', path: '/dashboard', icon: <HomeIcon className="size-5" /> },
  { name: 'Products', path: '/products', icon: <ShoppingBagIcon className="size-5" /> },
  { name: 'Orders', path: '/orders', icon: <ClipboardListIcon className="size-5" /> },
  { name: 'Customers', path: '/customers', icon: <UsersIcon className="size-5" /> },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <div className="navbar bg-base-300 w-full">
      <label htmlFor="my-drawer" className="btn btn-square btn-ghost" aria-label="open sidebar">
        <PanelLeftIcon className="size-5" />
      </label>

      <div className="flex-1 px-4">
        <h1 className="text-xl font-bold">
          {NAVIGATION.find((item) => item.path === pathname)?.name || 'Dashboard'}
        </h1>
      </div>

      <div className="mr-5">
        <UserButton />
      </div>
    </div>
  );
}
