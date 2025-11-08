import { createRouter, createWebHistory } from 'vue-router'
import LetterTable from '@/components/letter-table/LetterTable.vue'
import RecipientTable from '@/components/recipient-table/RecipientTable.vue'

const routes = [
  {
    path: '/',
    redirect: '/letters'
  },
  {
    path: '/letters',
    name: 'Letters',
    component: LetterTable
  },
  {
    path: '/recipients',
    name: 'Recipients',
    component: RecipientTable
  }
]

// Use environment variable for base, fallback to '/' for local development
const base = process.env.BASE_URL || '/'

const router = createRouter({
  history: createWebHistory(base),
  routes
})

export default router