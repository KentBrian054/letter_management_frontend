
<template>
  <div class="p-6">
    <!-- Search Filters Component with New Button -->
    <SearchFilters
      :filters="{
        searchQuery,
        searchSubject,
        searchRecipient,
        selectedType,
        dateRange
      }"
      @update:filters="updateFilters"
      @new-letter="handleNewLetterClick"
    />

    <!-- Table -->
    <div class="bg-white rounded-lg shadow">
      <div class="overflow-x-auto">
        <table class="min-w-full table-fixed">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">Actions</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Recipients</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="letter in paginatedLetters" :key="letter.id">
              <td class="px-6 py-4 whitespace-nowrap">
                <LetterActions 
                  :letter="letter"
                  @edit="openEditModal"
                  @preview-pdf="previewPDF"
                  @export-word="exportToWord"
                  @delete="confirmDelete"
                />
              </td>
              <td class="px-6 py-4 whitespace-nowrap">{{ letter.title }}</td>
              <td class="px-6 py-4 whitespace-nowrap">{{ formatDate(letter.date) }}</td>
              <!-- In the template section, update the type column -->
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="{
                  'px-2 py-1 rounded-full text-xs font-medium': true,
                  'bg-blue-100 text-blue-800': letter.type === 'Business Letter',
                  'bg-green-100 text-green-800': letter.type === 'Memo'
                }">
                  {{ letter.type || 'Unknown Type' }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">{{ letter.subject }}</td>
              <td class="px-6 py-4">
                <div class="flex flex-wrap gap-1">
                  <template v-if="letter.recipients && letter.recipients.length">
                    <span 
                      v-for="(recipient, index) in letter.recipients" 
                      :key="index"
                      class="px-2 py-1 bg-gray-100 rounded-md text-sm"
                    >
                      <div class="flex flex-col">
                        <span class="text-blue-600">{{ recipient.name }}</span>
                        <span v-if="recipient.position" class="text-xs text-gray-500">
                          {{ recipient.position }}
                        </span>
                      </div>
                    </span>
                  </template>
                  <span v-else class="text-gray-500">No recipients</span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

   
    <!-- Add background and border styling to pagination -->
    <div class="mt-4 bg-white rounded-lg shadow">
      <!-- Update the TablePagination usage -->
      <TablePagination
        :current-page="currentPage"
        :total-pages="totalPages"
        :displayed-pages="displayedPages"
        :total-items="filteredLetters.length"
        :items-per-page="perPage"
        @previous="previousPage"
        @next="nextPage"
        @goto-page="goToPage"
        class="p-4"
      />
    </div>

    <!-- Add transition and styling to modal -->
    <!-- Replace the existing modal section -->
    <Transition name="fade">
      <div v-if="showModal" class="fixed inset-0 z-50 overflow-y-auto">
        <div class="fixed inset-0 bg-gray-500/75 backdrop-blur-sm"></div>
        <div class="flex items-center justify-center min-h-screen p-4">
          <div class="relative bg-white rounded-lg shadow-xl w-full max-w-4xl mx-4">
            <LetterModal
              :letter="selectedLetter"
              @close="closeModal"
              @save-letter="handleLetterSaved"
              @update-letter="handleLetterSaved"
              @refresh-letters="fetchLetters"
            />
          </div>
        </div>
      </div>
    </Transition>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteConfirmModal" class="fixed inset-0 z-50 overflow-y-auto">
      <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 transition-opacity" aria-hidden="true">
          <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>
        <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="sm:flex sm:items-start">
              <div class="mt-3 text-center sm:mt-0 sm:text-left">
                <h3 class="text-lg leading-6 font-medium text-gray-900">Delete Letter</h3>
                <div class="mt-2">
                  <p class="text-sm text-gray-500">Are you sure you want to delete this letter? This action cannot be undone.</p>
                </div>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              @click="deleteLetter(confirmDeleteId)"
              class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm"
            >
              Delete
            </button>
            <button
              @click="showDeleteConfirmModal = false"
              class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Success Message -->
    <div
      v-if="showDeleteSuccess"
      class="fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg"
    >
      Letter deleted successfully!
    </div>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fade-enter-to,
.fade-leave-from {
  opacity: 1;
}
</style>

<script>
import apiClient from '@/utils/apiClient';
import LetterModal from './LetterModal.vue';
import LetterActions from './LetterActions.vue';
import SearchFilters from './SearchFilters.vue';
import TablePagination from './TablePagination.vue';
import DeleteConfirmationModal from './DeleteConfirmationModal.vue';
import useLetterUpdate from './composables/useLetterUpdate';
import useLetterDelete from './composables/useLetterDelete';
import useLetterPreview from './composables/useLetterPreview';

export default {
  name: 'LetterTable',
  components: {
    LetterModal,
    LetterActions,
    SearchFilters,
    TablePagination,
    DeleteConfirmationModal
  },
  emits: ['refresh-letters'],
  data() {
    return {
      letters: [],
      recipients: [],
      showModal: false,
      showLetterForm: false,
      showEditModal: false,
      showDeleteConfirmModal: false,
      showDeleteSuccess: false,
      confirmDeleteId: null,
      selectedLetter: null,
      currentPage: 1,
      perPage: 10,
      searchQuery: '',
      sortKey: 'title',
      dateRange: {
        start: '',
        end: ''
      },
      selectedType: '', // Add this line
      searchSubject: '',
      searchRecipient: '',
      isFetching: false,       // Moved inside data()
      lastRequestTime: 0,      // Moved inside data()
      // Remove these properties as they're no longer needed
      dropdownStates: {},
      showPdfPreview: false,
      currentPdfUrl: null,
      networkStatus: false
    };
  },
  computed: {
    totalPages() {
      return Math.max(1, Math.ceil(this.filteredLetters.length / this.perPage));
    },
    // In the computed section, update the filteredLetters method
    filteredLetters() {
      return this.letters.filter(letter => {
        const matchesTitle = letter.title?.toLowerCase().includes(this.searchQuery.toLowerCase()) ?? false;
        const matchesSubject = letter.subject?.toLowerCase().includes(this.searchSubject.toLowerCase()) ?? false;
        // Update this line to use letter.type instead of letter.type?.toLowerCase()
        const matchesType = this.selectedType ? letter.type === this.selectedType : true;
        
        // Rest of the code remains the same
        const matchesRecipient = this.searchRecipient ? 
          (Array.isArray(letter.recipients) ? 
            letter.recipients.some(r => r.toLowerCase().includes(this.searchRecipient.toLowerCase())) :
            String(letter.recipients).toLowerCase().includes(this.searchRecipient.toLowerCase())
          ) : true;
        
        const letterDate = new Date(letter.date);
        const matchesDateRange = (!this.dateRange.start || letterDate >= new Date(this.dateRange.start)) &&
                                   (!this.dateRange.end || letterDate <= new Date(this.dateRange.end));
        
        return matchesTitle && matchesSubject && matchesType && matchesRecipient && matchesDateRange;
      });
    },
    displayedPages() {
      const pages = [];
      const maxVisiblePages = 5;
      let start = Math.max(1, this.currentPage - Math.floor(maxVisiblePages / 2));
      let end = Math.min(this.totalPages, start + maxVisiblePages - 1);
    
      if (end - start + 1 < maxVisiblePages) {
        start = Math.max(1, end - maxVisiblePages + 1);
      }
    
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      return pages;
    },
    paginatedLetters() {
      const start = (this.currentPage - 1) * this.perPage;
      const end = start + this.perPage;
      return this.filteredLetters.slice(start, end);
    },
    // Update the availableRecipients computed property
    availableRecipients() {
    // Filter out already selected recipients
    return this.recipients.filter(recipient => 
    !this.selectedRecipients.includes(recipient.name)
    );
    },
  },
  async mounted() {
    try {
      await this.fetchLetters();
      await this.fetchRecipients();
    } catch (error) {
      console.error('Error during component initialization:', error);
    }
  },
  methods: {
    formatDate(dateString) {
      if (!dateString) return '';
      try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return '';
        return date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
      } catch (error) {
        console.error('Date formatting error:', error);
        return dateString;
      }
    },
    formatDateForInput(dateString) {
      if (!dateString) return '';
      try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return '';
        return date.toISOString().split('T')[0];
      } catch (error) {
        console.error('Date formatting error:', error);
        return '';
      }
    },
    // Keep only one version of each method
    updateFilters(newFilters) {
      this.searchQuery = newFilters.searchQuery;
      this.searchSubject = newFilters.searchSubject;
      this.searchRecipient = newFilters.searchRecipient;
      this.selectedType = newFilters.selectedType;
      this.dateRange = newFilters.dateRange;
      this.currentPage = 1; // Reset to first page when filters change
    },

    closeEditModal() {
      this.showEditModal = false;
      this.currentLetter = null;
    },

    handleNewLetterClick() {
      this.selectedLetter = null;
      this.showModal = true;
    },
    
    closeModal() {
      this.showModal = false;
      this.selectedLetter = null;
    },

    async handleLetterSaved(letterData) {
      try {
        if (!letterData) {
          console.error('Letter data is undefined');
          return;
        }
    
        if (letterData.id) {
          await this.updateLetter(letterData);
        } else {
          await this.addLetter(letterData);
        }
        
        this.showLetterForm = false;
        this.showEditModal = false;
        await this.fetchLetters();
        this.$router.push('/letters');
      } catch (error) {
        console.error('Error saving letter:', error);
        alert(error.response?.data?.message || 'Failed to save letter. Please check all required fields.');
      }
    },

    // Keep only one version of addLetter
    async addLetter(letterData) {
      try {
        const recipients = Array.isArray(letterData.recipients)
          ? letterData.recipients.map(recipient => 
              typeof recipient === 'object' ? recipient.name : String(recipient)
            )
          : [String(letterData.recipients)];
    
        const formattedData = {
          title: letterData.title,
          subject: letterData.subject,
          type: letterData.type,
          date: this.formatDateForInput(letterData.date),
          recipients: recipients,
          content: letterData.content || '',
          sender_name: letterData.sender_name,
          sender_position: letterData.sender_position
        };
    
        const response = await apiClient.post('/letters', formattedData);
        
        if (response.data.success) {
          await this.fetchLetters();
          this.showLetterForm = false;
          this.currentPage = 1;
          this.$emit('refresh-letters');
        }
      } catch (error) {
        console.error('Error adding letter:', error);
        if (error.response?.data?.errors) {
          const errorMessages = Object.values(error.response.data.errors)
            .flat()
            .join('\n');
          alert(errorMessages);
        }
        throw error;
      }
    },

    // Keep only one fetchLetters
    async fetchLetters() {
      try {
        const response = await apiClient.get('/letters', {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        });
        
        if (response.data?.success && Array.isArray(response.data.data)) {
          this.letters = response.data.data.map(letter => ({
            ...letter,
            date: letter.date || new Date().toISOString().split('T')[0],
            type: letter.type || 'Unknown Type',
            recipients: Array.isArray(letter.recipients) ? letter.recipients : []
          }));
        } else {
          this.letters = [];
        }
      } catch (error) {
        console.error('Letters fetch error:', error);
        this.letters = [];
        if (error.response?.data?.error?.includes('Table')) {
          alert('Database tables are not set up. Please contact your system administrator.');
        } else {
          alert('Failed to fetch letters. Please try again later.');
        }
      }
    },

    // Keep only one deleteLetter
    confirmDelete(id) {
      this.confirmDeleteId = id;
      this.showDeleteConfirmModal = true;
    },

    async deleteLetter() {
      try {
        if (!this.confirmDeleteId) return;
        
        const response = await apiClient.delete(`/letters/${this.confirmDeleteId}`);
        if (response.data.success) {
          this.showDeleteConfirmModal = false;
          this.showDeleteSuccess = true;
          await this.fetchLetters();
          
          setTimeout(() => {
            this.showDeleteSuccess = false;
          }, 2000);
        }
      } catch (error) {
        console.error('Delete error:', error);
        alert(error.response?.data?.message || 'Failed to delete letter');
      } finally {
        this.confirmDeleteId = null;
      }
    },

    async updateLetter(letterData) {
      try {
        if (!letterData.id) {
          throw new Error('Letter ID is required for update');
        }

        // Format recipients properly
        const recipients = Array.isArray(letterData.recipients)
          ? letterData.recipients.map(recipient => {
              if (typeof recipient === 'object' && recipient.name) {
                return {
                  name: recipient.name,
                  position: recipient.position || ''
                };
              }
              return { name: String(recipient), position: '' };
            })
          : [{ name: String(letterData.recipients), position: '' }];

        const formattedData = {
          id: letterData.id,  // Add ID to ensure server knows which record to update
          title: letterData.title || '',
          subject: letterData.subject || '',
          type: letterData.type || '',
          date: this.formatDateForInput(letterData.date) || new Date().toISOString().split('T')[0],
          recipients: recipients,
          content: letterData.content || '',
          sender_name: letterData.sender_name || '',
          sender_position: letterData.sender_position || ''
        };

        // Log the request data for debugging
        console.log('Update request data:', {
          url: `/letters/${letterData.id}`,
          data: formattedData
        });

        const response = await apiClient.put(`/letters/${letterData.id}`, formattedData);
        
        if (response.data?.success) {
          await this.fetchLetters();
          this.showEditModal = false;
          this.showModal = false;
          this.$emit('refresh-letters');
          return response.data;
        } else {
          throw new Error(response.data?.message || 'Update failed');
        }
      } catch (error) {
        console.error('Error updating letter:', error);
        console.error('Error details:', {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status,
          serverMessage: error.response?.data?.message || 'Unknown server error'
        });
        
        const errorMessage = error.response?.data?.message 
          || error.response?.data?.error 
          || error.message 
          || 'Failed to update letter. Please check your input and try again.';
        alert(errorMessage);
        throw error;
      }
    },

    async fetchRecipients() {
      try {
        const response = await apiClient.get('/recipients');
        if (response.data?.success) {
          this.recipients = response.data.data.map(recipient => ({
            ...recipient,
            name: recipient.name || '',
            position: recipient.position || ''
          }));
        } else {
          this.recipients = [];
        }
      } catch (error) {
        console.error('Error fetching recipients:', error);
        this.recipients = [];
        if (error.response?.data?.error?.includes('Table')) {
          alert('Recipients table is not set up. Please contact your system administrator.');
        } else {
          alert('Failed to fetch recipients. Please try again later.');
        }
      }
    },
    // Add pagination methods
    previousPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    },

    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
      }
    },

    goToPage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
      }
    },

    // Add edit modal method
    openEditModal(letter) {
      this.selectedLetter = { ...letter };
      this.showModal = true;
    },

    async previewPDF(letter) {
      try {
        const response = await apiClient.get(`/letters/${letter.id}/preview`, {
          responseType: 'blob'
        });
        
        const blob = new Blob([response.data], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        
        // Open PDF in new window
        window.open(url, '_blank');
      } catch (error) {
        console.error('Error previewing PDF:', error);
        alert('Failed to generate PDF preview');
      }
    },

    async exportToWord(letter) {
      try {
        const response = await apiClient.get(`/letters/${letter.id}/export-word`, {  // Removed /api prefix
          responseType: 'blob',
          headers: {
            'Accept': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'Content-Type': 'application/json'
          }
        });
        
        const blob = new Blob([response.data], { 
          type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' 
        });
        const url = window.URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `${letter.title || 'letter'}.docx`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      } catch (error) {
        console.error('Error exporting to Word:', error);
        alert('Failed to export to Word. Please check if the export feature is enabled on the server.');
      }
    }
  }
};
</script>


