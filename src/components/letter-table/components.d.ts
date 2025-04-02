declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module './ActionButton.vue' {
  import type { DefineComponent } from 'vue'
  const ActionButton: DefineComponent<{
    variant: string
    disabled?: boolean
    title?: string
  }>
  export default ActionButton
}

declare module './LetterModal.vue' {
  import type { DefineComponent } from 'vue'
  const LetterModal: DefineComponent<{
    letter: {
      id: number
      title: string
      content: string
      date?: string
      type?: string
      subject?: string
      recipients?: string | Array<{name: string, position?: string}>
    }
  }>
  export default LetterModal
}