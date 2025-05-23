<template>
  <div class="flex items-center space-x-2">
    <!-- Edit Button with updated icon -->
    <ActionButton 
      variant="edit" 
      @click="$emit('edit', recipient)" 
      title="Edit Recipient"
      class="group relative hover:bg-blue-600 hover:text-white transition-colors duration-200"
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="w-5 h-5">
        <path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" 
          d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
        <path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" 
          d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
      </svg>
    </ActionButton>
    
    <!-- Delete Button with updated icon -->
    <ActionButton 
      variant="delete" 
      @click="showDeleteConfirm = true"
      title="Delete Recipient"
      class="group relative hover:bg-red-600 hover:text-white transition-colors duration-200"
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="w-5 h-5">
        <path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" 
          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
      </svg>
    </ActionButton>

    <!-- Rest of the modals remain unchanged -->
    <!-- Delete Confirmation Modal -->
    <ConfirmationModal
      :show="showDeleteConfirm"
      title="Confirm Delete"
      message="Are you sure you want to delete this recipient?"
      @confirm="handleDelete"
      @cancel="showDeleteConfirm = false"
    />

    <SuccessMessageModal
      v-if="showSuccessMessage"
      message="Recipient deleted successfully!"
      @close="showSuccessMessage = false"
    />
  </div>
</template>

<script>
import ActionButton from '../letter-table/ActionButton.vue'
import ConfirmationModal from '../letter-table/modals/ConfirmationModal.vue'
import SuccessMessageModal from '../letter-table/modals/SuccessMessageModal.vue'

export default {
  name: 'RecipientActions',
  components: {
    ActionButton,
    ConfirmationModal,
    SuccessMessageModal
  },
  props: {
    recipient: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      showDeleteConfirm: false,
      showSuccessMessage: false
    }
  },
  methods: {
    async handleDelete() {
      this.$emit('delete', this.recipient.id)
      this.showDeleteConfirm = false
      this.showSuccessMessage = true
      setTimeout(() => {
        this.showSuccessMessage = false
      }, 3000) // Hide success message after 3 seconds
    }
  }
}
</script>