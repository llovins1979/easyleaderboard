'use client';

import { AppStateProvider } from '@/components/app-state';
import { AppShell } from '@/components/app-shell';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AppStateProvider>
      <AppShell>{children}</AppShell>
    </AppStateProvider>
  );
}
