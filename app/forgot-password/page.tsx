'use client';

import { FormEvent, useState } from 'react';
import { getSupabaseBrowserClient } from '@/lib/supabase/browser';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState<string | null>(null);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setMessage(null);

    try {
      const supabase = getSupabaseBrowserClient();
      const result = await supabase.auth.resetPasswordForEmail(email);
      if (result.error) {
        setMessage(result.error.message);
        return;
      }

      setMessage('Password reset email sent.');
    } catch {
      setMessage('Supabase auth is not configured.');
    }
  };

  return (
    <div className="mx-auto max-w-xl card">
      <h1 className="text-xl font-semibold">Forgot Password</h1>
      <form className="mt-4 grid gap-3" onSubmit={onSubmit}>
        <input
          className="rounded border px-3 py-2"
          type="email"
          required
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button className="rounded bg-brand-700 px-3 py-2 text-white" type="submit">
          Send Reset Link
        </button>
      </form>
      {message && <p className="mt-3 text-sm text-slate-700">{message}</p>}
    </div>
  );
}
