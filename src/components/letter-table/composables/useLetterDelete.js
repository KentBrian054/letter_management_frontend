import apiClient from '@/utils/apiClient';

export default function useLetterDelete() {
  const deleteLetter = async (id) => {
    try {
      const response = await apiClient.delete(`/letters/${id}`);
      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to delete letter');
      }
      return response.data;
    } catch (error) {
      console.error('Error deleting letter:', error);
      throw error;
    }
  };

  return {
    deleteLetter
  };
}