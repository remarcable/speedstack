import { useState, useEffect } from 'react';

const STORAGE_KEY = 'speedstack-leaderboard';
const MAX_ENTRIES = 5;

export interface LeaderboardEntry {
  score: number;
  maxLevel: number;
  completedCount: number;
  bonuses: number;
  penalties: number;
  playTime: number;
  date: string;
  id?: string; // Unique identifier for the entry
}

interface UseLeaderboardReturn {
  leaderboard: LeaderboardEntry[];
  saveScore: (entry: Omit<LeaderboardEntry, 'date' | 'id'>) => string | null;
  checkIfHighScore: (score: number) => boolean;
  lastSavedId: string | null;
}

export function useLeaderboard(): UseLeaderboardReturn {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [lastSavedId, setLastSavedId] = useState<string | null>(null);

  // Load leaderboard from localStorage on mount
  useEffect(() => {
    const loadLeaderboard = () => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored) as unknown;
          if (Array.isArray(parsed)) {
            setLeaderboard(parsed as LeaderboardEntry[]);
          }
        }
      } catch (error) {
        console.error('Failed to load leaderboard:', error);
      }
    };

    loadLeaderboard();
  }, []);

  // Save score to leaderboard
  const saveScore = (entry: Omit<LeaderboardEntry, 'date' | 'id'>): string | null => {
    const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newEntry: LeaderboardEntry = {
      ...entry,
      date: new Date().toISOString(),
      id,
    };

    // Check if score qualifies
    if (leaderboard.length >= MAX_ENTRIES && newEntry.score <= leaderboard[MAX_ENTRIES - 1].score) {
      return null;
    }

    // Add new entry, sort by score (descending), keep top 5
    const updatedLeaderboard = [...leaderboard, newEntry]
      .sort((a, b) => b.score - a.score)
      .slice(0, MAX_ENTRIES);

    setLeaderboard(updatedLeaderboard);
    setLastSavedId(id);

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedLeaderboard));
      return id;
    } catch (error) {
      console.error('Failed to save leaderboard:', error);
      return null;
    }
  };

  // Check if a score qualifies for top 5
  const checkIfHighScore = (score: number): boolean => {
    if (leaderboard.length < MAX_ENTRIES) {
      return true;
    }
    return score > leaderboard[MAX_ENTRIES - 1].score;
  };

  return {
    leaderboard,
    saveScore,
    checkIfHighScore,
    lastSavedId,
  };
}
