import { AppState, Player } from '@/lib/types';

export interface TeamGenerationResult {
  teams: Array<{
    name: string;
    playerIds: string[];
    averageHandicap: number;
    averageGross: number;
  }>;
}

const average = (nums: number[]) => (nums.length ? nums.reduce((a, b) => a + b, 0) / nums.length : 0);

interface EnrichedPlayer extends Player {
  avgGross: number;
}

const grossAverageForPlayer = (state: AppState, playerId: string, year: number): number => {
  const rounds = state.eventHistory.filter(
    (r) => r.playerId === playerId && new Date(r.date).getFullYear() === year
  );
  return average(rounds.map((r) => r.grossScore));
};

export const generateBalancedTeams = (
  state: AppState,
  playerIds: string[],
  teamSize: number,
  year = new Date().getFullYear()
): TeamGenerationResult => {
  const players = state.players.filter((p) => playerIds.includes(p.id));
  const enriched = players
    .map((p) => ({
      ...p,
      avgGross: grossAverageForPlayer(state, p.id, year)
    }))
    .sort((a, b) => (a.handicapIndex + a.avgGross / 10) - (b.handicapIndex + b.avgGross / 10));

  const teamCount = Math.max(1, Math.ceil(enriched.length / teamSize));
  const teams: Array<{ name: string; players: EnrichedPlayer[] }> = Array.from(
    { length: teamCount },
    (_, i) => ({ name: `Auto Team ${i + 1}`, players: [] })
  );

  enriched.forEach((player, idx) => {
    const cycle = Math.floor(idx / teamCount);
    const reverse = cycle % 2 === 1;
    const targetIndex = reverse ? teamCount - 1 - (idx % teamCount) : idx % teamCount;
    if (teams[targetIndex].players.length < teamSize) teams[targetIndex].players.push(player);
  });

  return {
    teams: teams.map((team) => ({
      name: team.name,
      playerIds: team.players.map((p) => p.id),
      averageHandicap: Number(average(team.players.map((p) => p.handicapIndex)).toFixed(2)),
      averageGross: Number(average(team.players.map((p) => p.avgGross ?? 0)).toFixed(2))
    }))
  };
};
