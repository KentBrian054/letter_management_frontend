<template>
  <div class="flex items-center space-x-2">
    <ActionButton variant="edit" @click="$emit('edit', recipient)" title="Edit Recipient">
      <EditIcon />
    </ActionButton>

    <ActionButton variant="delete" @click="showDeleteConfirm = true" title="Delete Recipient">
      <DeleteIcon />
    </ActionButton>

    <!-- Delete Confirmation Modal -->
    <DeleteConfirmationModal
      v-if="showDeleteConfirm"
      @confirm="handleDelete"
      @cancel="showDeleteConfirm = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { PropType } from 'vue'
import ActionButton from '../letter-table/ActionButton.vue'
import DeleteConfirmationModal from '../letter-table/modals/DeleteConfirmationModal.vue'
import { EditIcon, DeleteIcon } from '../letter-table/icons'

interface Recipient {
  id: number;
  name: string;
  position: string;
}

const props = defineProps({
  recipient: {
    type: Object as PropType<Recipient>,
    required: true
  }
})

const emit = defineEmits<{
  (e: 'edit', recipient: Recipient): void
  (e: 'delete', id: number): void
  (e: 'refresh'): void
}>()

const showDeleteConfirm = ref(false)

const handleDelete = () => {
  emit('delete', props.recipient.id)
  showDeleteConfirm.value = false
}
</script>