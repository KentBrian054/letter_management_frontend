<template>
  <div class="p-6">
    <!-- Remove the Network Status Indicator -->
    
    <!-- Header and Add New Letter button -->
    <div class="flex justify-end items-center mb-6">
      <button 
        @click="handleNewLetterClick" 
        class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md flex items-center gap-2"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        New
      </button>
    </div>
    <!-- Search and Filter Bar -->
    <div class="mb-6 bg-white rounded-lg shadow p-4">
      <div class="flex flex-wrap gap-4 items-center">
        <!-- Title Search -->
        <div class="flex-1 min-w-[200px]">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search by title..."
            class="w-full px-4 py-2 border rounded-md"
          />
        </div>

        <!-- Subject Search -->
        <div class="flex-1 min-w-[200px]">
          <input
            v-model="searchSubject"
            type="text"
            placeholder="Search by subject..."
            class="w-full px-4 py-2 border rounded-md"
          />
        </div>

        <!-- Recipient Search -->
        <div class="flex-1 min-w-[200px]">
          <input
            v-model="searchRecipient"
            type="text"
            placeholder="Search by recipient..."
            class="w-full px-4 py-2 border rounded-md"
          />
        </div>

        <!-- Type Filter -->
        <div class="w-[150px]">
          <select
            v-model="selectedType"
            class="w-full px-4 py-2 border rounded-md"
          >
            <option value="">All Types</option>
            <option value="memo">Memo</option>
            <option value="business-letter">Business Letter</option>
          </select>
        </div>

        <!-- Date Range Filter -->
        <div class="flex gap-2">
          <input
            type="date"
            v-model="dateRange.start"
            class="w-[160px] px-4 py-2 border rounded-md"
          />
          <input
            type="date"
            v-model="dateRange.end"
            class="w-[160px] px-4 py-2 border rounded-md"
          />
        </div>
      </div>
    </div>

    <!-- Table Section -->
    <div class="bg-white rounded-lg shadow">
      <div class="overflow-x-auto">
        <table class="min-w-full table-fixed">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Recipients</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <template v-if="letters.length">
              <tr v-for="letter in paginatedLetters" :key="letter.id">
                <td class="px-6 py-4 whitespace-nowrap flex space-x-3">
                  <button 
                    @click="openEditModal(letter)" 
                    class="p-2 rounded-lg text-blue-600 hover:text-blue-900 hover:bg-blue-100/50 transition-colors group relative"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                    </svg>
                    <span class="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-700 text-white text-xs px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
                      Edit
                    </span>
                  </button>
                  <button 
                    @click="confirmDelete(letter.id)" 
                    class="p-2 rounded-lg text-red-600 hover:text-red-900 hover:bg-red-100/50 transition-colors group relative"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                    </svg>
                    <span class="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-700 text-white text-xs px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
                      Delete
                    </span>
                  </button>
                  <div class="flex space-x-2">
                    <button 
                      @click="previewLetter(letter)"
                      class="p-2 rounded-lg text-green-600 hover:text-green-900 hover:bg-green-100/50 transition-colors group relative"
                    >
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                        <circle cx="12" cy="12" r="3" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
                      </svg>
                      <span class="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-700 text-white text-xs px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
                        Preview PDF
                      </span>
                    </button>
                    <button 
                      @click="downloadLetter(letter)"
                      class="p-2 rounded-lg text-green-600 hover:text-green-900 hover:bg-green-100/50 transition-colors group relative"
                    >
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                      </svg>
                      <span class="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-700 text-white text-xs px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
                        Download PDF
                      </span>
                    </button>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">{{ letter.title }}</td>
                <td class="px-6 py-4 whitespace-nowrap">{{ formatDate(letter.date) }}</td>
                <td class="px-6 py-4 whitespace-nowrap">{{ letter.type }}</td>
                <td class="px-6 py-4 whitespace-nowrap">{{ letter.subject }}</td>
                <td class="px-6 py-4">
                  <div class="flex flex-wrap gap-1">
                    <template v-if="letter.recipients">
                      <span 
                        v-for="recipient in (typeof letter.recipients === 'string' ? 
                          JSON.parse(letter.recipients) : letter.recipients)" 
                        :key="recipient"
                        class="px-2 py-1 bg-gray-100 rounded-md text-sm"
                      >
                        {{ typeof recipient === 'object' ? recipient.name : recipient }}
                      </span>
                    </template>
                    <span v-else class="text-gray-500">No recipients</span>
                  </div>
                </td>
              </tr>
            </template>
            <tr v-else>
              <td colspan="6" class="px-6 py-4 text-center text-gray-500">
                No letters found
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <!-- After the table -->
      
      <!-- Update Letter Modal -->
      <div v-if="showEditModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
        <div class="bg-white p-6 rounded-lg shadow-xl max-w-4xl w-full">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-medium">Update Letter</h3>
            <button @click="closeEditModal" class="text-gray-500 hover:text-gray-700">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
      
          <form @submit.prevent="handleUpdate" class="space-y-4">
            <div class="grid grid-cols-2 gap-4">
              <!-- Title -->
              <div>
                <label class="block text-sm font-medium text-gray-700">Title</label>
                <input
                  v-model="currentLetter.title"
                  type="text"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
      
              <!-- Type -->
              <div>
                <label class="block text-sm font-medium text-gray-700">Type</label>
                <select
                  v-model="currentLetter.type"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                >
                  <option value="memo">Memo</option>
                  <option value="business-letter">Business Letter</option>
                </select>
              </div>
      
              <!-- Subject -->
              <div>
                <label class="block text-sm font-medium text-gray-700">Subject</label>
                <input
                  v-model="currentLetter.subject"
                  type="text"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
      
              <!-- Date -->
              <div>
                <label class="block text-sm font-medium text-gray-700">Date</label>
                <input
                  v-model="currentLetter.date"
                  type="date"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
      
              <!-- Recipients -->
              <div class="col-span-2">
                <label class="block text-sm font-medium text-gray-700">Recipients</label>
                <select
                  v-model="currentLetter.recipients"
                  multiple
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                >
                  <option v-for="recipient in recipients" :key="recipient.id" :value="recipient.name">
                    {{ recipient.name }}
                  </option>
                </select>
              </div>
      
              <!-- Content -->
              <div class="col-span-2">
                <label class="block text-sm font-medium text-gray-700">Content</label>
                <textarea
                  v-model="currentLetter.content"
                  rows="4"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                ></textarea>
              </div>
      
              <!-- Sender Name -->
              <div>
                <label class="block text-sm font-medium text-gray-700">Sender Name</label>
                <input
                  v-model="currentLetter.sender_name"
                  type="text"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
      
              <!-- Sender Position -->
              <div>
                <label class="block text-sm font-medium text-gray-700">Sender Position</label>
                <input
                  v-model="currentLetter.sender_position"
                  type="text"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
            </div>
      
            <div class="flex justify-end space-x-3 mt-6">
              <button
                type="button"
                @click="closeEditModal"
                class="px-4 py-2 border rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                Update Letter
              </button>
            </div>
          </form>
        </div>
      </div>

    <!-- Pagination -->
    <div class="mt-4 flex items-center justify-between">
      <!-- ... pagination content ... -->
    </div>
  </div>  <!-- Add this closing div -->

  <!-- Letter Form Modal -->
  <LetterForm
    v-if="showLetterForm"
    :letter="selectedLetter"
    @close="closeLetterForm"
    @save="handleLetterSaved"
  />

  <!-- Update Letter Modal -->
  <div v-if="showEditModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
    <div class="bg-white p-6 rounded-lg shadow-xl max-w-4xl w-full">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-lg font-medium">Update Letter</h3>
        <button @click="closeEditModal" class="text-gray-500 hover:text-gray-700">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
  
      <form @submit.prevent="handleUpdate" class="space-y-4">
        <div class="grid grid-cols-2 gap-4">
          <!-- Title -->
          <div>
            <label class="block text-sm font-medium text-gray-700">Title</label>
            <input
              v-model="currentLetter.title"
              type="text"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
  
          <!-- Type -->
          <div>
            <label class="block text-sm font-medium text-gray-700">Type</label>
            <select
              v-model="currentLetter.type"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            >
              <option value="memo">Memo</option>
              <option value="business-letter">Business Letter</option>
            </select>
          </div>
  
          <!-- Subject -->
          <div>
            <label class="block text-sm font-medium text-gray-700">Subject</label>
            <input
              v-model="currentLetter.subject"
              type="text"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
  
          <!-- Date -->
          <div>
            <label class="block text-sm font-medium text-gray-700">Date</label>
            <input
              v-model="currentLetter.date"
              type="date"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
  
          <!-- Recipients -->
          <div class="col-span-2">
            <label class="block text-sm font-medium text-gray-700">Recipients</label>
            <select
              v-model="currentLetter.recipients"
              multiple
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            >
              <option v-for="recipient in recipients" :key="recipient.id" :value="recipient.name">
                {{ recipient.name }}
              </option>
            </select>
          </div>
  
          <!-- Content -->
          <div class="col-span-2">
            <label class="block text-sm font-medium text-gray-700">Content</label>
            <textarea
              v-model="currentLetter.content"
              rows="4"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            ></textarea>
          </div>
  
          <!-- Sender Name -->
          <div>
            <label class="block text-sm font-medium text-gray-700">Sender Name</label>
            <input
              v-model="currentLetter.sender_name"
              type="text"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
  
          <!-- Sender Position -->
          <div>
            <label class="block text-sm font-medium text-gray-700">Sender Position</label>
            <input
              v-model="currentLetter.sender_position"
              type="text"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
        </div>
  
        <div class="flex justify-end space-x-3 mt-6">
          <button
            type="button"
            @click="closeEditModal"
            class="px-4 py-2 border rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Update Letter
          </button>
        </div>
      </form>
    </div>
  </div>

  <!-- Delete Confirmation Modal -->
  <div v-if="showDeleteConfirmModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
    <div class="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full">
      <h3 class="text-lg font-medium mb-4">Confirm Delete</h3>
      <p class="text-gray-600 mb-6">Are you sure you want to delete this letter? This action cannot be undone.</p>
      <div class="flex justify-end space-x-3">
        <button
          @click="showDeleteConfirmModal = false"
          class="px-4 py-2 border rounded-md hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          @click="deleteLetter(confirmDeleteId)"
          class="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
        >
          Delete
        </button>
      </div>
    </div>
  </div>

  <!-- Success Message -->
  <div
    v-if="showDeleteSuccess"
    class="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-md shadow-lg"
  >
    Letter deleted successfully
  </div>
