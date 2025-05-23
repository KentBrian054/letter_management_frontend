<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg p-6 w-96 shadow-lg relative">
      <!-- Simplified Loading Overlay -->
      <div 
        v-if="isPreviewLoading || isExporting" 
        class="absolute inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center rounded-lg z-10"
      >
        <div class="relative">
          <!-- Outer spinning ring -->
          <div class="w-16 h-16 border-4 border-blue-200 rounded-full animate-spin"></div>
          <!-- Inner spinning ring -->
          <div class="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin absolute top-0 left-0" style="animation-duration: 0.6s;"></div>
          <!-- Center dot -->
          <div class="w-3 h-3 bg-blue-600 rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
        </div>
      </div>

      <!-- Modal Content -->
      <h2 class="text-xl font-semibold mb-4">Document Options</h2>

      <button
        @click="$emit('preview-pdf')"
        class="w-full mb-3 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center justify-center gap-2 transition-colors"
        :disabled="isPreviewLoading"
      >
        <template v-if="!isPreviewLoading">
          <EyeIcon class="w-5 h-5" />
          <span>Preview PDF</span>
        </template>
        <template v-else>
          <div class="flex items-center gap-2">
            <div class="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
            <span>Generating...</span>
          </div>
        </template>
      </button>

      <button
        @click="$emit('export-word')"
        class="w-full mb-4 px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 flex items-center justify-center gap-2 transition-colors"
        :disabled="isExporting"
      >
        <template v-if="!isExporting">
          <DocumentIcon class="w-5 h-5" />
          <span>Export to Word</span>
        </template>
        <template v-else>
          <div class="flex items-center gap-2">
            <div class="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
            <span>Converting...</span>
          </div>
        </template>
      </button>
      
      <div class="mt-6 flex justify-end">
        <button 
          @click="$emit('close')" 
          class="py-2 px-4 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { EyeIcon, DocumentIcon } from '@heroicons/vue/24/solid'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'

export default {
  name: 'PreviewOptionsModal',
  components: {
    EyeIcon,
    DocumentIcon,
    LoadingSpinner
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
  emits: ['preview-pdf', 'export-word', 'close']
}
</script>

