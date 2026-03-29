import {
  AppState,
  AuditLog,
  Course,
  Event,
  EventHistoryRecord,
  GolfClub,
  Manager,
  MoneyGame,
  MoneyGameEntry,
  Notification,
  PayoutRule,
  Player,
  PlayerGroup,
  ScoringRule,
  Scorecard,
  Team,
  TeamMembership,
  Tee,
  User
} from '@/lib/types';

const toDateString = (value: string | null | undefined) => value ?? new Date().toISOString().slice(0, 10);

export const mapGolfClubs = (rows: any[]): GolfClub[] =>
  rows.map((r) => ({
    id: r.id,
    name: r.name,
    timezone: r.timezone
  }));

export const mapUsers = (rows: any[]): User[] =>
  rows.map((r) => ({
    id: r.id,
    email: r.email,
    name: r.name,
    role: r.role,
    clubId: r.club_id
  }));

export const mapPlayers = (rows: any[]): Player[] =>
  rows.map((r) => ({
    id: r.id,
    userId: r.user_id,
    clubId: r.club_id,
    handicapIndex: Number(r.handicap_index),
    isActive: Boolean(r.is_active)
  }));

export const mapManagers = (rows: any[]): Manager[] =>
  rows.map((r) => ({
    id: r.id,
    userId: r.user_id,
    clubId: r.club_id,
    title: r.title
  }));

export const enrichUsersWithRoleLinks = (users: User[], players: Player[], managers: Manager[]): User[] =>
  users.map((u) => ({
    ...u,
    playerId: players.find((p) => p.userId === u.id)?.id,
    managerId: managers.find((m) => m.userId === u.id)?.id
  }));

export const mapCourses = (rows: any[]): Course[] =>
  rows.map((r) => ({
    id: r.id,
    clubId: r.club_id,
    name: r.name,
    parByHole: r.par_by_hole ?? [],
    rating: Number(r.rating),
    slope: Number(r.slope)
  }));

export const mapTees = (rows: any[]): Tee[] =>
  rows.map((r) => ({
    id: r.id,
    courseId: r.course_id,
    name: r.name,
    gender: r.gender,
    rating: Number(r.rating),
    slope: Number(r.slope)
  }));

export const mapEvents = (rows: any[], eventPlayers: any[], managers: Manager[]): Event[] =>
  rows.map((r) => ({
    id: r.id,
    clubId: r.club_id,
    name: r.name,
    courseId: r.course_id,
    teeId: r.tee_id,
    date: toDateString(r.event_date),
    status: r.status,
    eventType: r.event_type,
    teamFormat: r.team_format ?? undefined,
    scoringMethod: r.scoring_method,
    managerIds: managers.filter((m) => m.clubId === r.club_id).map((m) => m.id),
    playerIds: eventPlayers.filter((ep) => ep.event_id === r.id).map((ep) => ep.player_id),
    rulesText: r.rules_text ?? ''
  }));

export const mapScorecards = (rows: any[]): Scorecard[] =>
  rows.map((r) => ({
    id: r.id,
    eventId: r.event_id,
    playerId: r.player_id,
    teeId: r.tee_id,
    holeScores: r.hole_scores ?? [],
    grossScore: Number(r.gross_score),
    netScore: r.net_score == null ? undefined : Number(r.net_score),
    teamId: r.team_id ?? undefined,
    updatedAt: r.updated_at ?? new Date().toISOString()
  }));

export const mapScoringRules = (rows: any[]): ScoringRule[] =>
  rows.map((r) => ({
    id: r.id,
    eventId: r.event_id,
    scoringMethod: r.scoring_method,
    stablefordPoints: r.stableford_points ?? undefined,
    bestBallCount: r.best_ball_count ?? undefined,
    scrambleDriveRequirement: r.scramble_drive_requirement ?? undefined,
    winnerConfig: r.winner_config,
    skinsConfig: r.skins_config
  }));

export const mapPayoutRules = (rows: any[]): PayoutRule[] =>
  rows.map((r) => ({
    id: r.id,
    eventId: r.event_id,
    name: r.name,
    topN: Number(r.top_n),
    percentages: (r.percentages ?? []).map(Number)
  }));

export const mapGroups = (rows: any[]): PlayerGroup[] =>
  rows.map((r) => ({
    id: r.id,
    eventId: r.event_id,
    name: r.name,
    playerIds: r.player_ids ?? [],
    teeTime: r.tee_time ?? undefined
  }));

