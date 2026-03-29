import { NextResponse } from 'next/server';
import { randomUUID } from 'node:crypto';
import { createSupabaseAdmin } from '@/lib/supabase/admin';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import { toDbEventInsert } from '@/lib/supabase/mappers';
import { Event } from '@/lib/types';

export async function POST(req: Request) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ message: 'Supabase is not configured.' }, { status: 400 });
  }

  const body = (await req.json()) as {
    event: Omit<Event, 'id' | 'managerIds'>;
    managerUserId: string;
  };

  const supabase = createSupabaseAdmin();
  const managerRes = await supabase.from('managers').select('id').eq('user_id', body.managerUserId).maybeSingle();

  if (!managerRes.data?.id) {
    return NextResponse.json({ message: 'Manager user is not authorized.' }, { status: 403 });
  }

  const eventId = randomUUID();
  const nextEvent: Event = {
    ...body.event,
    id: eventId,
    managerIds: [managerRes.data.id]
  };

  const eventInsert = await supabase.from('events').insert(toDbEventInsert(nextEvent));
  if (eventInsert.error) {
    return NextResponse.json({ message: eventInsert.error.message }, { status: 500 });
  }

  if (nextEvent.playerIds.length > 0) {
    const rows = nextEvent.playerIds.map((playerId) => ({ event_id: eventId, player_id: playerId }));
    const playersInsert = await supabase.from('event_players').insert(rows);
    if (playersInsert.error) {
      return NextResponse.json({ message: playersInsert.error.message }, { status: 500 });
    }
  }

  return NextResponse.json({ event: nextEvent });
}
