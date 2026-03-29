import { NextResponse } from 'next/server';
import { randomUUID } from 'node:crypto';
import { createSupabaseAdmin } from '@/lib/supabase/admin';
import { isSupabaseConfigured } from '@/lib/supabase/config';

export async function POST(req: Request) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ message: 'Supabase is not configured.' }, { status: 400 });
  }

  const body = await req.json();
  const { moneyGameId, userId }: { moneyGameId: string; userId: string } = body;

  if (!moneyGameId || !userId) {
    return NextResponse.json({ message: 'Missing fields.' }, { status: 400 });
  }

  const supabase = createSupabaseAdmin();

  const gameRes = await supabase.from('money_games').select('*').eq('id', moneyGameId).maybeSingle();
  if (!gameRes.data) {
    return NextResponse.json({ message: 'Money game not found.' }, { status: 404 });
  }

  if (gameRes.data.status !== 'open') {
    return NextResponse.json({ message: 'Money game is not open for joining.' }, { status: 400 });
  }

  const countRes = await supabase.from('money_game_entries').select('id').eq('money_game_id', moneyGameId);
  const currentCount = countRes.data?.length ?? 0;
  if (currentCount >= Number(gameRes.data.max_players)) {
    return NextResponse.json({ message: 'Money game is full.' }, { status: 400 });
  }

  const playerRes = await supabase.from('players').select('id').eq('user_id', userId).maybeSingle();
  if (!playerRes.data) {
    return NextResponse.json({ message: 'Only players can join money games.' }, { status: 403 });
  }

  const insertRes = await supabase
    .from('money_game_entries')
    .insert({
      id: randomUUID(),
      money_game_id: moneyGameId,
      player_id: playerRes.data.id,
      joined_at: new Date().toISOString(),
      paid_in: false
    })
    .select('*')
    .single();

  if (insertRes.error || !insertRes.data) {
    return NextResponse.json({ message: insertRes.error?.message ?? 'Join failed.' }, { status: 500 });
  }

  return NextResponse.json({ entry: insertRes.data });
}
