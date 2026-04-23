import apiClient from '../axios';
import type { Theme } from '../types';

export const themeApi = {
  getThemes: async (): Promise<Theme[]> => {
    const response = await apiClient.get('/themes');
    return response.data;
  },

  getThemeById: async (id: string): Promise<Theme> => {
    const response = await apiClient.get(`/themes/${id}`);
    return response.data;
  },
};
