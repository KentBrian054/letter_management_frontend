declare module '@vue/runtime-core' {
  interface GlobalComponents {
    ActionButton: typeof import('./ActionButton.vue').default
    PreviewOptionsModal: typeof import('./modals/PreviewOptionsModal.vue').default
    DeleteConfirmationModal: typeof import('./modals/DeleteConfirmationModal.vue').default
    SuccessMessageModal: typeof import('./modals/SuccessMessageModal.vue').default
    LetterModal: typeof import('./LetterModal.vue').default
    LoadingSpinner: typeof import('../common/LoadingSpinner.vue').default
  }
}

// Add interfaces for Letter and Recipient
interface Recipient {
  id: number;
  name: string;
  position?: string;
}

interface Letter {
  id?: number;
  title: string;
  type: string;
  subject: string;
  date: string;
  content: string;
  sender_name: string;
  sender_position: string;
  recipients: Recipient[];
}

declare module './icons' {
  export const EditIcon: any
  export const PreviewDownloadIcon: any
  export const DeleteIcon: any
}

export { Letter, Recipient }