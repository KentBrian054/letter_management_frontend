import apiClient from '../../../utils/apiClient'  // Changed from '@/utils/apiClient'


export default function useLetterPreview() {
  const previewLetter = async (letter) => {
    try {
      const response = await apiClient.get(`/letters/${letter.id}/preview`, {
        responseType: 'blob',
        headers: {
          'Accept': 'application/pdf',
          'X-Requested-With': 'XMLHttpRequest'
        }
      });

      if (response.status === 200 && response.data) {
        const blob = new Blob([response.data], { type: 'application/pdf' });
        const blobUrl = window.URL.createObjectURL(blob);
        window.open(blobUrl, '_blank');
        
        setTimeout(() => {
          window.URL.revokeObjectURL(blobUrl);
        }, 100);
      } else {
        throw new Error(`Failed to load PDF preview: ${response.status}`);
      }
    } catch (error) {
      console.error('Error previewing letter:', error);
      throw error;
    }
  };

  const downloadLetter = async (letter) => {
    try {
      const response = await apiClient.get(`/letters/${letter.id}/download`, {
        responseType: 'blob',
        headers: {
          'Accept': 'application/pdf'
        }
      });

      if (response.status === 200 && response.data) {
        const blob = new Blob([response.data], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `${letter.title || 'letter'}-${letter.id}.pdf`);
        document.body.appendChild(link);
        link.click();
        
        setTimeout(() => {
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);
        }, 100);
      }
    } catch (error) {
      console.error('Error downloading letter:', error);
      throw error;
    }
  };

  return {
    previewLetter,
    downloadLetter
  };
}