</template>

<script>
import axios from 'axios';
import axiosRetry from 'axios-retry';
import LetterForm from './LetterForm.vue';
import * as pdfjsLib from 'pdfjs-dist';

// Keep the apiClient configuration
const apiClient = axios.create({
  baseURL: 'http://192.168.8.36:8000/api',  // Update this line to match LetterForm.vue
  timeout: 60000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Access-Control-Allow-Origin': '*'
  },
  withCredentials: false,
  proxy: false,
  maxRedirects: 5,
  keepAlive: true
});

// Configure retry mechanism with more attempts and longer delays
axiosRetry(apiClient, {
  retries: 3,
  retryDelay: (retryCount) => {
    return retryCount * 5000; // Wait 5s, 10s, 15s between retries
  },
  retryCondition: (error) => {
    return axiosRetry.isNetworkOrIdempotentRequestError(error) || 
           error.code === 'ECONNABORTED' ||
           error.response?.status >= 500;
  },
  shouldResetTimeout: true
});

// Add this line after your imports
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

export default {
  components: {
    LetterForm
  },
  emits: ['refresh-letters'],
  data() {
    return {
      letters: [],
      recipients: [],
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
        const matchesRecipient = this.searchRecipient ? 
          (Array.isArray(letter.recipient) ? 
            letter.recipient.some(r => r.toLowerCase().includes(this.searchRecipient.toLowerCase())) :
            String(letter.recipient).toLowerCase().includes(this.searchRecipient.toLowerCase())
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
    handleNewLetterClick() {
      this.selectedLetter = null;
      this.showLetterForm = true;
    },

    closeLetterForm() {
      this.showLetterForm = false;
      this.selectedLetter = null;
    },
    async openEditModal(letter) {
      try {
        const letterData = { ...letter };
        if (typeof letterData.recipients === 'string') {
          letterData.recipients = JSON.parse(letterData.recipients);
        }
        this.currentLetter = letterData;
        this.showEditModal = true;
      } catch (error) {
        console.error('Error preparing letter data for edit:', error);
      }
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
        
        if (response.data.success && Array.isArray(response.data.data)) {
          this.letters = response.data.data;
          const maxPage = Math.ceil(this.letters.length / this.perPage);
          if (this.currentPage > maxPage) {
            this.currentPage = maxPage || 1;
          }
        } else {
          console.error('Unexpected data structure:', response.data);
          this.letters = [];
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

    goToPage(page) {
      this.currentPage = page;
    },  // Add comma here
    
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
    },

    previewLetter(letter) {
      try {
        // First try to get the PDF blob
        apiClient.get(`/letters/${letter.id}/preview`, {
          responseType: 'blob'
        }).then(response => {
          // Create blob URL and open in new window
          const blob = new Blob([response.data], { type: 'application/pdf' });
          const blobUrl = window.URL.createObjectURL(blob);
          
          // Open in new window
          const newWindow = window.open();
          if (newWindow) {
            newWindow.document.write(`
              <iframe 
                src="${blobUrl}" 
                style="width: 100%; height: 100vh; border: none;"
                type="application/pdf"
              ></iframe>
            `);
          }
        }).catch(error => {
          console.error('Error previewing letter:', error);
          alert('Failed to preview PDF. Please try again.');
        });
      } catch (error) {
        console.error('Error previewing letter:', error);
      }
    },

    async downloadLetter(letter) {
      try {
        const response = await apiClient.get(`/letters/${letter.id}/download`, {
          responseType: 'blob'
        });
        
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `letter-${letter.id}.pdf`);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
      } catch (error) {
        console.error('Error downloading letter:', error);
      }
    },

    closePdfPreview() {
      this.showPdfPreview = false;
      if (this.currentPdfUrl) {
        URL.revokeObjectURL(this.currentPdfUrl);
        this.currentPdfUrl = null;
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
    
