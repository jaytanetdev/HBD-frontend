import apiClient from '../axios';
import type { BirthdayCard } from '../types';

export const templateApi = {
  generateRandomCard: async (recipientName: string): Promise<BirthdayCard> => {
    const response = await apiClient.post('/template/random', { recipientName });
    return response.data;
  },
};
