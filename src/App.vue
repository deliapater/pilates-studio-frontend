<template>
  <div class="app-container">
    <header>
      <h1>
        Pilates Studio
      </h1>
      <p>
        Build balance, strength, resilience.
      </p>
      <NavBar />
    </header>

    <main>
      <div class="main-content">
        <LoadingSpinner v-if="spinner.isLoading" />
        <div v-else>
          <router-view />
        </div>
      </div>
    </main>
    <Toast />

    <footer>
      <small>&copy; {{ year }} Pilates Studio</small>
    </footer>
  </div>
</template>

<script setup>
import LoadingSpinner from "./components/LoadingSpinner.vue";
import { onMounted } from 'vue'
import NavBar from "./components/NavBar.vue";
import { useSpinnerStore } from "./stores/spinnerStore";
import { useUserStore } from "./stores/userStore";
import Toast from "./components/Toast.vue";

const year = new Date().getFullYear();
const spinner = useSpinnerStore();
const userStore = useUserStore();


if (userStore.token) {
  userStore.fetchUserBookings();
}

onMounted(() => {
  if (userStore.currentUser) {
    spinner.showSpinner("Loading...");
    setTimeout(() => {
      spinner.hideSpinner()
    }, 2000)
  }
})
</script>

<style scoped>
.app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}
.main-content {
  flex: 1;  
  display: flex;
  flex-direction: column;
  align-items: center;      
  justify-content: flex-start; 
  width: 100%;
  max-width: 900px;
  margin: 0 auto;  
  padding: 1rem;
  box-sizing: border-box;
}
</style>
