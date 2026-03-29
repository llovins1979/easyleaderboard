import {
  AppState,
  Event,
  LeaderboardEntry,
  Scorecard,
  ScoringMethod,
  Team,
  TeamMembership
} from '@/lib/types';

const stablefordDefaultMap: Record<string, number> = {
  '-3': 5,
  '-2': 4,
  '-1': 3,
  '0': 2,
  '1': 1,
  '2': 0,
  '3': 0
};

const total = (arr: number[]) => arr.reduce((sum, n) => sum + n, 0);

export const calculateGross = (holeScores: number[]) => total(holeScores.filter((v) => v > 0));

export const calculateNetScore = (gross: number, handicapIndex: number) => Math.round(gross - handicapIndex);

const scoreToPar = (event: Event, state: AppState, scorecard: Scorecard): number => {
  const course = state.courses.find((c) => c.id === event.courseId);
  if (!course) return 0;
  const par = total(course.parByHole.slice(0, scorecard.holeScores.length));
  return scorecard.grossScore - par;
};

export const stablefordPoints = (
  event: Event,
  state: AppState,
  scorecard: Scorecard,
  method: ScoringMethod
): number | undefined => {
  if (method !== 'stableford') return undefined;
  const delta = scoreToPar(event, state, scorecard);
  const key = String(Math.max(-3, Math.min(3, delta)));
  return stablefordDefaultMap[key] ?? 0;
};

export const computeLeaderboard = (state: AppState, eventId: string): LeaderboardEntry[] => {
  const event = state.events.find((e) => e.id === eventId);
  if (!event) return [];

  const scorecards = state.scorecards.filter((s) => s.eventId === eventId);
  const base = scorecards.map((scorecard) => {
    const player = state.players.find((p) => p.id === scorecard.playerId);
    const user = state.users.find((u) => u.playerId === scorecard.playerId);
    const playerName = user?.name ?? player?.id ?? 'Unknown';
    return {
      playerId: scorecard.playerId,
      playerName,
      teamId: scorecard.teamId,
      gross: scorecard.grossScore,
      net: scorecard.netScore,
      points: stablefordPoints(event, state, scorecard, event.scoringMethod),
      thru: scorecard.holeScores.filter((s) => s > 0).length
    };
  });

  const sorted = [...base].sort((a, b) => {
    if (event.scoringMethod === 'stableford') return (b.points ?? 0) - (a.points ?? 0);
    return a.gross - b.gross;
  });

  return sorted.map((entry, index) => ({ ...entry, position: index + 1 }));
};

export const computeTeamScores = (
  eventId: string,
  scorecards: Scorecard[],
  teams: Team[],
  teamMemberships: TeamMembership[]
) => {
  return teams
    .filter((team) => team.eventId === eventId)
    .map((team) => {
      const members = teamMemberships.filter((m) => m.teamId === team.id).map((m) => m.playerId);
      const teamTotal = scorecards
        .filter((s) => s.eventId === eventId && members.includes(s.playerId))
        .reduce((sum, sc) => sum + sc.grossScore, 0);

      return {
        teamId: team.id,
        teamName: team.name,
        teamTotal,
        memberCount: members.length
      };
    })
    .sort((a, b) => a.teamTotal - b.teamTotal);
};
