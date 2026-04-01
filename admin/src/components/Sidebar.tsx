'use client';
import { ShoppingBagIcon } from 'lucide-react';
import { NAVIGATION } from './Navbar';
import { usePathname } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import Link from 'next/link';

function Sidebar() {
  const pathname = usePathname();
  const { user } = useUser();

  return (
    <div className="drawer-side is-drawer-close:overflow-visible">
      <label htmlFor="my-drawer" aria-label="close sidebar" className="drawer-overlay"></label>

      <div className="bg-base-200 is-drawer-close:w-14 is-drawer-open:w-64 flex min-h-full flex-col items-start">
        <div className="w-full p-4">
          <div className="flex items-center gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl text-zinc-900">
              <ShoppingBagIcon className="text-white-content h-6 w-6" />
            </div>
            <span className="is-drawer-close:hidden text-xl font-bold">Admin</span>
          </div>
        </div>

        <ul className="menu flex w-full grow flex-col gap-2">
          {NAVIGATION.map((item) => {
            const isActive = pathname === item.path;
            return (
              <li key={item.path}>
                <Link
                  href={item.path}
                  className={`is-drawer-close:tooltip is-drawer-close:tooltip-right ${isActive ? 'text-white-content text-zinc-900' : ''} `}
                >
                  {item.icon}
                  <span className="is-drawer-close:hidden">{item.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="w-full p-4">
          <div className="flex items-center gap-3">
            <div className="avatar shrink-0">
              <img
                src={user?.imageUrl}
                alt={`${user?.fullName}`}
                className="h-10 w-10 rounded-full"
              />
            </div>

            <div className="is-drawer-close:hidden min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">
                {user?.firstName} {user?.lastName}
              </p>

              <p className="truncate text-xs opacity-60">
                {user?.emailAddresses?.[0]?.emailAddress}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Sidebar;
