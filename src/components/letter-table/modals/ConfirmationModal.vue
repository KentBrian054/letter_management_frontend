<template>
  <div v-if="show" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg p-6 max-w-md w-full">
      <h3 class="text-lg font-medium mb-4">Confirm Save</h3>
      <p class="mb-6">Are you sure you want to save this letter?</p>
      <div class="flex justify-end gap-3">
        <button 
          @click="$emit('cancel')"
          class="px-4 py-2 border rounded-md hover:bg-gray-100"
        >
          Cancel
        </button>
        <button 
          @click="$emit('confirm')"
          class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Confirm
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  show: Boolean
})

defineEmits(['confirm', 'cancel'])
</script>