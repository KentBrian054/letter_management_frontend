<template>
  <div class="flex items-center space-x-2">
    <ActionButton 
      variant="edit" 
      @click="handleEdit"
      title="Edit Letter"
      class="p-2 hover:bg-blue-50 rounded-md"
    >
      <PencilIcon class="w-5 h-5 text-blue-600" />
    </ActionButton>

    <ActionButton 
      variant="document" 
      @click="showPreviewModal = true" 
      title="Document Options"
    >
      <DocumentIcon class="w-5 h-5 text-purple-600" />
    </ActionButton>

    <ActionButton variant="delete" @click="handleDelete" title="Delete Letter">
      <TrashIcon class="w-5 h-5 text-red-600" />
    </ActionButton>

    <PreviewOptionsModal
      v-if="showPreviewModal"
      :letter="letter"
      :is-preview-loading="isLoadingPDF"
      :is-exporting="isConverting"
      @preview="handlePreviewPDF"
      @convert-pdf-to-word="handleExportWord"
      @close="showPreviewModal = false"
    />

    <!-- Error Message Modal -->
    <div v-if="showErrorMessage" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div class="bg-white p-6 rounded-lg shadow-xl max-w-md">
        <div class="flex items-center text-red-600 mb-4">
          <svg class="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 class="text-lg font-medium">Conversion Failed</h3>
        </div>
        <p class="text-gray-600 mb-4">{{ errorMessage }}</p>
        <div class="flex justify-end">
          <button @click="showErrorMessage = false" class="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300">
            Close
          </button>
        </div>
      </div>
    </div>

    <!-- Loading modal for Word export -->
    <div v-if="isConverting" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div class="bg-white p-6 rounded-lg flex items-center gap-3">
        <component is="ArrowPathIcon" class="w-5 h-5 animate-spin" />
        <span>Exporting to Word...</span>
      </div>
    </div>

    <!-- Loading modal for PDF preview -->
    <div v-if="isLoadingPDF" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div class="bg-white p-6 rounded-lg flex items-center gap-3">
        <component is="ArrowPathIcon" class="w-5 h-5 animate-spin" />
        <span>Generating PDF preview...</span>
      </div>
    </div>
  </div>
</template>

<script>
import { CSpinner } from '@coreui/vue'
import ActionButton from './ActionButton.vue'
import { 
  PencilIcon, 
  TrashIcon,
  ArrowPathIcon,
  DocumentIcon,
  EyeIcon // Add this import
} from '@heroicons/vue/24/solid'
import SuccessMessageModal from './modals/SuccessMessageModal.vue'
import PreviewOptionsModal from './modals/PreviewOptionsModal.vue'
import apiClient from '@/utils/apiClient';

export default {
  name: 'LetterActions',
  components: {
    ActionButton,
    PencilIcon,
    TrashIcon,
    ArrowPathIcon,
    DocumentIcon,
    EyeIcon, // Add to components
    CSpinner,
    PreviewOptionsModal
  },
  props: {
    letter: {
      type: Object,
      required: true
    }
  },
  emits: ['edit', 'delete', 'preview-pdf', 'convert-pdf-to-word'],
  data() {
    return {
      showPreviewModal: false,
      showSuccessMessage: false,
      isConverting: false,
      isLoadingPDF: false,
      showErrorMessage: false,
      errorMessage: ''
    }
  },
  methods: {
    async handlePreviewPDF() {
      try {
        this.isLoadingPDF = true;
        if (!this.letter?.id) {
          throw new Error('No letter selected');
        }

        // Normalize the letter type and convert to lowercase for comparison
        const normalizedType = this.letter.type?.trim().toLowerCase();
        console.log('Letter type:', normalizedType);

        // Map letter types to their corresponding endpoints (using lowercase keys)
        const endpointMap = {
          'memo': `/memos/${this.letter.id}/preview-pdf`,
          'endorsement': `/endorsements/${this.letter.id}/preview-pdf`,
          'letter to admin': `/letters-to-admin/${this.letter.id}/preview-pdf`,
          'invitation meeting': `/invitation-meetings/${this.letter.id}/preview-pdf`,
          // Add snake_case variants
          'letter_to_admin': `/letters-to-admin/${this.letter.id}/preview-pdf`,
          'invitation_meeting': `/invitation-meetings/${this.letter.id}/preview-pdf`
        };

        const endpoint = endpointMap[normalizedType];
        if (!endpoint) {
          console.error('Type mapping failed for:', normalizedType);
          throw new Error(`Invalid letter type: ${this.letter.type}`);
        }

        console.log('Using endpoint:', endpoint); // Debug log

        const response = await apiClient.get(endpoint, {
          responseType: 'blob',
          headers: {
            'Accept': 'application/pdf'
          },
          baseURL: 'http://192.168.5.94:8000'
        });

        // Add response validation
        if (response.status !== 200) {
          console.error('Unexpected response:', response);
          throw new Error(`Server returned status ${response.status}`);
        }

        // Verify we received PDF content
        if (!response.headers['content-type'].includes('application/pdf')) {
          console.warn('Received non-PDF response:', response.headers, response.data);
          throw new Error('Invalid content type received from server');
        }

        const blob = new Blob([response.data], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        window.open(url, '_blank');
      } catch (error) {
        console.error('Preview error:', error);
        this.showErrorMessage = true;
        this.errorMessage = 'Failed to generate preview. Please try again.';
      } finally {
        this.isLoadingPDF = false;
      }
    },  // Add comma here
    async handleExportWord() {
      try {
        this.isConverting = true;
        this.showPreviewModal = false;

        // Map letter types to their corresponding export endpoints
        const exportEndpointMap = {
          'memo': `/export/memo/${this.letter.id}`,
          'endorsement': `/export/endorsement/${this.letter.id}`,
          'letter to admin': `/export/letter-to-admin/${this.letter.id}`,
          'invitation meeting': `/export/invitation-meeting/${this.letter.id}`,
        };

        const normalizedType = this.letter.type?.trim().toLowerCase();
        const endpoint = exportEndpointMap[normalizedType];

        if (!endpoint) {
          throw new Error(`Invalid letter type: ${this.letter.type}`);
        }

        const response = await apiClient.get(endpoint, {
          responseType: 'blob',
          headers: {
            'Accept': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
          }
        });

        const blob = new Blob([response.data], {
          type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        });
        
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${this.letter.title || 'letter'}.docx`;
        document.body.appendChild(link);
        link.click();
        
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

      } catch (error) {
        console.error('Export error:', error);
        this.showErrorMessage = true;
        this.errorMessage = 'Failed to export to Word. Please try again.';
      } finally {
        this.isConverting = false;
      }
    },  // Add comma here
    handleEdit() {
      try {
        if (!this.letter) {
          throw new Error('Letter data is missing');
        }
        
        const validLetter = {
          id: this.letter.id,
          title: this.letter.title || '',
          type: this.letter.type || '',
          subject: this.letter.subject || '',
          date: this.letter.date || '',
          recipients: (Array.isArray(this.letter.recipients) ? this.letter.recipients : []).map(r => ({
            id: r?.id || '',
            name: r?.name || '',
            position: r?.position || ''
          })),
          content: this.letter.content || '',
          sender_name: this.letter.sender_name || '',
          sender_position: this.letter.sender_position || ''
        };
        
        this.$emit('edit', validLetter);
      } catch (error) {
        console.error('Edit error:', error);
      }
    },  // Add comma here
    handleDelete() {
      this.$emit('delete', this.letter.id);
    }
  }
}
</script>

<style scoped>
.flex.items-center.space-x-2 {
  gap: 0.75rem;
}
</style>