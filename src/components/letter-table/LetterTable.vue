
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
                  @preview="previewLetter"
                  @delete="confirmDelete"
                />
              </td>
              <td class="px-6 py-4 whitespace-nowrap">{{ letter.title }}</td>
              <td class="px-6 py-4 whitespace-nowrap">{{ formatDate(letter.date) }}</td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="{
                  'px-2 py-1 rounded-full text-xs font-medium': true,
                  'bg-blue-100 text-blue-800': letter.letter_type === 'Business Letter',
                  'bg-green-100 text-green-800': letter.letter_type === 'Memo'
                }">
                  {{ letter.letter_type }}
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
      <TablePagination
        :current-page="currentPage"
        :total-pages="totalPages"
        :displayed-pages="displayedPages"
        @previous="previousPage"
        @next="nextPage"
        @goto-page="goToPage"
        class="p-4 border-t border-gray-200"
      />
    </div>

    <!-- Add transition and styling to modal -->
    <Transition name="fade">
      <LetterModal
        v-if="showModal"
        :letter="selectedLetter"
        @close="closeModal"
        @save-letter="handleLetterSaved"
        @update-letter="handleLetterSaved"
        @refresh-letters="fetchLetters"
        class="bg-white rounded-lg shadow-xl"
      />
    </Transition>
  </div>
</template>

<style scoped>
/* Add these styles for the fade transition */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>

<script>
import apiClient from '@/utils/apiClient';
import LetterModal from './LetterModal.vue';
import LetterActions from './LetterActions.vue';
import SearchFilters from './SearchFilters.vue';
import TablePagination from './TablePagination.vue';

