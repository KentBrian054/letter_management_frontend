import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './index.css'
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import Toast from 'vue-toastification'
import 'vue-toastification/dist/index.css'
import apiClient from './utils/apiClient'
import { initializeQuill } from './utils/quill-config'

const app = createApp(App)

// Register global properties
app.config.globalProperties.$http = apiClient

// Register QuillEditor globally
app.component('QuillEditor', QuillEditor)

// Configure toast notifications
app.use(Toast, {
  timeout: 3000,
  closeOnClick: true,
  pauseOnFocusLoss: true,
})

// Initialize Quill before mounting Vue app
initializeQuill();

createApp(App)
  .use(router)
  .mount('#app');