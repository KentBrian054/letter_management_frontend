import { createRouter, createWebHistory } from 'vue-router'
import LetterForm from '../components/LetterForm.vue'

const routes = [
  {
    path: '/',
    name: 'LetterForm',
    component: LetterForm
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router