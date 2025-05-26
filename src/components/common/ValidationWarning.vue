<template>
  <div class="text-sm text-red-600 mt-1 flex items-center gap-1">
    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
    {{ message }}
  </div>
</template>

<script>
export default {
  name: 'ValidationWarning',
  props: {
    message: {
      type: String,
      required: true
    },
    modelValue: {
      type: Boolean,
      default: false
    },
    letter: {
      type: Object,
      default: () => ({})
    },
    editMode: {
      type: Boolean,
      default: false
    }
  },
  emits: ['update:modelValue', 'refreshLetters', 'close'],
  methods: {
    handleClose() {
      this.$emit('close')
    },
    handleRefresh() {
      this.$emit('refreshLetters')
    }
  }
}
</script>