<template>
  <div class="flex space-x-2">
    <button
      @click="$emit('edit', letter)"
      class="text-green-600 hover:text-green-800 p-1"
      title="Edit"
    >
      <i class="fas fa-edit text-lg"></i>
    </button>
    
    <button
      @click="$emit('preview', letter)"
      class="text-blue-600 hover:text-blue-800 p-1"
      title="Preview"
    >
      <i class="fas fa-eye text-lg"></i>
    </button>

    <button
      @click="$emit('delete', letter.id)"
      class="text-red-600 hover:text-red-800 p-1"
      title="Delete"
    >
      <i class="fas fa-trash text-lg"></i>
    </button>
  </div>
</template>

<script>
export default {
  name: 'LetterActions',
  props: {
    letter: {
      type: Object,
      required: true
    }
  }
}
</script>