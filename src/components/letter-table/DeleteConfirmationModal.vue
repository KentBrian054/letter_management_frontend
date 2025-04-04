<template>
  <Transition name="fade">
    <div v-if="show" class="fixed inset-0 z-50 overflow-y-auto">
      <div class="flex items-center justify-center min-h-screen">
        <div class="fixed inset-0 bg-black/50 backdrop-blur-sm"></div>
        <div class="relative bg-white rounded-lg p-6 max-w-md w-full mx-4">
          <h3 class="text-lg font-medium mb-4">Confirm Delete</h3>
          <p class="mb-6">Are you sure you want to delete this letter?</p>
          <div class="flex justify-end gap-2">
            <button 
              @click="$emit('close')"
              class="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
            >
              Cancel
            </button>
            <button 
              @click="$emit('confirm')"
              class="px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script>
export default {
  props: {
    show: {
      type: Boolean,
      required: true
    }
  },
  emits: ['close', 'confirm']
}
</script>