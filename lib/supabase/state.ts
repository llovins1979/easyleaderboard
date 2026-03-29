import { seedState } from '@/lib/seed';
import { AppState } from '@/lib/types';
import { createSupabaseAdmin } from '@/lib/supabase/admin';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import {
  buildAppState,
  enrichUsersWithRoleLinks,
  mapAuditLogs,
  mapCourses,
  mapEvents,
  mapGolfClubs,
  mapGroups,
  mapManagers,
  mapMemberships,
  mapMoneyGameEntries,
  mapMoneyGames,
  mapNotifications,
  mapPayoutRules,
  mapPlayers,
  mapScorecards,
  mapScoringRules,
  mapTeams,
  mapTees,
  mapUsers,
  mapEventHistory
} from '@/lib/supabase/mappers';

const safeData = <T>(result: { data: T[] | null; error: unknown }, fallback: T[] = []) =>
  result.error || !result.data ? fallback : result.data;

export async function loadAppState(): Promise<{ state: AppState; source: 'supabase' | 'seed' }> {
  if (!isSupabaseConfigured()) {
    return { state: seedState, source: 'seed' };
  }

  try {
    const supabase = createSupabaseAdmin();

    const [
      clubsRes,
      usersRes,
      playersRes,
      managersRes,
      coursesRes,
      teesRes,
      eventsRes,
      eventPlayersRes,
      scoringRulesRes,
      payoutRulesRes,
      scorecardsRes,
      groupsRes,
      teamsRes,
      membershipsRes,
      handicapRes,
      eventHistoryRes,
      notificationsRes,
      auditRes,
      moneyGamesRes,
      moneyGameEntriesRes
    ] = await Promise.all([
      supabase.from('golf_clubs').select('*'),
      supabase.from('users').select('*'),
      supabase.from('players').select('*'),
      supabase.from('managers').select('*'),
      supabase.from('courses').select('*'),
      supabase.from('tees').select('*'),
      supabase.from('events').select('*').order('event_date', { ascending: false }),
      supabase.from('event_players').select('*'),
      supabase.from('scoring_rules').select('*'),
      supabase.from('payout_rules').select('*'),
      supabase.from('scorecards').select('*'),
      supabase.from('player_groups').select('*'),
      supabase.from('teams').select('*'),
      supabase.from('team_memberships').select('*'),
      supabase.from('handicap_history').select('*'),
      supabase.from('event_history').select('*').order('round_date', { ascending: false }),
      supabase.from('notifications').select('*').order('created_at', { ascending: false }),
      supabase.from('audit_logs').select('*').order('edited_at', { ascending: false }),
      supabase.from('money_games').select('*').order('created_at', { ascending: false }),
      supabase.from('money_game_entries').select('*')
    ]);

    const golfClubs = mapGolfClubs(safeData(clubsRes));
    const players = mapPlayers(safeData(playersRes));
    const managers = mapManagers(safeData(managersRes));
    const users = enrichUsersWithRoleLinks(mapUsers(safeData(usersRes)), players, managers);
    const courses = mapCourses(safeData(coursesRes));
    const tees = mapTees(safeData(teesRes));
    const events = mapEvents(safeData(eventsRes), safeData(eventPlayersRes), managers);

    // If key tables are empty, return deterministic demo state.
    if (users.length === 0 || events.length === 0) {
      return { state: seedState, source: 'seed' };
    }

    const state = buildAppState({
      users,
      players,
      managers,
      golfClubs,
      courses,
      tees,
      events,
      scoringRules: mapScoringRules(safeData(scoringRulesRes)),
      payoutRules: mapPayoutRules(safeData(payoutRulesRes)),
      scorecards: mapScorecards(safeData(scorecardsRes)),
      playerGroups: mapGroups(safeData(groupsRes)),
      teams: mapTeams(safeData(teamsRes)),
      teamMemberships: mapMemberships(safeData(membershipsRes)),
      handicapHistory: safeData(handicapRes).map((r: any) => ({
        id: r.id,
        playerId: r.player_id,
        eventId: r.event_id,
        date: r.round_date,
        handicapIndex: Number(r.handicap_index),
        grossScore: Number(r.gross_score),
        netScore: r.net_score == null ? undefined : Number(r.net_score)
      })),
      eventHistory: mapEventHistory(safeData(eventHistoryRes)),
      notifications: mapNotifications(safeData(notificationsRes)),
      auditLogs: mapAuditLogs(safeData(auditRes)),
      moneyGames: mapMoneyGames(safeData(moneyGamesRes)),
      moneyGameEntries: mapMoneyGameEntries(safeData(moneyGameEntriesRes))
    });

    return { state, source: 'supabase' };
  } catch {
    return { state: seedState, source: 'seed' };
  }
}
