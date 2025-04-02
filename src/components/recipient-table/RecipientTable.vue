<template>
  <div class="space-y-4">
    <!-- Header section with search and add button -->
    <div class="flex justify-between items-center">
      <div class="w-64">
        <input
          type="text"
          v-model="searchQuery"
          placeholder="Search recipients..."
          class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      
      <button
        @click="showAddModal = true"
        class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
      >
        <PlusIcon class="h-5 w-5 mr-2" />
        Add Recipient
      </button>
    </div>

    <!-- Table -->
    <div class="overflow-x-auto">
      <table class="min-w-full bg-white border border-gray-200 rounded-lg">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Position</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">
          <tr v-for="recipient in paginatedRecipients" :key="recipient.id" class="hover:bg-gray-50">
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ recipient.name }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ recipient.position }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm">
              <RecipientActions 
                :recipient="recipient"
                @edit="handleEdit"
                @delete="handleDelete"
                @refresh="fetchRecipients"
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div class="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
      <div class="flex flex-1 justify-between sm:hidden">
        <button
          @click="page > 1 ? page-- : null"
          :disabled="page === 1"
          class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          :class="{ 'opacity-50 cursor-not-allowed': page === 1 }"
        >
          Previous
        </button>
        <button
          @click="page < totalPages ? page++ : null"
          :disabled="page === totalPages"
          class="relative ml-3 inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          :class="{ 'opacity-50 cursor-not-allowed': page === totalPages }"
        >
          Next
        </button>
      </div>
      <div class="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <p class="text-sm text-gray-700">
            Showing <span class="font-medium">{{ startIndex + 1 }}</span> to
            <span class="font-medium">{{ endIndex }}</span> of
            <span class="font-medium">{{ totalItems }}</span> results
          </p>
        </div>
        <div>
          <nav class="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
            <button
              v-for="pageNum in displayedPages"
              :key="pageNum"
              @click="page = pageNum"
              :class="[
                page === pageNum
                  ? 'relative z-10 inline-flex items-center bg-blue-600 px-4 py-2 text-sm font-semibold text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600'
                  : 'relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0',
              ]"
            >
              {{ pageNum }}
            </button>
          </nav>
        </div>
      </div>
    </div>

    <!-- Add RecipientForm Modal -->
    <RecipientForm
      v-if="showAddModal"
      :recipient="selectedRecipient"
      @close="closeModal"
      @save="handleSave"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import axios from 'axios'
import RecipientActions from './RecipientActions.vue'
import RecipientForm from './RecipientForm.vue'  // Changed from RecipientModal
import PlusIcon from './icons/PlusIcon.vue'

interface Recipient {
  id: number
  name: string
  position: string
}

const recipients = ref<Recipient[]>([])
const showAddModal = ref(false)
const selectedRecipient = ref<Recipient | null>(null)

// Add error type interface
interface ApiError {
  code?: string;
  response?: {
    data: {
      message?: string;
    };
  };
}

const fetchRecipients = async () => {
  try {
    const response = await axios.get('http://192.168.5.11:8000/api/recipients', {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      timeout: 5000
    })
    recipients.value = response.data
  } catch (error) {
    const err = error as ApiError
    console.error('Error fetching recipients:', err)
    if (err.code === 'ERR_NETWORK') {
      alert('Cannot connect to the server. Please check your network connection.')
    } else if (err.code === 'ECONNABORTED') {
      alert('Request timed out. Server is taking too long to respond.')
    } else {
      alert('Failed to fetch recipients. Please try again later.')
    }
  }
}

const handleEdit = (recipient: Recipient) => {
  selectedRecipient.value = recipient
  showAddModal.value = true
}

const handleDelete = async (id: number) => {
  try {
    await axios.delete(`http://192.168.5.11:8000/api/recipients/${id}`)
    await fetchRecipients()
  } catch (error) {
    const err = error as ApiError
    console.error('Error deleting recipient:', err)
    alert('Failed to delete recipient. Please try again.')
  }
}

const handleSave = async (recipient: Recipient) => {
  await fetchRecipients()
  closeModal()
}

const closeModal = () => {
  showAddModal.value = false
  selectedRecipient.value = null
}

onMounted(() => {
  fetchRecipients()
})

// Add these new imports and refs
const searchQuery = ref('')
const page = ref(1)
const itemsPerPage = 10

// Add computed properties
const filteredRecipients = computed(() => {
  return recipients.value.filter((recipient: Recipient) => 
    recipient.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    recipient.position.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

const totalItems = computed(() => filteredRecipients.value.length)
const totalPages = computed(() => Math.ceil(totalItems.value / itemsPerPage))
const startIndex = computed(() => (page.value - 1) * itemsPerPage)
const endIndex = computed(() => Math.min(startIndex.value + itemsPerPage, totalItems.value))

const displayedPages = computed(() => {
  const pages = []
  for (let i = 1; i <= totalPages.value; i++) {
    pages.push(i)
  }
  return pages
})

const paginatedRecipients = computed(() => {
  return filteredRecipients.value.slice(startIndex.value, endIndex.value)
})

// Update your v-for in the table to use paginatedRecipients instead of recipients
// <tr v-for="recipient in paginatedRecipients" :key="recipient.id" class="hover:bg-gray-50">

// Watch for search query changes to reset pagination
watch(searchQuery, () => {
  page.value = 1
})
</script>
