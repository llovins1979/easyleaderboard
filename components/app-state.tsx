'use client';

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { seedState } from '@/lib/seed';
import { computeLeaderboard } from '@/lib/scoring';
import { canPlayerEditScore } from '@/lib/permissions';
import { generateBalancedTeams } from '@/lib/team-generator';
import { getSupabaseBrowserClient } from '@/lib/supabase/browser';
import { AppState, AuditLog, Event, MoneyGame, MoneyGameEntry, Notification, Scorecard, User } from '@/lib/types';

interface AuthSignupInput {
  email: string;
  password: string;
  name: string;
  role: 'player' | 'manager';
  handicapIndex?: number;
}

interface AppContextType {
  state: AppState;
  dataSource: 'supabase' | 'seed';
  currentUser?: User;
  authReady: boolean;
  setCurrentUser: (userId?: string) => void;
  signInWithPassword: (email: string, password: string) => Promise<{ ok: boolean; message: string }>;
  signUpWithPassword: (input: AuthSignupInput) => Promise<{ ok: boolean; message: string }>;
  signOut: () => Promise<void>;
  refreshState: () => Promise<void>;
  updateHoleScore: (params: {
    eventId: string;
    playerId: string;
    holeIndex: number;
    score: number;
    reason: string;
  }) => Promise<{ ok: boolean; message: string }>;
  createEvent: (payload: Omit<Event, 'id' | 'managerIds' | 'playerIds'> & { playerIds: string[] }) => Promise<void>;
  updateEventPlayerAssignment: (
    eventId: string,
    playerId: string,
    inEvent: boolean
  ) => Promise<{ ok: boolean; message: string }>;
  sendNotification: (payload: Omit<Notification, 'id' | 'createdAt'>) => Promise<void>;
  createMoneyGame: (payload: {
    name: string;
    eventId?: string;
    buyIn: number;
    maxPlayers: number;
    payoutConfig: MoneyGame['payoutConfig'];
  }) => Promise<{ ok: boolean; message: string }>;
  joinMoneyGame: (moneyGameId: string) => Promise<{ ok: boolean; message: string }>;
  generateTeams: (eventId: string, teamSize: number) => ReturnType<typeof generateBalancedTeams>;
  leaderboardForEvent: (eventId: string) => ReturnType<typeof computeLeaderboard>;
}

