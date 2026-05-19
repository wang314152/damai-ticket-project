import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login.vue'
import EventList from '../views/EventList.vue'
import SeatSelect from '../views/SeatSelect.vue'
import MyOrders from '../views/MyOrders.vue'
import Profile from '../views/Profile.vue'
import Admin from '../views/Admin.vue'
import AIAssistant from '../views/AIAssistant.vue'

const routes = [
  { path: '/', component: EventList },
  { path: '/login', component: Login },
  { path: '/seat/:showId', component: SeatSelect },
  { path: '/orders', component: MyOrders },
  { path: '/profile', component: Profile },
  { path: '/admin', component: Admin },
  { path: '/ai', component: AIAssistant },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
