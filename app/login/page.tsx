'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppState } from '@/components/app-state';
import { getSupabaseBrowserClient } from '@/lib/supabase/browser';

export default function LoginPage() {
  const { signInWithPassword, refreshState } = useAppState();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const result = await signInWithPassword(email, password);
    if (!result.ok) {
      setError(result.message);
      setLoading(false);
      return;
    }

    await refreshState();
    let role: 'player' | 'manager' = 'player';

    try {
      const supabase = getSupabaseBrowserClient();
      const { data } = await supabase.auth.getSession();
      const accessToken = data.session?.access_token;
      if (accessToken) {
        const meRes = await fetch('/api/auth/me', {
          headers: { Authorization: `Bearer ${accessToken}` }
        });
        const meData = await meRes.json();
        if (meData.profile?.role === 'manager') role = 'manager';
      }
    } catch {
      // default player route
    }

    router.push(role === 'manager' ? '/manager' : '/player');
    setLoading(false);
  };

  return (
    <div className="mx-auto max-w-xl space-y-4">
      <div className="card">
        <h1 className="text-xl font-semibold">Login</h1>
        <p className="mt-2 text-sm text-slate-600">Sign in with your Supabase email/password account.</p>
        <form className="mt-4 grid gap-3" onSubmit={onSubmit}>
          <input
            type="email"
            required
            className="rounded border px-3 py-2"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            required
            className="rounded border px-3 py-2"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button disabled={loading} className="rounded bg-brand-700 px-3 py-2 text-white" type="submit">
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}
