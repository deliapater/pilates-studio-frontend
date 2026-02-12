<template>
    <div class="booking-page">
      <h2>Book a Class</h2>
  
      <div v-for="(dayClasses, day) in sortedClassesByDay" :key="day" class="day-group">
        <h3>{{ day }}</h3>
  
        <div v-for="cls in dayClasses" :key="cls.id" class="class-card-wrapper">
          <ClassCard
            :className="cls.className || 'TBD'"
            :instructor="cls.instructor || 'TBD'"
            :day="day"
            :time="cls.time || 'TBD'"
            :spots="cls.spots ?? 0"
            :showSpots="true"
          />
  
          <button
            v-if="bookingsMap[cls.id]"
            @click="unbookClass(bookingsMap[cls.id])"
          >
            Unbook
          </button>
  
          <button
            v-else
            @click="bookClass(cls.id)"
            :disabled="cls.spots <= 0 || isBooking"
          >
            {{ cls.spots > 0 ? 'Book Now' : 'Full' }}
          </button>
        </div>
      </div>
  
      <Toast />
    </div>
  </template>
  
  <script setup>
  import ClassCard from './ClassCard.vue'
  import Toast from './Toast.vue'
  import { useRouter } from 'vue-router'
  import { useUserStore } from '../stores/userStore'
  import { useClassesStore } from '../stores/classesStore'
  import { useToastStore } from '../stores/toastStore'
  import { useSpinnerStore } from '../stores/spinnerStore'
  import { ref, computed, onMounted } from 'vue'
  import api from "../services/api"
  
  const router = useRouter()
  const userStore = useUserStore()
  const classesStore = useClassesStore()
  const toastStore = useToastStore()
  const spinner = useSpinnerStore()
  
  const isBooking = ref(false)

  const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
  
  onMounted(async () => {
    await classesStore.fetchClasses()
    if (userStore.token) {
      await userStore.fetchUserBookings()
    }
  })
  
  const bookingsMap = computed(() => {
    const map = {}
    userStore.userBookings.forEach(b => {
      map[b.class_id] = b.id
    })
    return map
  })

  const sortedClassesByDay = computed(() => {
  if (!classesStore.classes) return {}

  const sorted = {}
  weekDays.forEach(day => {
    if (classesStore.classes[day]) {
      sorted[day] = classesStore.classes[day]
    }
  })

  return sorted
})
  
  const bookClass = async (classId) => {
    if (!userStore.token) return
  
    if (isBooking.value) return
    if (bookingsMap.value[classId]) {
      toastStore.showToast("⚠️ You already booked this class", "error")
      return
    }
  
    isBooking.value = true
  
    try {
      const res = await api.post(
        '/bookings',
        { class_id: classId },
        { headers: { Authorization: `Bearer ${userStore.token}` } }
      )
  
      userStore.userBookings.push({
        id: res.data.id,
        class_id: classId
      })
  
      for (const day in classesStore.classes) {
        const cls = classesStore.classes[day].find(c => c.id === classId)
        if (cls) cls.spots--
      }
    } catch (err) {
      toastStore.showToast('⚠️ Something went wrong', 'error')
    } finally {
      isBooking.value = false
    }
  }
  
  const unbookClass = async (bookingId) => {
    if (!bookingId || !userStore.token) return
  
    try {
      await api.delete(`/bookings/${bookingId}`, {
        headers: { Authorization: `Bearer ${userStore.token}` },
      })
  
      const index = userStore.userBookings.findIndex(b => b.id === bookingId)
      if (index !== -1) {
        const classId = userStore.userBookings[index].class_id
        userStore.userBookings.splice(index, 1)
  
        for (const day in classesStore.classes) {
          const cls = classesStore.classes[day].find(c => c.id === classId)
          if (cls) cls.spots++
        }
      }
    } catch (err) {
      toastStore.showToast('⚠️ Something went wrong', 'error')
    }
  }
  </script>
  