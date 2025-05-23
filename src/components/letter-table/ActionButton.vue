<template>
  <button 
    :class="[
      'inline-flex items-center justify-center rounded-lg',
      'w-10 h-10 mx-1',
      'transition-all duration-200 ease-in-out',
      'hover:shadow-md active:scale-95',
      variantClasses[variant]
    ]"
  >
    <slot>
      <!-- Edit Icon -->
      <template v-if="variant === 'edit'">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="w-5 h-5">
          <path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" 
            d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
          <path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" 
            d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
        </svg>
      </template>
      
      <!-- Delete Icon -->
      <template v-else-if="variant === 'delete'">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="w-5 h-5">
          <path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" 
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </template>

      <!-- Preview/Document Icon -->
      <template v-else-if="variant === 'preview'">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="w-5 h-5">
          <path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" 
            d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" 
            d="M14 2v6h6" />
          <path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" 
            d="M16 13H8" />
          <path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" 
            d="M16 17H8" />
          <path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" 
            d="M10 9H8" />
        </svg>
      </template>
    </slot>
  </button>
</template>

<script>
export default {
  name: 'ActionButton',
  props: {
    variant: {
      type: String,
      default: 'default'
    }
  },
  computed: {
    variantClasses() {
      return {
        edit: 'bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white border border-blue-200',
        preview: 'bg-purple-50 text-purple-600 hover:bg-purple-600 hover:text-white border border-purple-200',
        delete: 'bg-red-50 text-red-600 hover:bg-red-600 hover:text-white border border-red-200',
        default: 'bg-gray-50 text-gray-600 hover:bg-gray-600 hover:text-white border border-gray-200'
      }
    }
  }
}
</script>

<style scoped>
button {
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}

button:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

button:active {
  transform: translateY(0);
}

.hover\:shadow-md:hover {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}
</style>