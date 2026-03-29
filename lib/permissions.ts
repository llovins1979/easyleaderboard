import { User } from '@/lib/types';

export const canPlayerEditScore = (user: User | undefined, scorecardPlayerId: string): boolean => {
  if (!user) return false;
  if (user.role === 'manager') return true;
  return user.role === 'player' && user.playerId === scorecardPlayerId;
};

export const isManager = (user: User | undefined): boolean => user?.role === 'manager';
