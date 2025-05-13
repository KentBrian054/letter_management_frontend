<template>
  <div class="text-sm text-red-600 mt-1">{{ message }}</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'ValidationWarning',
  props: {
    message: {
      type: String,
      required: true
    }
  }
})
</script>