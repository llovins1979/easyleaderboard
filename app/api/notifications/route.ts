import { NextResponse } from 'next/server';
import { randomUUID } from 'node:crypto';
import { createSupabaseAdmin } from '@/lib/supabase/admin';
import { isSupabaseConfigured } from '@/lib/supabase/config';

export async function POST(req: Request) {
  const body = await req.json();

  if (isSupabaseConfigured()) {
    const supabase = createSupabaseAdmin();
    await supabase.from('notifications').insert({
      id: randomUUID(),
      event_id: body.eventId ?? null,
      group_id: body.groupId ?? null,
      title: body.title,
      body: body.body,
      target: body.target ?? 'event',
      provider_status: body.providerStatus ?? 'queued_for_sms',
      created_at: new Date().toISOString()
    });
  }

  return NextResponse.json({
    message: 'Notification accepted and stored.',
    provider: 'twilio_ready_placeholder',
    queuedPayload: body
  });
}
