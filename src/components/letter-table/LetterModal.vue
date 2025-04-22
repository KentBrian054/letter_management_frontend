<template>
  <transition name="fade">
    <div v-if="modelValue" class="fixed inset-0 z-50 overflow-hidden">
      <!-- Modal content -->
    </div>
  </transition>
</template>

<script>
import LetterHeader from './LetterHeader.vue';
import { apiClient } from './apiClient';
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
    SuccessMessageModal,
    LetterHeader  // Add this line to register the component
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
      editorOptions: {
        modules: {
          toolbar: [
            ['bold', 'italic', 'underline', 'strike'],
            ['blockquote', 'code-block'],
            [{ 'header': 1 }, { 'header': 2 }],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            [{ 'script': 'sub' }, { 'script': 'super' }],
            [{ 'indent': '-1' }, { 'indent': '+1' }],
            [{ 'direction': 'rtl' }],
            [{ 'size': ['small', false, 'large', 'huge'] }],
            [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
            [{ 'color': [] }, { 'background': [] }],
            [{ 'font': [] }],
            [{ 'align': [] }],
            ['clean']
          ]
        },
        placeholder: 'Compose your letter...',
        theme: 'snow'
      },
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
  async created() {
    try {
      await this.fetchCSRFToken();
      
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
    } catch (error) {
      console.error('Component initialization error:', error);
      this.closeModal();
    }
  },  // <-- Add this comma
  methods: {
    async fetchCSRFToken() {
      try {
        await apiClient.get('/sanctum/csrf-cookie');
      } catch (error) {
        console.error('Error fetching CSRF token:', error);
        throw error;
      }
    },

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
      if (!recipientId) {
        this.letterForm.recipients[index] = { id: '', name: '', position: '' };
        return;
      }
      
      const selectedRecipient = this.recipientsList.find(r => 
        r.id === parseInt(recipientId)
      );
      
      if (selectedRecipient) {
        // Replace this.$set with direct assignment and array copy
        this.letterForm.recipients = [
          ...this.letterForm.recipients.slice(0, index),
          {
            id: selectedRecipient.id,
            name: selectedRecipient.name,
            position: selectedRecipient.position
          },
          ...this.letterForm.recipients.slice(index + 1)
        ];
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
    validateForm() {
      this.errors = {};
      let isValid = true;

      // Validate title
      if (!this.letterForm.title?.trim()) {
        this.errors.title = 'Title is required';
        isValid = false;
      }

      // Validate type
      if (!this.letterForm.type?.trim()) {
        this.errors.type = 'Type is required';
        isValid = false;
      }

      // Validate subject
      if (!this.letterForm.subject?.trim()) {
        this.errors.subject = 'Subject is required';
        isValid = false;
      }

      // Validate date
      if (!this.letterForm.date) {
        this.errors.date = 'Date is required';
        isValid = false;
      }

      // Validate content
      if (!this.letterForm.content?.trim()) {
        this.errors.content = 'Content is required';
        isValid = false;
      }

      // Validate sender info
      if (!this.letterForm.sender_name?.trim()) {
        this.errors.sender_name = 'Sender name is required';
        isValid = false;
      }

      if (!this.letterForm.sender_position?.trim()) {
        this.errors.sender_position = 'Sender position is required';
        isValid = false;
      }

      // Validate recipients
      const hasEmptyRecipients = this.letterForm.recipients.some(r => !r.id);
      if (hasEmptyRecipients) {
        this.errors.recipients = 'All recipients must be selected';
        isValid = false;
      }

      return isValid;
    },

    async confirmSubmit() {
      try {
        this.isSubmitting = true;
        
        // Prepare the data with full recipient objects
        const formData = {
          title: this.letterForm.title,
          type: this.letterForm.type,
          subject: this.letterForm.subject,
          date: this.letterForm.date,
          content: this.letterForm.content,
          sender_name: this.letterForm.sender_name,
          sender_position: this.letterForm.sender_position,
          recipients: this.letterForm.recipients
            .filter(r => r.id) // Only include recipients with IDs
            .map(r => ({
              id: r.id,
              name: r.name, // Include name
              position: r.position // Include position
            }))
        };
    
        // Debug log
        console.log('Submitting:', formData);
    
        let response;
        if (this.editMode) {
          response = await apiClient.put(`/letters/${this.letter.id}`, formData);
        } else {
          response = await apiClient.post('/letters', formData);
        }
    
        console.log('Response:', response.data);
        this.$emit('refresh-letters');
        this.showSuccess = true;
        
      } catch (error) {
        console.error('Error submitting letter:', error);
        this.errors = error.response?.data?.errors || {};
        this.errors.submit = error.response?.data?.message || 'Failed to save letter';
      } finally {
        this.isSubmitting = false;
      }
    },  // <-- Add this comma
    
    handleSubmit() {
      if (!this.validateForm()) {
        return;
      }
      this.confirmSubmit();
    },

    async handleQuickSave() {
      if (!this.validateForm()) {
        return;
      }
      
      try {
        this.isSubmitting = true;
        const formData = {
          title: this.letterForm.title,
          type: this.letterForm.type,
          subject: this.letterForm.subject,
          date: this.letterForm.date,
          content: this.letterForm.content,
          sender_name: this.letterForm.sender_name,
          sender_position: this.letterForm.sender_position,
          recipients: this.letterForm.recipients
            .filter(r => r.id)
            .map(r => ({
              id: r.id,
              name: r.name,
              position: r.position
            }))
        };

        const response = await apiClient.post('/letters', formData);
        this.$emit('refresh-letters');
        this.showSuccess = true;
      } catch (error) {
        console.error('Quick save error:', error);
        this.errors.submit = error.response?.data?.message || 'Quick save failed';
      } finally {
        this.isSubmitting = false;
      }
    }
  }
}
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

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}




