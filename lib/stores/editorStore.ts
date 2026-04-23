import { create } from 'zustand';
import type { BirthdayCard, GameInstance, Theme } from '../types';

interface EditorState {
  card: BirthdayCard | null;
  games: GameInstance[];
  selectedTheme: Theme | null;
  setCard: (card: BirthdayCard | null) => void;
  setGames: (games: GameInstance[]) => void;
  addGame: (game: GameInstance) => void;
  removeGame: (gameId: string) => void;
  updateGame: (gameId: string, updates: Partial<GameInstance>) => void;
  reorderGames: (newGames: GameInstance[]) => void;
  setTheme: (theme: Theme | null) => void;
  reset: () => void;
}

export const useEditorStore = create<EditorState>((set) => ({
  card: null,
  games: [],
  selectedTheme: null,

  setCard: (card) => set({ card }),

  setGames: (games) => set({ games }),

  addGame: (game) =>
    set((state) => ({
      games: [...state.games, game],
    })),

  removeGame: (gameId) =>
    set((state) => ({
      games: state.games.filter((g) => g.id !== gameId),
    })),

  updateGame: (gameId, updates) =>
    set((state) => ({
      games: state.games.map((g) =>
        g.id === gameId ? { ...g, ...updates } : g
      ),
    })),

  reorderGames: (newGames) => set({ games: newGames }),

  setTheme: (theme) => set({ selectedTheme: theme }),

  reset: () => set({ card: null, games: [], selectedTheme: null }),
}));
