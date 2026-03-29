'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAppState } from '@/components/app-state';
import clsx from 'clsx';

const playerLinks = [
  { href: '/player', label: 'Dashboard' },
  { href: '/player/events', label: 'My Events' },
  { href: '/player/money-games', label: 'Money Games' },
  { href: '/player/history', label: 'My History' },
  { href: '/player/team', label: 'Team' },
  { href: '/player/notifications', label: 'Notifications' }
];

const managerLinks = [
  { href: '/manager', label: 'Dashboard' },
  { href: '/manager/events/new', label: 'Create Event' },
  { href: '/manager/players', label: 'Players' },
  { href: '/manager/groups', label: 'Groups' },
  { href: '/manager/money-games', label: 'Money Games' },
  { href: '/manager/payouts', label: 'Payouts' },
  { href: '/manager/team-generator', label: 'Team Generator' },
  { href: '/manager/history', label: 'History' },
  { href: '/manager/notifications', label: 'Notifications' }
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { currentUser, signOut, dataSource } = useAppState();

  const nav = currentUser?.role === 'manager' ? managerLinks : playerLinks;

  return (
    <div className="min-h-screen bg-brand-50 text-slate-900">
      <header className="border-b border-brand-100 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <Link href="/" className="font-semibold text-brand-700">Easy Leaderboard</Link>
          <div className="flex items-center gap-3 text-sm">
            {currentUser ? (
              <>
                <span>
                  {currentUser.name} ({currentUser.role})
                </span>
                <button
                  className="rounded bg-brand-700 px-3 py-1 text-white"
                  onClick={() => void signOut()}
                >
                  Sign out
                </button>
              </>
            ) : (
              <Link className="rounded bg-brand-700 px-3 py-1 text-white" href="/login">
                Sign in
              </Link>
            )}
          </div>
        </div>
        <div className="mx-auto max-w-7xl px-4 pb-2 text-xs text-slate-500">
          Data source: {dataSource === 'supabase' ? 'Supabase' : 'Local seed fallback'}
        </div>
        {currentUser && (
          <nav className="mx-auto flex max-w-7xl gap-2 overflow-x-auto px-4 pb-3 text-sm">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={clsx(
                  'rounded px-3 py-1 whitespace-nowrap',
                  pathname === item.href ? 'bg-brand-700 text-white' : 'bg-white'
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        )}
      </header>
      <main className="mx-auto max-w-7xl p-4">{children}</main>
    </div>
  );
}
