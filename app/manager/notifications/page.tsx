'use client';

import { FormEvent, useState } from 'react';
import { RoleGate } from '@/components/role-gate';
import { useAppState } from '@/components/app-state';

export default function ManagerNotificationsPage() {
  const { state, sendNotification } = useAppState();
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!title || !body) return;

    sendNotification({
      eventId: state.events[0]?.id,
      title,
      body,
      target: 'event',
      providerStatus: 'queued_for_sms'
    });

    setTitle('');
    setBody('');
  };

  return (
    <RoleGate allow="manager">
      <div className="space-y-4">
        <div className="card max-w-2xl">
          <h1 className="text-2xl font-semibold">Notifications Center</h1>
          <p className="mt-2 text-sm text-slate-600">
            In-app notifications are active. SMS delivery is provider-ready and queued.
          </p>
          <form className="mt-3 grid gap-3" onSubmit={onSubmit}>
            <input className="rounded border px-3 py-2" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
            <textarea className="rounded border px-3 py-2" placeholder="Message" value={body} onChange={(e) => setBody(e.target.value)} />
            <button className="rounded bg-brand-700 px-4 py-2 text-white" type="submit">Send Announcement</button>
          </form>
        </div>

        <div className="space-y-2">
          {state.notifications.map((n) => (
            <div key={n.id} className="card">
              <p className="font-medium">{n.title}</p>
              <p className="text-sm text-slate-600">{n.body}</p>
              <p className="mt-2 text-xs text-slate-500">Target: {n.target} · Status: {n.providerStatus}</p>
            </div>
          ))}
        </div>
      </div>
    </RoleGate>
  );
}
