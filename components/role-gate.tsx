'use client';

import Link from 'next/link';
import { UserRole } from '@/lib/types';
import { useAppState } from '@/components/app-state';

export function RoleGate({
  allow,
  children
}: {
  allow: UserRole | UserRole[];
  children: React.ReactNode;
}) {
  const { currentUser } = useAppState();
  const roles = Array.isArray(allow) ? allow : [allow];

  if (!currentUser) {
    return (
      <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm">
        You are not signed in. Go to <Link href="/login" className="underline">login</Link>.
      </div>
    );
  }

  if (!roles.includes(currentUser.role)) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm">
        You do not have access to this page.
      </div>
    );
  }

  return <>{children}</>;
}
