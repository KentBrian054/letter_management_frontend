<template>
  <div class="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-50">
    <div class="bg-white rounded-lg p-6 w-80">
      <h3 class="text-lg font-medium mb-4">Document Options</h3>
      
      <!-- Preview Button with Eye Icon -->
      <button
        @click="$emit('preview')"
        class="w-full mb-3 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center justify-center gap-2"
        :disabled="isPreviewLoading"
      >
        <template v-if="!isPreviewLoading">
          <EyeIcon class="w-5 h-5" />
          <span>Preview PDF</span>
        </template>
        <template v-else>
          <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span class="ml-2">Generating Preview...</span>
        </template>
      </button>

      <!-- Export Button -->
      <button
        @click="$emit('convert-pdf-to-word')"
        class="w-full mb-4 px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 flex items-center justify-center gap-2"
        :disabled="isExporting"
      >
        <template v-if="!isExporting">
          <DocumentIcon class="w-5 h-5" />
          <span>Export to Word</span>
        </template>
        <template v-else>
          <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span class="ml-2">Exporting...</span>
        </template>
      </button>

      <!-- Close Button -->
      <button
        @click="$emit('close')"
        class="w-full px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
      >
        Close
      </button>
    </div>
  </div>
</template>

<script>
import { EyeIcon, DocumentIcon } from '@heroicons/vue/24/solid'

export default {
  components: {
    EyeIcon,
    DocumentIcon
  },
  props: {
    letter: {
      type: Object,
      required: true
    },
    isPreviewLoading: {
      type: Boolean,
      default: false
    },
    isExporting: {
      type: Boolean,
      default: false
    }
  },
  emits: ['preview', 'convert-pdf-to-word', 'close']
}
</script>

