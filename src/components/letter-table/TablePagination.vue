<template>
  <div class="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
    <!-- Mobile pagination -->
    <div class="flex flex-1 justify-between sm:hidden">
      <button
        @click="$emit('previous')"
        :disabled="currentPage === 1"
        class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
        :class="{ 'opacity-50 cursor-not-allowed': currentPage === 1 }"
      >
        Previous
      </button>
      <button
        @click="$emit('next')"
        :disabled="currentPage === totalPages"
        class="relative ml-3 inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
        :class="{ 'opacity-50 cursor-not-allowed': currentPage === totalPages }"
      >
        Next
      </button>
    </div>

    <!-- Desktop pagination -->
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
            @click="$emit('goto-page', pageNum)"
            :class="[
              currentPage === pageNum
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
</template>

<script>
export default {
  name: 'TablePagination',
  props: {
    currentPage: {
      type: Number,
      required: true
    },
    totalPages: {
      type: Number,
      required: true
    },
    displayedPages: {
      type: Array,
      required: true
    },
    totalItems: {
      type: Number,
      required: true
    },
    itemsPerPage: {
      type: Number,
      required: true
    }
  },
  computed: {
    startIndex() {
      return (this.currentPage - 1) * this.itemsPerPage;
    },
    endIndex() {
      return Math.min(this.startIndex + this.itemsPerPage, this.totalItems);
    }
  },
  emits: ['previous', 'next', 'goto-page']
}
</script>