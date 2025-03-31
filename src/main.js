import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './index.css'
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'

const app = createApp(App)

// Register QuillEditor globally
app.component('QuillEditor', QuillEditor)

app.use(router)
app.mount('#app')