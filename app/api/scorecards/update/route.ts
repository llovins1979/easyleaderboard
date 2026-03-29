import { NextResponse } from 'next/server';
import { randomUUID } from 'node:crypto';
import { createSupabaseAdmin } from '@/lib/supabase/admin';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import { calculateGross, calculateNetScore } from '@/lib/scoring';

interface ScoreUpdatePayload {
  eventId: string;
  playerId: string;
  holeIndex: number;
  score: number;
  reason: string;
  editorUserId: string;
}

export async function PATCH(req: Request) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ message: 'Supabase is not configured.' }, { status: 400 });
  }

  const body = (await req.json()) as ScoreUpdatePayload;
  const supabase = createSupabaseAdmin();

  const userRes = await supabase.from('users').select('id, role').eq('id', body.editorUserId).maybeSingle();
  if (!userRes.data) {
    return NextResponse.json({ message: 'Editor user not found.' }, { status: 404 });
  }

  const scorecardRes = await supabase
    .from('scorecards')
    .select('*')
    .eq('event_id', body.eventId)
    .eq('player_id', body.playerId)
    .maybeSingle();

  if (!scorecardRes.data) {
    return NextResponse.json({ message: 'Scorecard not found.' }, { status: 404 });
  }

  if (userRes.data.role === 'player') {
    const editorPlayerRes = await supabase
      .from('players')
      .select('id')
      .eq('user_id', body.editorUserId)
      .maybeSingle();

    if (!editorPlayerRes.data || editorPlayerRes.data.id !== body.playerId) {
      return NextResponse.json({ message: 'Permission denied: player can edit only their own score.' }, { status: 403 });
    }
  }

  const playerRes = await supabase.from('players').select('handicap_index').eq('id', body.playerId).maybeSingle();
  if (!playerRes.data) {
    return NextResponse.json({ message: 'Player profile not found.' }, { status: 404 });
  }

  const previousHoleScores: number[] = scorecardRes.data.hole_scores ?? [];
  const nextHoleScores = [...previousHoleScores];
  nextHoleScores[body.holeIndex] = body.score;

  const grossScore = calculateGross(nextHoleScores);
  const netScore = calculateNetScore(grossScore, Number(playerRes.data.handicap_index));

  const updateRes = await supabase
    .from('scorecards')
    .update({
      hole_scores: nextHoleScores,
      gross_score: grossScore,
      net_score: netScore,
      updated_at: new Date().toISOString()
    })
    .eq('id', scorecardRes.data.id)
    .select('*')
    .single();

  if (updateRes.error || !updateRes.data) {
    return NextResponse.json({ message: updateRes.error?.message ?? 'Failed to update scorecard.' }, { status: 500 });
  }

  const auditRecord = {
    id: randomUUID(),
    event_id: body.eventId,
    scorecard_id: scorecardRes.data.id,
    editor_user_id: body.editorUserId,
    reason: body.reason,
    previous_hole_scores: previousHoleScores,
    new_hole_scores: nextHoleScores,
    edited_at: new Date().toISOString()
  };

  const auditRes = await supabase.from('audit_logs').insert(auditRecord).select('*').single();

  return NextResponse.json({
    scorecard: {
      id: updateRes.data.id,
      eventId: updateRes.data.event_id,
      playerId: updateRes.data.player_id,
      teeId: updateRes.data.tee_id,
      holeScores: updateRes.data.hole_scores,
      grossScore: Number(updateRes.data.gross_score),
      netScore: updateRes.data.net_score == null ? undefined : Number(updateRes.data.net_score),
      teamId: updateRes.data.team_id ?? undefined,
      updatedAt: updateRes.data.updated_at
    },
    auditLog: auditRes.data
      ? {
          id: auditRes.data.id,
          eventId: auditRes.data.event_id,
          scorecardId: auditRes.data.scorecard_id,
          editorUserId: auditRes.data.editor_user_id,
          reason: auditRes.data.reason,
          previousHoleScores: auditRes.data.previous_hole_scores,
          newHoleScores: auditRes.data.new_hole_scores,
          editedAt: auditRes.data.edited_at
        }
      : null
  });
}
