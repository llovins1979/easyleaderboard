export type UserRole = 'player' | 'manager';

export type ScoringMethod =
  | 'stroke_play'
  | 'stableford'
  | 'best_ball'
  | 'scramble'
  | 'team_total';

export type EventType = 'individual' | 'team';

export type TeamFormat =
  | '2_man'
  | '3_man'
  | '4_man'
  | '2_man_scramble'
  | '3_man_scramble'
  | '4_man_scramble'
  | '4_ball'
  | 'custom';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  clubId?: string;
  playerId?: string;
  managerId?: string;
}

export interface Player {
  id: string;
  userId: string;
  clubId: string;
  handicapIndex: number;
  isActive: boolean;
}

export interface Manager {
  id: string;
  userId: string;
  clubId: string;
  title: string;
}

export interface GolfClub {
  id: string;
  name: string;
  timezone: string;
}

export interface Course {
  id: string;
  clubId: string;
  name: string;
  parByHole: number[];
  rating: number;
  slope: number;
}

export interface Tee {
  id: string;
  courseId: string;
  name: string;
  gender: 'mens' | 'womens' | 'mixed';
  rating: number;
  slope: number;
}

export interface WinnerRuleConfig {
  topN: 1 | 2 | 3 | 4;
  tiesPolicy: 'split' | 'playoff' | 'countback';
  categories: Array<'gross' | 'net'>;
}

export interface SkinsRuleConfig {
  enabled: boolean;
  grossOrNet: 'gross' | 'net';
  carryovers: boolean;
  payoutMode: 'flat' | 'tiered';
  payoutByPlace: number[];
}

export interface ScoringRule {
  id: string;
  eventId: string;
  scoringMethod: ScoringMethod;
  stablefordPoints?: Record<number, number>;
  bestBallCount?: number;
  scrambleDriveRequirement?: number;
  winnerConfig: WinnerRuleConfig;
  skinsConfig: SkinsRuleConfig;
}

export interface PayoutRule {
  id: string;
  eventId: string;
  name: string;
  topN: number;
  percentages: number[];
}

export interface Event {
  id: string;
  clubId: string;
  name: string;
  courseId: string;
  teeId: string;
  date: string;
  status: 'draft' | 'live' | 'completed';
  eventType: EventType;
  teamFormat?: TeamFormat;
  scoringMethod: ScoringMethod;
  managerIds: string[];
  playerIds: string[];
  rulesText: string;
}

export interface Scorecard {
  id: string;
  eventId: string;
  playerId: string;
  teeId: string;
  holeScores: number[];
  grossScore: number;
  netScore?: number;
  teamId?: string;
  updatedAt: string;
}

export interface LeaderboardEntry {
  playerId: string;
  playerName: string;
  teamId?: string;
  gross: number;
  net?: number;
  points?: number;
  thru: number;
  position: number;
}

export interface PlayerGroup {
  id: string;
  eventId: string;
  name: string;
  playerIds: string[];
  teeTime?: string;
}

export interface Team {
  id: string;
  eventId: string;
  name: string;
  captainPlayerId?: string;
}

export interface TeamMembership {
  id: string;
  teamId: string;
  playerId: string;
}

export interface HandicapHistoryRecord {
  id: string;
  playerId: string;
  eventId: string;
  date: string;
  handicapIndex: number;
  grossScore: number;
  netScore?: number;
}

export interface EventHistoryRecord {
  id: string;
  eventId: string;
  playerId: string;
  playerName: string;
  courseId: string;
  date: string;
  teeId: string;
  scoringFormat: ScoringMethod;
  holeScores: number[];
  grossScore: number;
  netScore?: number;
  teamId?: string;
}

export interface Notification {
  id: string;
  eventId?: string;
  groupId?: string;
  title: string;
  body: string;
  target: 'event' | 'group' | 'system';
  providerStatus: 'in_app' | 'queued_for_sms';
  createdAt: string;
}

export interface AuditLog {
  id: string;
  eventId: string;
  scorecardId: string;
  editorUserId: string;
  reason: string;
  previousHoleScores: number[];
  newHoleScores: number[];
  editedAt: string;
}

export interface LeaderboardSnapshot {
  eventId: string;
  generatedAt: string;
  entries: LeaderboardEntry[];
}

export interface MoneyGame {
  id: string;
  eventId?: string;
  clubId: string;
  name: string;
  buyIn: number;
  maxPlayers: number;
  payoutConfig: {
    topN: number;
    percentages: number[];
    tiesPolicy: 'split' | 'carryover';
  };
  status: 'open' | 'locked' | 'settled';
  createdByUserId: string;
  createdAt: string;
}

export interface MoneyGameEntry {
  id: string;
  moneyGameId: string;
  playerId: string;
  joinedAt: string;
  paidIn: boolean;
 }

export interface AppState {
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
  handicapHistory: HandicapHistoryRecord[];
  eventHistory: EventHistoryRecord[];
  notifications: Notification[];
  auditLogs: AuditLog[];
  moneyGames: MoneyGame[];
  moneyGameEntries: MoneyGameEntry[];
}
