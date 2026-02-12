import { createRouter, createWebHistory } from 'vue-router';
import Home from '../components/Home.vue';
import Booking from '../components/Booking.vue';
import Login from '../components/Login.vue';
import { useUserStore } from '../stores/userStore';
import { useToastStore } from '../stores/toastStore';
import Register from '../components/Register.vue'

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/bookings', name: 'Booking', component: Booking, meta: {requiresAuth: true} },
  { path: '/login', name: 'Login', component: Login },
  { path: '/register', name: 'Register', component: Register }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  const userStore = useUserStore();
  const toastStore = useToastStore();

  if(to.meta.requiresAuth && !userStore.token) {
    toastStore.showToast('⚠️ Unauthorized. Please login first.', 'error');
    next("/login");
  } else {
    next()
  }
});

export default router