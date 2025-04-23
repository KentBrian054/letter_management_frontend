import apiClient from '../../../utils/apiClient'  // Changed from '@/utils/apiClient'


export default function useLetterUpdate() {
  const updateLetter = async (letterData) => {
    try {
      const response = await apiClient.put(`/letters/${letterData.id}`, letterData);
      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to update letter');
      }
      return response.data;
    } catch (error) {
      console.error('Error updating letter:', error);
      throw error;
    }
  };

  const openEditModal = async (letter) => {
    try {
      const letterData = { ...letter };
      if (typeof letterData.recipients === 'string') {
        letterData.recipients = JSON.parse(letterData.recipients);
      }
      return letterData;
    } catch (error) {
      console.error('Error preparing letter data for edit:', error);
      throw error;
    }
  };

  return {
    updateLetter,
    openEditModal
  };
}