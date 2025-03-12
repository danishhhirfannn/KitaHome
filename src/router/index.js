import { createRouter, createWebHashHistory } from 'vue-router'
import ProfileManagement from '../views/ProfileManagement.vue'
import Login from '@/views/Login.vue'
import Signup from '@/views/Signup.vue'
import adminDashboard from '@/views/admin/adminDashboard.vue'
import mgmtDashboard from '@/views/management/mgmtDashboard.vue'
import resDashboard from '@/views/resident/resDashboard.vue'

const routes = [
  { path: "/", component: Login },
  { path: "/signup", component: Signup },
  { path: "/admin-dashboard", component: adminDashboard },
  { path: "/management-dashboard", component: mgmtDashboard },
  { path: "/resident-dashboard", component: resDashboard },
  { path: "/profile-management", component: ProfileManagement },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
