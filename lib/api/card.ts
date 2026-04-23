import apiClient from '../axios';
import type { BirthdayCard, CreateCardData, UpdateCardData } from '../types';

export const cardApi = {
  getMyCards: async (): Promise<BirthdayCard[]> => {
    const response = await apiClient.get('/cards');
    return response.data;
  },

  getCardBySlug: async (slug: string): Promise<BirthdayCard> => {
    const response = await apiClient.get(`/cards/${slug}`);
    return response.data;
  },

  createCard: async (data: CreateCardData): Promise<BirthdayCard> => {
    const response = await apiClient.post('/cards', data);
    return response.data;
  },

  updateCard: async (id: string, data: UpdateCardData): Promise<BirthdayCard> => {
    const response = await apiClient.patch(`/cards/${id}`, data);
    return response.data;
  },

  deleteCard: async (id: string): Promise<void> => {
    await apiClient.delete(`/cards/${id}`);
  },

  duplicateCard: async (id: string): Promise<BirthdayCard> => {
    const response = await apiClient.post(`/cards/${id}/duplicate`);
    return response.data;
  },

  getCardStats: async (id: string): Promise<any> => {
    const response = await apiClient.get(`/cards/${id}/stats`);
    return response.data;
  },

  incrementView: async (slug: string): Promise<void> => {
    await apiClient.post(`/cards/${slug}/view`);
  },
};
