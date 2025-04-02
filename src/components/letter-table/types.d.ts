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

declare module './icons' {
  export const EditIcon: any
  export const PreviewDownloadIcon: any
  export const DeleteIcon: any
}