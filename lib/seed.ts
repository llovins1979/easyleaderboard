import { AppState } from '@/lib/types';

const now = new Date().toISOString();
const currentYear = new Date().getFullYear();

export const seedState: AppState = {
  golfClubs: [
    { id: 'club_1', name: 'Lakeview Golf Club', timezone: 'America/Chicago' }
  ],
  users: [
    {
      id: 'user_mgr_1',
      email: 'manager@easyleaderboard.app',
      name: 'Morgan Club Admin',
      role: 'manager',
      clubId: 'club_1',
      managerId: 'mgr_1'
    },
    {
      id: 'user_p_1',
      email: 'alex@example.com',
      name: 'Alex Reed',
      role: 'player',
      clubId: 'club_1',
      playerId: 'player_1'
    },
    {
      id: 'user_p_2',
      email: 'sam@example.com',
      name: 'Sam Torres',
      role: 'player',
      clubId: 'club_1',
      playerId: 'player_2'
    },
    {
      id: 'user_p_3',
      email: 'jamie@example.com',
      name: 'Jamie Kim',
      role: 'player',
      clubId: 'club_1',
      playerId: 'player_3'
    },
    {
      id: 'user_p_4',
      email: 'riley@example.com',
      name: 'Riley Shah',
      role: 'player',
      clubId: 'club_1',
      playerId: 'player_4'
    }
  ],
  players: [
    { id: 'player_1', userId: 'user_p_1', clubId: 'club_1', handicapIndex: 8.2, isActive: true },
    { id: 'player_2', userId: 'user_p_2', clubId: 'club_1', handicapIndex: 11.6, isActive: true },
    { id: 'player_3', userId: 'user_p_3', clubId: 'club_1', handicapIndex: 15.4, isActive: true },
    { id: 'player_4', userId: 'user_p_4', clubId: 'club_1', handicapIndex: 6.8, isActive: true }
  ],
  managers: [
    { id: 'mgr_1', userId: 'user_mgr_1', clubId: 'club_1', title: 'Head Tournament Manager' }
  ],
  courses: [
    {
      id: 'course_1',
      clubId: 'club_1',
      name: 'Lakeview Championship Course',
      parByHole: [4, 4, 3, 5, 4, 4, 3, 5, 4, 4, 5, 3, 4, 4, 5, 3, 4, 4],
      rating: 72.4,
      slope: 132
    }
  ],
  tees: [
    {
      id: 'tee_1',
      courseId: 'course_1',
      name: 'Blue',
      gender: 'mixed',
      rating: 72.4,
      slope: 132
    },
    {
      id: 'tee_2',
      courseId: 'course_1',
      name: 'White',
      gender: 'mixed',
      rating: 70.8,
      slope: 126
    }
  ],
  events: [
    {
      id: 'event_1',
      clubId: 'club_1',
      name: 'Spring Stroke Championship',
      courseId: 'course_1',
      teeId: 'tee_1',
      date: `${currentYear}-04-20`,
      status: 'live',
      eventType: 'individual',
      scoringMethod: 'stroke_play',
      managerIds: ['mgr_1'],
      playerIds: ['player_1', 'player_2', 'player_3', 'player_4'],
      rulesText: '18 holes stroke play. Gross and net leaderboard published live.'
    },
    {
      id: 'event_2',
      clubId: 'club_1',
      name: 'Team Cup 2-Man Scramble',
      courseId: 'course_1',
      teeId: 'tee_2',
      date: `${currentYear}-05-18`,
      status: 'draft',
      eventType: 'team',
      teamFormat: '2_man_scramble',
      scoringMethod: 'scramble',
      managerIds: ['mgr_1'],
      playerIds: ['player_1', 'player_2', 'player_3', 'player_4'],
      rulesText: '2-player scramble. Minimum 6 drives each.'
    }
  ],
  scoringRules: [
    {
      id: 'rule_1',
      eventId: 'event_1',
      scoringMethod: 'stroke_play',
      winnerConfig: {
        topN: 3,
        tiesPolicy: 'split',
        categories: ['gross', 'net']
      },
      skinsConfig: {
        enabled: true,
        grossOrNet: 'net',
        carryovers: true,
        payoutMode: 'tiered',
        payoutByPlace: [50, 30, 20]
      }
    },
    {
      id: 'rule_2',
      eventId: 'event_2',
      scoringMethod: 'scramble',
      scrambleDriveRequirement: 6,
      winnerConfig: {
        topN: 2,
        tiesPolicy: 'playoff',
        categories: ['gross']
      },
      skinsConfig: {
        enabled: false,
        grossOrNet: 'gross',
        carryovers: false,
        payoutMode: 'flat',
        payoutByPlace: [100]
      }
    }
  ],
  payoutRules: [
    {
      id: 'payout_1',
      eventId: 'event_1',
      name: 'Main Pot',
      topN: 3,
      percentages: [50, 30, 20]
    }
  ],
  scorecards: [
    {
      id: 'sc_1',
      eventId: 'event_1',
      playerId: 'player_1',
      teeId: 'tee_1',
      holeScores: [4, 4, 3, 5, 4, 4, 3, 5, 4, 4, 5, 3, 4, 4, 5, 3, 4, 4],
      grossScore: 72,
      netScore: 64,
      updatedAt: now
    },
    {
      id: 'sc_2',
      eventId: 'event_1',
      playerId: 'player_2',
      teeId: 'tee_1',
      holeScores: [5, 4, 3, 6, 5, 4, 3, 5, 5, 4, 5, 3, 5, 4, 5, 3, 4, 5],
      grossScore: 83,
      netScore: 71,
      updatedAt: now
    },
    {
      id: 'sc_3',
      eventId: 'event_1',
      playerId: 'player_3',
      teeId: 'tee_1',
      holeScores: [5, 5, 3, 5, 5, 4, 4, 6, 4, 5, 6, 4, 5, 4, 5, 3, 5, 5],
      grossScore: 88,
      netScore: 73,
      updatedAt: now
    },
    {
      id: 'sc_4',
      eventId: 'event_1',
      playerId: 'player_4',
      teeId: 'tee_1',
      holeScores: [4, 4, 3, 5, 4, 3, 3, 5, 4, 4, 5, 3, 4, 4, 5, 3, 4, 4],
      grossScore: 71,
      netScore: 64,
      updatedAt: now
    }
  ],
  playerGroups: [
    {
      id: 'group_1',
      eventId: 'event_1',
      name: 'Flight A',
      playerIds: ['player_1', 'player_2'],
      teeTime: `${currentYear}-04-20T08:00:00-05:00`
    },
    {
      id: 'group_2',
      eventId: 'event_1',
      name: 'Flight B',
      playerIds: ['player_3', 'player_4'],
      teeTime: `${currentYear}-04-20T08:10:00-05:00`
    }
  ],
  teams: [
    { id: 'team_1', eventId: 'event_2', name: 'Fairway Force', captainPlayerId: 'player_1' },
    { id: 'team_2', eventId: 'event_2', name: 'Pin Hunters', captainPlayerId: 'player_4' }
  ],
  teamMemberships: [
    { id: 'tm_1', teamId: 'team_1', playerId: 'player_1' },
    { id: 'tm_2', teamId: 'team_1', playerId: 'player_3' },
    { id: 'tm_3', teamId: 'team_2', playerId: 'player_2' },
    { id: 'tm_4', teamId: 'team_2', playerId: 'player_4' }
  ],
  handicapHistory: [
    {
      id: 'hc_1',
      playerId: 'player_1',
      eventId: 'event_1',
      date: `${currentYear}-04-20`,
      handicapIndex: 8.2,
      grossScore: 72,
      netScore: 64
    }
  ],
  eventHistory: [
    {
      id: 'eh_1',
      eventId: 'event_1',
      playerId: 'player_1',
      playerName: 'Alex Reed',
      courseId: 'course_1',
      date: `${currentYear}-04-20`,
      teeId: 'tee_1',
      scoringFormat: 'stroke_play',
      holeScores: [4, 4, 3, 5, 4, 4, 3, 5, 4, 4, 5, 3, 4, 4, 5, 3, 4, 4],
      grossScore: 72,
      netScore: 64
    }
  ],
  notifications: [
    {
      id: 'n_1',
      eventId: 'event_1',
      title: 'Weather Update',
      body: 'Light rain expected at 11:00 AM. Keep pace and be ready for delays.',
      target: 'event',
      providerStatus: 'in_app',
      createdAt: now
    }
  ],
  auditLogs: [],
  moneyGames: [
    {
      id: 'mg_1',
      eventId: 'event_1',
      clubId: 'club_1',
      name: 'Sunday Nassau Pot',
      buyIn: 40,
      maxPlayers: 16,
      payoutConfig: { topN: 3, percentages: [50, 30, 20], tiesPolicy: 'split' },
      status: 'open',
      createdByUserId: 'user_mgr_1',
      createdAt: now
    }
  ],
  moneyGameEntries: [
    { id: 'mge_1', moneyGameId: 'mg_1', playerId: 'player_1', joinedAt: now, paidIn: true },
    { id: 'mge_2', moneyGameId: 'mg_1', playerId: 'player_2', joinedAt: now, paidIn: true }
  ]
};