const AUTH_STORAGE_KEY = 'easy-leaderboard-user-v1';

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>(seedState);
  const [dataSource, setDataSource] = useState<'supabase' | 'seed'>('seed');
  const [currentUserId, setCurrentUserId] = useState<string | undefined>();
  const [authReady, setAuthReady] = useState(false);

  const refreshState = async () => {
    try {
      const response = await fetch('/api/state', { cache: 'no-store' });
      if (!response.ok) return;
      const payload = await response.json();
      setState(payload.state as AppState);
      setDataSource(payload.source === 'supabase' ? 'supabase' : 'seed');
    } catch {
      setState(seedState);
      setDataSource('seed');
    }
  };

  useEffect(() => {
    const fallbackUser = localStorage.getItem(AUTH_STORAGE_KEY);
    if (fallbackUser) setCurrentUserId(fallbackUser);

    void refreshState();

    let unsubscribe = () => {};

    try {
      const supabase = getSupabaseBrowserClient();
      supabase.auth.getSession().then(({ data }) => {
        if (data.session?.user) {
          setCurrentUserId(data.session.user.id);
        }
        setAuthReady(true);
      });

      const listener = supabase.auth.onAuthStateChange((_event, session) => {
        if (session?.user) setCurrentUserId(session.user.id);
        else setCurrentUserId(undefined);
      });

      unsubscribe = () => listener.data.subscription.unsubscribe();
    } catch {
      setAuthReady(true);
    }

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (currentUserId) localStorage.setItem(AUTH_STORAGE_KEY, currentUserId);
    else localStorage.removeItem(AUTH_STORAGE_KEY);
  }, [currentUserId]);

  const currentUser = useMemo(
    () => state.users.find((u) => u.id === currentUserId),
    [state.users, currentUserId]
  );

  const setCurrentUser = (userId?: string) => {
    setCurrentUserId(userId);
  };

  const signInWithPassword: AppContextType['signInWithPassword'] = async (email, password) => {
    try {
      const supabase = getSupabaseBrowserClient();
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error || !data.user) {
        return { ok: false, message: error?.message ?? 'Login failed.' };
      }

      setCurrentUserId(data.user.id);
      if (data.session?.access_token) {
        const meRes = await fetch('/api/auth/me', {
          headers: { Authorization: `Bearer ${data.session.access_token}` }
        });
        const meData = await meRes.json();
        if (!meData.profile) {
          await fetch('/api/auth/sync-profile', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ accessToken: data.session.access_token })
          });
        }
      }
      await refreshState();

      return { ok: true, message: 'Signed in.' };
    } catch {
      return { ok: false, message: 'Supabase auth is not configured.' };
    }
  };

  const signUpWithPassword: AppContextType['signUpWithPassword'] = async (input) => {
    try {
      const supabase = getSupabaseBrowserClient();
      const signUpRes = await supabase.auth.signUp({
        email: input.email,
        password: input.password,
        options: {
          data: {
            name: input.name,
            role: input.role,
            handicapIndex: input.handicapIndex ?? 12.0
          }
        }
      });

      if (signUpRes.error) {
        return {
          ok: false,
          message: signUpRes.error.message
        };
      }

      if (signUpRes.data.session?.access_token) {
        const syncRes = await fetch('/api/auth/sync-profile', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            accessToken: signUpRes.data.session.access_token,
            name: input.name,
            role: input.role,
            handicapIndex: input.handicapIndex
          })
        });

        if (!syncRes.ok) {
          const err = await syncRes.json().catch(() => ({ message: 'Profile sync failed.' }));
          return { ok: false, message: err.message ?? 'Profile sync failed.' };
        }
      } else {
        return {
          ok: true,
          message: 'Signup submitted. Confirm your email, then log in to finish profile setup.'
        };
      }

      setCurrentUserId(signUpRes.data.user?.id);
      await refreshState();
      return { ok: true, message: 'Account created.' };
    } catch {
      return { ok: false, message: 'Supabase auth is not configured.' };
    }
  };

  const signOut = async () => {
    try {
      const supabase = getSupabaseBrowserClient();
      await supabase.auth.signOut();
    } catch {
      // no-op fallback
    }

    setCurrentUserId(undefined);
  };

  const updateHoleScore: AppContextType['updateHoleScore'] = async ({
    eventId,
    playerId,
    holeIndex,
    score,
    reason
  }) => {
    if (!currentUser) return { ok: false, message: 'Sign in required.' };

    const existing = state.scorecards.find((s) => s.eventId === eventId && s.playerId === playerId);
    if (!existing) return { ok: false, message: 'Scorecard not found.' };

    if (!canPlayerEditScore(currentUser, playerId)) {
      return { ok: false, message: 'Permission denied: cannot edit this score.' };
    }

    const res = await fetch('/api/scorecards/update', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        eventId,
        playerId,
        holeIndex,
        score,
        reason,
        editorUserId: currentUser.id
      })
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ message: 'Failed to update score.' }));
      return { ok: false, message: err.message ?? 'Failed to update score.' };
    }

    const payload = await res.json();
    const nextScorecard = payload.scorecard as Scorecard;
    const auditLog = payload.auditLog as AuditLog | null;

    setState((prev) => ({
      ...prev,
      scorecards: prev.scorecards.map((s) => (s.id === nextScorecard.id ? nextScorecard : s)),
      auditLogs: auditLog ? [auditLog, ...prev.auditLogs] : prev.auditLogs
    }));

    return { ok: true, message: 'Score updated.' };
  };

  const createEvent: AppContextType['createEvent'] = async (payload) => {
    if (!currentUser || currentUser.role !== 'manager') return;

    const response = await fetch('/api/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event: {
          ...payload,
          playerIds: payload.playerIds
        },
        managerUserId: currentUser.id
      })
    });

    if (!response.ok) return;

    const data = await response.json();
    const event = data.event as Event;

    setState((prev) => ({
      ...prev,
      events: [event, ...prev.events]
    }));
  };

  const updateEventPlayerAssignment: AppContextType['updateEventPlayerAssignment'] = async (
    eventId,
    playerId,
    inEvent
  ) => {
    if (!currentUser || currentUser.role !== 'manager') {
      return { ok: false, message: 'Only managers can edit event players.' };
    }

    const res = await fetch(`/api/events/${eventId}/players`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        managerUserId: currentUser.id,
        playerId,
        inEvent
      })
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      return { ok: false, message: data.message ?? 'Failed to update event players.' };
    }

    const nextPlayerIds = (data.playerIds ?? []) as string[];

    setState((prev) => ({
      ...prev,
      events: prev.events.map((event) =>
        event.id === eventId ? { ...event, playerIds: nextPlayerIds } : event
      )
    }));

    return { ok: true, message: 'Event players updated.' };
  };

  const sendNotification: AppContextType['sendNotification'] = async (payload) => {
    const notification: Notification = {
      ...payload,
      id: `notification_${Date.now()}`,
      createdAt: new Date().toISOString()
    };

    setState((prev) => ({
      ...prev,
      notifications: [notification, ...prev.notifications]
    }));

    await fetch('/api/notifications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
  };

  const createMoneyGame: AppContextType['createMoneyGame'] = async (payload) => {
    if (!currentUser || currentUser.role !== 'manager') {
      return { ok: false, message: 'Only managers can create money games.' };
    }

    const res = await fetch('/api/money-games', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...payload, managerUserId: currentUser.id })
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      return { ok: false, message: data.message ?? 'Failed to create money game.' };
    }

    const gameRow = data.moneyGame;
    const moneyGame: MoneyGame = {
      id: gameRow.id,
      eventId: gameRow.event_id ?? undefined,
      clubId: gameRow.club_id,
      name: gameRow.name,
      buyIn: Number(gameRow.buy_in),
      maxPlayers: Number(gameRow.max_players),
      payoutConfig: gameRow.payout_config,
      status: gameRow.status,
      createdByUserId: gameRow.created_by_user_id,
      createdAt: gameRow.created_at
    };

    setState((prev) => ({
      ...prev,
      moneyGames: [moneyGame, ...prev.moneyGames]
    }));

    return { ok: true, message: 'Money game created.' };
  };

  const joinMoneyGame: AppContextType['joinMoneyGame'] = async (moneyGameId) => {
    if (!currentUser || currentUser.role !== 'player') {
      return { ok: false, message: 'Only players can join money games.' };
    }

    const res = await fetch('/api/money-games/join', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ moneyGameId, userId: currentUser.id })
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      return { ok: false, message: data.message ?? 'Failed to join money game.' };
    }

    const entryRow = data.entry;
    const entry: MoneyGameEntry = {
      id: entryRow.id,
      moneyGameId: entryRow.money_game_id,
      playerId: entryRow.player_id,
      joinedAt: entryRow.joined_at,
      paidIn: Boolean(entryRow.paid_in)
    };

    setState((prev) => ({
      ...prev,
      moneyGameEntries: [entry, ...prev.moneyGameEntries]
    }));

    return { ok: true, message: 'Joined money game.' };
  };

  const generateTeamsForEvent: AppContextType['generateTeams'] = (eventId, teamSize) => {
    const event = state.events.find((e) => e.id === eventId);
    if (!event) return { teams: [] };
    return generateBalancedTeams(state, event.playerIds, teamSize);
  };

  const leaderboardForEvent = (eventId: string) => computeLeaderboard(state, eventId);

  return (
    <AppContext.Provider
      value={{
        state,
        dataSource,
        currentUser,
        authReady,
        setCurrentUser,
        signInWithPassword,
        signUpWithPassword,
        signOut,
        refreshState,
        updateHoleScore,
        createEvent,
        updateEventPlayerAssignment,
        sendNotification,
        createMoneyGame,
        joinMoneyGame,
        generateTeams: generateTeamsForEvent,
        leaderboardForEvent
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppState() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppState must be used inside AppStateProvider');
  return ctx;
}
