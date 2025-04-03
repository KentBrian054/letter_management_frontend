<template>
  <div class="flex items-center space-x-2">
    <ActionButton variant="edit" @click="handleEdit" title="Edit Recipient">
      <EditIcon />
    </ActionButton>

    <ActionButton variant="delete" @click="showDeleteConfirm = true" title="Delete Recipient">
      <DeleteIcon />
    </ActionButton>

    <!-- Modals -->
    <Teleport to="body">
      <DeleteConfirmationModal
        v-if="showDeleteConfirm"
        @confirm="handleDelete"
        @cancel="showDeleteConfirm = false"
      />

      <SuccessMessageModal
        v-if="showSuccess"
        :message="successMessage"
        @close="showSuccess = false"
      />
    </Teleport>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { EditIcon, DeleteIcon } from '../letter-table/icons'
import ActionButton from '../letter-table/ActionButton.vue'
import DeleteConfirmationModal from '../letter-table/modals/DeleteConfirmationModal.vue'
import SuccessMessageModal from '../letter-table/modals/SuccessMessageModal.vue'

// Props
const props = defineProps({
  recipient: {
    type: Object,
    required: true,
    validator: (value) => {
      return typeof value?.id === 'number' &&
             typeof value?.name === 'string' &&
             typeof value?.position === 'string'
    }
  }
})

// Emits
const emit = defineEmits(['edit', 'delete', 'refresh'])

// Reactive State
const showDeleteConfirm = ref(false)
const showSuccess = ref(false)
const successMessage = ref('')

// Methods
const showSuccessMessage = (message, duration = 2000) => {
  successMessage.value = message
  showSuccess.value = true
  setTimeout(() => {
    showSuccess.value = false
    successMessage.value = ''
  }, duration)
}

const handleEdit = () => {
  emit('edit', props.recipient)
}

const handleDelete = async () => {
  try {
    emit('delete', props.recipient.id)
    showDeleteConfirm.value = false
    showSuccessMessage('Recipient deleted successfully!')
    emit('refresh')
  } catch (error) {
    console.error('Error deleting recipient:', error)
    showSuccessMessage('Failed to delete recipient. Please try again.', 3000)
  }
}
</script>