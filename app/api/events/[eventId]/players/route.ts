import { NextResponse } from 'next/server';
import { createSupabaseAdmin } from '@/lib/supabase/admin';
import { isSupabaseConfigured } from '@/lib/supabase/config';

interface PlayerAssignmentPayload {
  managerUserId: string;
  playerId: string;
  inEvent: boolean;
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ eventId: string }> }
) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ message: 'Supabase is not configured.' }, { status: 400 });
  }

  const { eventId } = await params;
  const body = (await req.json()) as PlayerAssignmentPayload;

  if (!body.managerUserId || !body.playerId) {
    return NextResponse.json({ message: 'Missing required fields.' }, { status: 400 });
  }

  const supabase = createSupabaseAdmin();

  const managerUserRes = await supabase
    .from('users')
    .select('id, role, club_id')
    .eq('id', body.managerUserId)
    .maybeSingle();

  if (!managerUserRes.data || managerUserRes.data.role !== 'manager') {
    return NextResponse.json({ message: 'Only managers can edit event players.' }, { status: 403 });
  }

  const eventRes = await supabase
    .from('events')
    .select('id, club_id')
    .eq('id', eventId)
    .maybeSingle();

  if (!eventRes.data) {
    return NextResponse.json({ message: 'Event not found.' }, { status: 404 });
  }

  if (eventRes.data.club_id !== managerUserRes.data.club_id) {
    return NextResponse.json({ message: 'Manager is not allowed to edit this event.' }, { status: 403 });
  }

  if (body.inEvent) {
    const addRes = await supabase
      .from('event_players')
      .upsert({ event_id: eventId, player_id: body.playerId }, { onConflict: 'event_id,player_id' });

    if (addRes.error) {
      return NextResponse.json({ message: addRes.error.message }, { status: 500 });
    }
  } else {
    const removeRes = await supabase
      .from('event_players')
      .delete()
      .eq('event_id', eventId)
      .eq('player_id', body.playerId);

    if (removeRes.error) {
      return NextResponse.json({ message: removeRes.error.message }, { status: 500 });
    }
  }

  const playerRowsRes = await supabase
    .from('event_players')
    .select('player_id')
    .eq('event_id', eventId);

  if (playerRowsRes.error) {
    return NextResponse.json({ message: playerRowsRes.error.message }, { status: 500 });
  }

  return NextResponse.json({
    eventId,
    playerIds: (playerRowsRes.data ?? []).map((row) => row.player_id)
  });
}
