<template>
    <nav class="nav-bar">
        <div class="links">
            <router-link to="/">Home</router-link>
            <router-link to="/bookings">Bookings</router-link>
        </div>
        <div v-if="userStore.token" class="logout">
            <Logout />
        </div>
    </nav>
</template>

<script setup>
import { useUserStore } from "../stores/userStore";
import Logout from "./Logout.vue";

const userStore = useUserStore();
</script>

<style scoped>
.nav-bar {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 1rem;
    margin-top: 1rem;
}

.nav-bar .links,
.nav-bar .logout {
  display: flex;
  gap: 1rem;
}

.logout {
  margin-left: auto; /* pushes logout to the far right */
}
.nav-bar a,
.nav-bar button {
    padding: 0.5rem 1rem;
    font-size: 1rem;
    border-radius: 6px;
    border: none;
    cursor: pointer;
}

.nav-bar a {
    background-color: #42b883;
    color: white;
    text-decoration: none;
}

.nav-bar a:hover {
    background-color: #36976c;
}

.nav-bar button {
    background-color: #e74c3c;
    color: white;
}

.nav-bar button:hover {
    background-color: #c0392b;
}

@media (min-width: 600px) {
    .nav-bar {
        justify-content: flex-start;
    }
    .logout {
    margin-left: 0;
  }
}

</style>