export const mapTeams = (rows: any[]): Team[] =>
  rows.map((r) => ({
    id: r.id,
    eventId: r.event_id,
    name: r.name,
    captainPlayerId: r.captain_player_id ?? undefined
  }));

export const mapMemberships = (rows: any[]): TeamMembership[] =>
  rows.map((r) => ({
    id: r.id,
    teamId: r.team_id,
    playerId: r.player_id
  }));

export const mapEventHistory = (rows: any[]): EventHistoryRecord[] =>
  rows.map((r) => ({
    id: r.id,
    eventId: r.event_id,
    playerId: r.player_id,
    playerName: r.player_name,
    courseId: r.course_id,
    date: toDateString(r.round_date),
    teeId: r.tee_id,
    scoringFormat: r.scoring_format,
    holeScores: r.hole_scores ?? [],
    grossScore: Number(r.gross_score),
    netScore: r.net_score == null ? undefined : Number(r.net_score),
    teamId: r.team_id ?? undefined
  }));

export const mapNotifications = (rows: any[]): Notification[] =>
  rows.map((r) => ({
    id: r.id,
    eventId: r.event_id ?? undefined,
    groupId: r.group_id ?? undefined,
    title: r.title,
    body: r.body,
    target: r.target,
    providerStatus: r.provider_status,
    createdAt: r.created_at ?? new Date().toISOString()
  }));

export const mapAuditLogs = (rows: any[]): AuditLog[] =>
  rows.map((r) => ({
    id: r.id,
    eventId: r.event_id,
    scorecardId: r.scorecard_id,
    editorUserId: r.editor_user_id,
    reason: r.reason,
    previousHoleScores: r.previous_hole_scores ?? [],
    newHoleScores: r.new_hole_scores ?? [],
    editedAt: r.edited_at ?? new Date().toISOString()
  }));

export const mapMoneyGames = (rows: any[]): MoneyGame[] =>
  rows.map((r) => ({
    id: r.id,
    eventId: r.event_id ?? undefined,
    clubId: r.club_id,
    name: r.name,
    buyIn: Number(r.buy_in),
    maxPlayers: Number(r.max_players),
    payoutConfig: r.payout_config,
    status: r.status,
    createdByUserId: r.created_by_user_id,
    createdAt: r.created_at ?? new Date().toISOString()
  }));

export const mapMoneyGameEntries = (rows: any[]): MoneyGameEntry[] =>
  rows.map((r) => ({
    id: r.id,
    moneyGameId: r.money_game_id,
    playerId: r.player_id,
    joinedAt: r.joined_at ?? new Date().toISOString(),
    paidIn: Boolean(r.paid_in)
  }));

export const toDbEventInsert = (event: Event) => ({
  id: event.id,
  club_id: event.clubId,
  name: event.name,
  course_id: event.courseId,
  tee_id: event.teeId,
  event_date: event.date,
  status: event.status,
  event_type: event.eventType,
  team_format: event.teamFormat ?? null,
  scoring_method: event.scoringMethod,
  rules_text: event.rulesText
});

export const buildAppState = (parts: {
  users: User[];
  players: Player[];
  managers: Manager[];
  golfClubs: GolfClub[];
  courses: Course[];
  tees: Tee[];
  events: Event[];
  scoringRules: ScoringRule[];
  payoutRules: PayoutRule[];
  scorecards: Scorecard[];
  playerGroups: PlayerGroup[];
  teams: Team[];
  teamMemberships: TeamMembership[];
  handicapHistory: AppState['handicapHistory'];
  eventHistory: EventHistoryRecord[];
  notifications: Notification[];
  auditLogs: AuditLog[];
  moneyGames: MoneyGame[];
  moneyGameEntries: MoneyGameEntry[];
}): AppState => ({
  users: parts.users,
  players: parts.players,
  managers: parts.managers,
  golfClubs: parts.golfClubs,
  courses: parts.courses,
  tees: parts.tees,
  events: parts.events,
  scoringRules: parts.scoringRules,
  payoutRules: parts.payoutRules,
  scorecards: parts.scorecards,
  playerGroups: parts.playerGroups,
  teams: parts.teams,
  teamMemberships: parts.teamMemberships,
  handicapHistory: parts.handicapHistory,
  eventHistory: parts.eventHistory,
  notifications: parts.notifications,
  auditLogs: parts.auditLogs,
  moneyGames: parts.moneyGames,
  moneyGameEntries: parts.moneyGameEntries
});
