import { NextResponse } from 'next/server';
import { randomUUID } from 'node:crypto';
import { createSupabaseAdmin } from '@/lib/supabase/admin';
import { isSupabaseConfigured } from '@/lib/supabase/config';

interface SyncPayload {
  accessToken: string;
  name?: string;
  role?: 'player' | 'manager';
  handicapIndex?: number;
}

export async function POST(req: Request) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ message: 'Supabase is not configured.' }, { status: 400 });
  }

  const body = (await req.json()) as SyncPayload;
  if (!body.accessToken) {
    return NextResponse.json({ message: 'Missing access token.' }, { status: 400 });
  }

  const supabase = createSupabaseAdmin();
  const authRes = await supabase.auth.getUser(body.accessToken);

  if (!authRes.data.user) {
    return NextResponse.json({ message: 'Invalid access token.' }, { status: 401 });
  }

  const authUser = authRes.data.user;
  const userId = authUser.id;
  const metadata = authUser.user_metadata ?? {};
  const resolvedName =
    body.name ??
    metadata.name ??
    authUser.email?.split('@')[0] ??
    'Easy Leaderboard User';
  const resolvedRole: 'player' | 'manager' =
    body.role ?? (metadata.role === 'manager' ? 'manager' : 'player');
  const resolvedHandicap = body.handicapIndex ?? Number(metadata.handicapIndex ?? 12.0);

  let clubId = 'club_default';
  const clubLookup = await supabase.from('golf_clubs').select('id').limit(1).maybeSingle();
  if (clubLookup.data?.id) {
    clubId = clubLookup.data.id;
  } else {
    await supabase.from('golf_clubs').insert({
      id: clubId,
      name: 'Easy Leaderboard Club',
      timezone: 'America/Chicago'
    });
  }

  const upsertUser = await supabase.from('users').upsert(
    {
      id: userId,
      email: authUser.email ?? `${userId}@example.com`,
      name: resolvedName,
      role: resolvedRole,
      club_id: clubId
    },
    { onConflict: 'id' }
  );

  if (upsertUser.error) {
    return NextResponse.json({ message: upsertUser.error.message }, { status: 500 });
  }

  if (resolvedRole === 'player') {
    const playerId = `player_${userId}`;
    await supabase.from('players').upsert(
      {
        id: playerId,
        user_id: userId,
        club_id: clubId,
        handicap_index: resolvedHandicap,
        is_active: true
      },
      { onConflict: 'user_id' }
    );
  }

  if (resolvedRole === 'manager') {
    const managerId = `mgr_${userId}`;
    await supabase.from('managers').upsert(
      {
        id: managerId,
        user_id: userId,
        club_id: clubId,
        title: 'Tournament Manager'
      },
      { onConflict: 'user_id' }
    );
  }

  const meRes = await supabase.from('users').select('*').eq('id', userId).maybeSingle();

  return NextResponse.json({ profile: meRes.data });
}
