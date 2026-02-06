<template>
  <div>
    <h2>{{ className || 'No class name' }}</h2>
    <p>Instructor: {{ instructor || 'TBD' }}</p>
    <p>Day: {{ day || 'TBD' }}</p>
    <p>Time: {{ time || 'TBD' }}</p>
    <p v-if="showSpots && spots !== null">Spots Available: {{ spots }}</p>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useUserStore } from '../stores/userStore'
const userStore = useUserStore()

const props = defineProps({
  className: String,
  instructor: String,
  day: String,
  time: String,
  spots: {
    type: Number,
    default: null
  },
  showSpots: {
    type: Boolean,
    default: false
  }
})

const isBooked = computed(() => {
  return useUserStore.userBookings[useUserStore.currentUser]?.includes(props.classId)
})
</script>
<style scoped>
div {
  padding: 1rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  text-align: left;
}

h2 {
  font-size: 1.25rem;
  font-weight: bold;
}
</style>