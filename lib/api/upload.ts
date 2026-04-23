import apiClient from '../axios';

export const uploadApi = {
  uploadImage: async (file: File): Promise<{ url: string; message: string }> => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await apiClient.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
  
  deleteFile: async (url: string): Promise<{ message: string }> => {
    const response = await apiClient.delete('/upload', {
      data: { url },
    });
    return response.data;
  },
};
