<template>
  <div v-if="modelValue" class="fixed inset-0 z-50 overflow-hidden" aria-labelledby="modal-title" role="dialog" aria-modal="true">
    <div class="fixed inset-0 bg-gray-500/75 backdrop-blur-sm transition-opacity"></div>
    <div class="flex items-center justify-center min-h-screen p-4">
      <div class="relative bg-white rounded-xl shadow-2xl w-[90%] h-[90vh] max-w-[1300px] overflow-hidden">
        <LetterHeader
          :editMode="editMode"
          :letterForm="letterForm"
          :errors="errors"
          @back="handleBack"
          @submit="handleSubmit"
        />
        
        <!-- Rest of the template content -->
      </div>
    </div>
  </div>
</template>

<script>
import LetterHeader from './LetterHeader.vue';
import { apiClient } from './apiClient';  // Already imported from apiClient.js
import { editorOptions } from './editorOptions';
import { QuillEditor } from '@vueup/vue-quill';
import '@vueup/vue-quill/dist/vue-quill.snow.css';
import { nextTick } from 'vue';
import SuccessMessageModal from './modals/SuccessMessageModal.vue';
import html2pdf from 'html2pdf.js/dist/html2pdf.bundle.min.js';

// Remove this duplicate declaration since it's already imported from apiClient.js
// const apiClient = axios.create({
//   baseURL: 'http://192.168.100.11:8000/api',
//   headers: {
//     'Content-Type': 'application/json',
//     'Accept': 'application/json',
//     'Access-Control-Allow-Origin': '*'
//   },
//   timeout: 15000
// });

export default {
  name: 'LetterForm',
  components: {
    QuillEditor,
    SuccessMessageModal
  },
  props: {
    modelValue: {
      type: Boolean,
      required: true
    },
    letter: {
      type: Object,
      default: () => ({})
    },
    editMode: {
      type: Boolean,
      default: false
    }
  },
  emits: ['update:modelValue', 'close', 'save', 'save-letter', 'update-letter', 'refresh-letters'],
  data() {
    return {
      letterForm: {
        title: '',
        type: '',
        subject: '',
        date: new Date().toISOString().split('T')[0],
        recipients: [{ id: '', name: '', position: '' }],
        content: '',
        sender_name: '',
        sender_position: ''
      },
      errors: {},
      showConfirmModal: false,
      showSuccess: false,  // Keep this for controlling visibility
      recipientsList: [],
      isSubmitting: false
    }
  },
  computed: {
    filteredRecipientsList() {
      // Get all currently selected recipient IDs
      const selectedIds = this.letterForm.recipients
        .filter(r => r.id)
        .map(r => r.id);
      
      // Filter out recipients that are already selected
      return this.recipientsList.filter(recipient => 
        !selectedIds.includes(recipient.id)
      );
    }
  },
  created() {
    if (this.letter && Object.keys(this.letter).length > 0) {
      this.editMode = true;
      const formattedRecipients = Array.isArray(this.letter.recipients) 
        ? this.letter.recipients.map(r => {
            // Handle both object and ID formats
            if (typeof r === 'object') {
              return {
                id: r.id || '',
                name: r.name || '',
                position: r.position || ''
              };
            } else {
              // If it's just an ID, we'll populate name/position after fetching recipients
              return {
                id: r,
                name: '',
                position: ''
              };
            }
          })
        : [{
            id: this.letter.recipients?.id || this.letter.recipients || '',
            name: this.letter.recipients?.name || '',
            position: this.letter.recipients?.position || ''
          }];
      
      this.letterForm = {
        ...this.letter,
        date: this.formatDateForInput(this.letter.date),
        recipients: formattedRecipients
      };
    }
    this.fetchRecipients();
  },
  methods: {
    formatDateForInput(dateString) {
      if (!dateString) return '';
      const date = new Date(dateString);
      return date.toISOString().split('T')[0];
    },

    closeModal() {
      this.errors = {};
      this.$emit('update:modelValue', false);
      this.$emit('close');
    },
    addRecipient() {
      this.letterForm.recipients.push({ 
        id: '', 
        name: '', 
        position: '' 
      });
    },
    removeRecipient(index) {
      if (this.letterForm.recipients.length > 1) {
        this.letterForm.recipients.splice(index, 1);
      }
    },
    async fetchRecipients() {
      try {
        const response = await apiClient.get('/recipients');
        // Ensure consistent data structure
        this.recipientsList = response.data.data || response.data;
      } catch (error) {
        console.error('Error fetching recipients:', error);
        this.recipientsList = [];
      }
    },
    updateRecipient(index, recipientId) {
      // Add null check and data validation
      if (!recipientId) return;
      
      const selectedRecipient = this.recipientsList.find(r => 
        r.id === parseInt(recipientId)
      );
      
      if (selectedRecipient) {
        this.letterForm.recipients[index] = {
          id: selectedRecipient.id,
          name: selectedRecipient.name,
          position: selectedRecipient.position
        };
      }
    },  // Add comma here
    handleBack() {
      // Reset form and close modal
      this.errors = {};
      this.letterForm = {
        title: '',
        type: '',
        subject: '',
        date: new Date().toISOString().split('T')[0],
        recipients: [{ id: '', name: '', position: '' }],
        content: '',
        sender_name: '',
        sender_position: ''
      };
      this.closeModal();
    },
    handleSubmit() {
      if (this.validateForm()) {
        this.showConfirmModal = true;
      } else {
        // Scroll to first error if validation fails
        this.$nextTick(() => {
          const firstError = Object.keys(this.errors)[0];
          if (firstError) {
            const element = this.$el.querySelector(`[name="${firstError}"]`) || 
                           this.$el.querySelector(`.border-red-500`);
            if (element) {
              element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
          }
        });
      }
    }
  },  // This properly closes the methods object
}  // This closes the export default object
</script>

<style>
.prose {
  width: 100%;
}

/* Add these styles for better Quill editor formatting */
.ql-editor {
  font-size: 1rem;
  line-height: 1.6;
}

.ql-editor p {
  margin-bottom: 1em;
}

.ql-editor strong {
  font-weight: 700;
}

.ql-editor h1 {
  font-size: 2em;
  margin-bottom: 0.5em;
}

.ql-editor h2 {
  font-size: 1.5em;
  margin-bottom: 0.5em;
}

.ql-snow .ql-editor pre {
  white-space: pre-wrap;
}
</style>




