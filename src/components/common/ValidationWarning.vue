<template>
  <div v-if="message" class="flex items-center gap-2 bg-yellow-50 border border-yellow-400 text-yellow-800 px-3 py-2 rounded shadow mt-1 text-sm">
    <svg class="w-5 h-5 text-yellow-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
        d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
    <span>{{ message }}</span>
  </div>
</template>

<script>
export default {
  name: 'ValidationWarning',
  props: {
    message: {
      type: String,
      default: ''
    }
  }
}
</script>