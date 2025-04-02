<template>
  <div>
    <component :is="EditIcon" v-if="type === 'edit'" />
    <component :is="PreviewDownloadIcon" v-if="type === 'preview-download'" />
    <component :is="DeleteIcon" v-if="type === 'delete'" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export const EditIcon = defineComponent({
  name: 'EditIcon',
  render() {
    return h('span', { class: 'edit-icon' }, '✏️')
  }
})

export const PreviewDownloadIcon = defineComponent({
  name: 'PreviewDownloadIcon',
  render() {
    return h('span', { class: 'preview-download-icon' }, '📥')
  }
})

export const DeleteIcon = defineComponent({
  name: 'DeleteIcon',
  render() {
    return h('span', { class: 'delete-icon' }, '🗑️')
  }
})

export default defineComponent({
  name: 'IconComponent',
  props: {
    type: {
      type: String,
      required: true,
      validator: (value: string) => ['edit', 'preview-download', 'delete'].includes(value)
    }
  }
})
</script>