export default {
  components: {
    LetterModal,
    LetterActions,
    SearchFilters,
    TablePagination
  },
  emits: ['refresh-letters'],
  data() {
    return {
      letters: [],
      recipients: [],
      showModal: false,  // Add this line
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
    filteredLetters() {
      return this.letters.filter(letter => {
        const matchesTitle = letter.title?.toLowerCase().includes(this.searchQuery.toLowerCase()) ?? false;
        const matchesSubject = letter.subject?.toLowerCase().includes(this.searchSubject.toLowerCase()) ?? false;
        const matchesType = this.selectedType ? letter.type?.toLowerCase() === this.selectedType.toLowerCase() : true;
        // Fix: Change letter.recipient to letter.recipients
        const matchesRecipient = this.searchRecipient ? 
          (Array.isArray(letter.recipients) ? 
            letter.recipients.some(r => r.toLowerCase().includes(this.searchRecipient.toLowerCase())) :
            String(letter.recipients).toLowerCase().includes(this.searchRecipient.toLowerCase())
          ) : true;
        
        const letterDate = new Date(letter.date);  // Changed from date_created to date
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
    closeEditModal() {
      this.showEditModal = false;
      this.currentLetter = null;
    },
    // Remove the duplicate handleNewLetterClick method and update it to handle both modal and routing
    handleNewLetterClick() {
      this.selectedLetter = null;
      this.showModal = true;
    },
    
    closeModal() {
      this.showModal = false;
      this.selectedLetter = null;
    },
    // Update handleLetterSaved
    async handleLetterSaved(_letterData) {
      try {
        await this.fetchLetters();
        this.$router.push('/letters');
      } catch (error) {
        console.error('Error after saving letter:', error);
      }
    },
  
    closeLetterForm() {
      this.showLetterForm = false;
      this.selectedLetter = null;
    },
    addNewRecipient() {
      if (!this.currentLetter.recipients) {
        this.currentLetter.recipients = [];
      }
      this.currentLetter.recipients.push({
        id: '',
        name: '',
        position: ''
      });
    },
  
    removeRecipientAt(index) {
      this.currentLetter.recipients.splice(index, 1);
    },
  
    updateRecipient(index, recipientId) {
      const selectedRecipient = this.recipients.find(r => r.id === recipientId);
      if (selectedRecipient) {
        this.$set(this.currentLetter.recipients, index, {
          id: selectedRecipient.id,
          name: selectedRecipient.name,
          position: selectedRecipient.position
        });
      }
    },
  
    // Update the openEditModal method to handle recipients properly
    async openEditModal(letter) {
      try {
        const letterData = { ...letter };
        if (typeof letterData.recipients === 'string') {
          letterData.recipients = JSON.parse(letterData.recipients);
        }
        this.currentLetter = letterData;
        
        // Initialize selectedRecipients with the letter's recipients
        this.selectedRecipients = Array.isArray(letterData.recipients) 
          ? letterData.recipients.map(r => typeof r === 'object' ? r.name : r)
          : [];
    
        // Ensure recipients are fetched
        if (this.recipients.length === 0) {
          await this.fetchRecipients();
        }
        
        this.showEditModal = true;
      } catch (error) {
        console.error('Error preparing letter data for edit:', error);
      }
    },
  
    // Update the addRecipient method
    addRecipient(event) {
      const selectedValue = event.target.value;
      if (selectedValue && !this.selectedRecipients.includes(selectedValue)) {
        this.selectedRecipients.push(selectedValue);
        this.currentLetter.recipients = this.selectedRecipients;
      }
      event.target.value = ''; // Reset select
    },
  
    // Update the removeRecipient method
    removeRecipient(recipient) {
      this.selectedRecipients = this.selectedRecipients.filter(r => r !== recipient);
      this.currentLetter.recipients = this.selectedRecipients;
    },
  
    closeEditModal() {
      this.showEditModal = false;
      this.currentLetter = null;
      this.selectedRecipients = []; // Reset selected recipients
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
      } catch (error) {
        console.error('Error saving letter:', error);
        // Show error to user
        alert(error.response?.data?.message || 'Failed to save letter. Please check all required fields.');
      }
    },
    async addLetter(letterData) {
      try {
        // Format recipients to ensure they are strings
        const recipients = Array.isArray(letterData.recipients)
          ? letterData.recipients.map(recipient => 
              typeof recipient === 'object' ? recipient.name : String(recipient)
            )
          : [String(letterData.recipients)];
    
        // Format the data before sending
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
    
        console.log('Sending letter data:', formattedData);
    
        const response = await apiClient.post('/letters', formattedData);
        
        if (response.data.success) {
          await this.fetchLetters();
          this.showLetterForm = false;
          this.currentPage = 1;
          this.$emit('refresh-letters');
        } else {
          console.error('Server response indicates failure:', response.data);
          throw new Error(response.data.message || 'Failed to add letter');
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
    async fetchLetters() {
      try {
        console.log('Fetching letters...');
        const response = await apiClient.get('/letters');
        console.log('Letters response:', response.data);
        
        if (response.data.success && Array.isArray(response.data.data)) {
          this.letters = await Promise.all(response.data.data.map(async letter => {
            // Fetch recipient details for each recipient ID
            let recipientDetails = [];
            if (Array.isArray(letter.recipients)) {
              recipientDetails = await Promise.all(letter.recipients.map(async recipient => {
                try {
                  // Make sure we're using the recipient ID, not the whole object
                  const recipientId = typeof recipient === 'object' ? recipient.id : recipient;
                  const recipientResponse = await apiClient.get(`/recipients/${recipientId}`);
                  return recipientResponse.data.data;
                } catch (error) {
                  console.error('Error fetching recipient:', error);
                  return { name: 'Unknown', position: '' };
                }
              }));
            }
          
            return {
              ...letter,
              type: letter.letter_type || 'Unknown Type',
              recipients: recipientDetails
            };
          }));
        }
      } catch (error) {
        console.error('Letters fetch error:', error);
        this.letters = [];
      }
    },
    async fetchRecipients() {
      try {
        const response = await apiClient.get('/recipients');
        if (response.data.success) {
          this.recipients = response.data.data;
          console.log('Recipients fetched:', this.recipients); // Add this line
        }
      } catch (error) {
        console.error('Error fetching recipients:', error);
        this.recipients = [];
      }
    },
    async updateLetter(letterData) {
      try {
        const response = await apiClient.put(`/letters/${letterData.id}`, letterData);
        if (response.data.success) {
          await this.fetchLetters();
          this.showEditModal = false;
        }
      } catch (error) {
        console.error('Error updating letter:', error);
      }
    },
  
    confirmDelete(id) {
      this.confirmDeleteId = id;
      this.showDeleteConfirmModal = true;
    },
  
    async deleteLetter(id) {
      try {
        const response = await apiClient.delete(`/letters/${id}`);
        if (response.data.success) {
          this.showDeleteConfirmModal = false;
          this.showDeleteSuccess = true;
          await this.fetchLetters();
          setTimeout(() => {
            this.showDeleteSuccess = false;
          }, 2000);
        }
      } catch (error) {
        console.error('Error deleting letter:', error);
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
    
    parseRecipients(recipients) {
      if (!recipients) return [];
      
      try {
        if (Array.isArray(recipients)) {
          return recipients.map(recipient => {
            if (typeof recipient === 'string') {
              try {
                const parsed = JSON.parse(recipient);
                return {
                  name: parsed.name || recipient,
                  position: parsed.position || ''
                };
              } catch {
                return { name: recipient, position: '' };
              }
            }
            return {
              name: recipient.name || 'Unknown',
              position: recipient.position || ''
            };
          });
        }
        
        if (typeof recipients === 'string') {
          try {
            const parsed = JSON.parse(recipients);
            return Array.isArray(parsed) ? 
              parsed.map(r => ({ name: r.name || r, position: r.position || '' })) :
              [{ name: parsed.name || parsed, position: parsed.position || '' }];
          } catch {
            return [{ name: recipients, position: '' }];
          }
        }
        
        return [{ name: recipients.name || 'Unknown', position: recipients.position || '' }];
      } catch (error) {
        console.error('Error parsing recipients:', error);
        return [];
      }
    },
    goToPage(page) {
      this.currentPage = page;
    },  // Remove this semicolon here
    
    toggleDropdown(letterId) {
      // Create reactive state if it doesn't exist
      if (!this.dropdownStates[letterId]) {
        this.$set(this.dropdownStates, letterId, false);
      }
      
      // Close all other dropdowns first
      Object.keys(this.dropdownStates).forEach(key => {
        if (key !== letterId.toString()) {
          this.$set(this.dropdownStates, key, false);
        }
      });
      
      // Toggle the current dropdown
      this.$set(this.dropdownStates, letterId, !this.dropdownStates[letterId]);
    
      // Close dropdown when clicking preview or download
      if (this.dropdownStates[letterId]) {
        this.$nextTick(() => {
          const handleClickOutside = (event) => {
            if (!event.target.closest('.relative.inline-block')) {
              this.$set(this.dropdownStates, letterId, false);
              document.removeEventListener('click', handleClickOutside);
            }
          };
          document.addEventListener('click', handleClickOutside);
        });
      }
    },  // Added comma here
  
    // Update the previewLetter method
    async previewLetter(letter) {
      try {
        // Log the letter data for debugging
        console.log('Previewing letter:', letter);

        const response = await apiClient.get(`/letters/${letter.id}/preview`, {
          responseType: 'blob',
          headers: {
            'Accept': 'application/pdf',
            // Remove Content-Type header for blob response
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
        console.error('Error previewing letter details:', {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status,
          headers: error.response?.headers
        });
        
        // Show more specific error message to user
        const errorMessage = error.response?.data?.message || 
          'Unable to preview the letter. Please ensure the letter exists and try again.';
        alert(errorMessage);
      }
    },  // Added comma here
    async downloadLetter(letter) {
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
          
          // Cleanup
          setTimeout(() => {
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
          }, 100);
        } else {
          throw new Error('Failed to download file');
        }
      } catch (error) {
        console.error('Error downloading letter:', error);
        alert('Unable to download the letter. The file might not be available or there was a server error.');
      }
    },

    closePdfPreview() {
      this.showPdfPreview = false;
      if (this.currentPdfUrl) {
        URL.revokeObjectURL(this.currentPdfUrl);
        this.currentPdfUrl = null;
      }
    },
    updateFilters(newFilters) {
      this.searchQuery = newFilters.searchQuery;
      this.searchSubject = newFilters.searchSubject;
      this.searchRecipient = newFilters.searchRecipient;
      this.selectedType = newFilters.selectedType;
      this.dateRange = newFilters.dateRange;
    },

    async exportToWord(letter) {
      try {
        const response = await apiClient.get(`/letters/${letter.id}/export-word`, {
          responseType: 'blob',
          headers: {
            'Accept': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
          }
        });

        if (response.status === 200 && response.data) {
          const blob = new Blob([response.data], { 
            type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' 
          });
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', `${letter.title || 'letter'}-${letter.id}.docx`);
          document.body.appendChild(link);
          link.click();
          
          setTimeout(() => {
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
          }, 100);
        }
      } catch (error) {
        console.error('Error exporting to Word:', error);
        alert('Unable to export the letter to Word format. Please try again later.');
      }
    },
  }
};
</script>

<style scoped>
.overflow-x-auto {
  scrollbar-width: thin;
  scrollbar-color: #CBD5E0 #EDF2F7;
}

.overflow-x-auto::-webkit-scrollbar {
  height: 8px;
}

.overflow-x-auto::-webkit-scrollbar-track {
  background: #EDF2F7;
  border-radius: 4px;
}

.overflow-x-auto::-webkit-scrollbar-thumb {
  background-color: #CBD5E0;
  border-radius: 4px;
  border: 2px solid #EDF2F7;
}

.overflow-x-auto::-webkit-scrollbar-thumb:hover {
  background-color: #A0AEC0;
}

.mb-6 {
  max-width: 100%;
}
</style>

