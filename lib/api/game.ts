import apiClient from '../axios';
import type { GameInstance, AddGameData, UpdateGameData, ReorderGamesData } from '../types';

export const gameApi = {
  addGame: async (data: AddGameData): Promise<GameInstance> => {
    const response = await apiClient.post('/games', data);
    return response.data;
  },

  getGamesByCard: async (cardId: string): Promise<GameInstance[]> => {
    const response = await apiClient.get(`/games/card/${cardId}`);
    return response.data;
  },

  updateGame: async (id: string, data: UpdateGameData): Promise<GameInstance> => {
    const response = await apiClient.patch(`/games/${id}`, data);
    return response.data;
  },

  deleteGame: async (id: string): Promise<void> => {
    await apiClient.delete(`/games/${id}`);
  },

  reorderGames: async (data: ReorderGamesData): Promise<void> => {
    await apiClient.patch('/games/reorder', data);
  },
};
