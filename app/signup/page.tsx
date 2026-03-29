'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppState } from '@/components/app-state';
import { UserRole } from '@/lib/types';

export default function SignupPage() {
  const { signUpWithPassword } = useAppState();
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('player');
  const [handicapIndex, setHandicapIndex] = useState('12.0');
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    const result = await signUpWithPassword({
      name,
      email,
      password,
      role,
      handicapIndex: role === 'player' ? Number(handicapIndex) : undefined
    });

    if (!result.ok) {
      setError(result.message);
      setLoading(false);
      return;
    }

    setMessage(result.message);
    if (!result.message.toLowerCase().includes('confirm your email')) {
      router.push(role === 'manager' ? '/manager' : '/player');
    }
    setLoading(false);
  };

  return (
    <div className="mx-auto max-w-xl card">
      <h1 className="text-xl font-semibold">Sign Up</h1>
      <p className="mt-2 text-sm text-slate-600">Create a real account using Supabase email/password auth.</p>
      <form className="mt-4 grid gap-3" onSubmit={onSubmit}>
        <input className="rounded border px-3 py-2" placeholder="Full name" value={name} onChange={(e) => setName(e.target.value)} required />
        <input className="rounded border px-3 py-2" type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input className="rounded border px-3 py-2" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <label className="text-sm">
          Role
          <select className="mt-1 w-full rounded border px-3 py-2" value={role} onChange={(e) => setRole(e.target.value as UserRole)}>
            <option value="player">Player</option>
            <option value="manager">Manager</option>
          </select>
        </label>
        {role === 'player' && (
          <input
            className="rounded border px-3 py-2"
            type="number"
            step="0.1"
            min="0"
            max="54"
            placeholder="Handicap index"
            value={handicapIndex}
            onChange={(e) => setHandicapIndex(e.target.value)}
          />
        )}
        {error && <p className="text-sm text-red-600">{error}</p>}
        {message && <p className="text-sm text-emerald-700">{message}</p>}
        <button className="rounded bg-brand-700 px-3 py-2 text-white" type="submit" disabled={loading}>
          {loading ? 'Creating account...' : 'Create Account'}
        </button>
      </form>
    </div>
  );
}
