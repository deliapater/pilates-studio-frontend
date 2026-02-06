<template>
    <div class="booking-page">
        <h2>Book a Class</h2>
        <div>
            <div v-for="cls in classesStore.classes" :key="cls.id">
                <ClassCard v-if="cls" :className="cls.className" :instructor="cls.instructor" :day="cls.day"
                    :time="cls.time" :spots="cls.spots" :showSpots="true" />

                <button v-if="bookingsMap[cls.id]" @click="unbookClass(bookingsMap[cls.id])">
                    Unbook
                </button>

                <button v-else @click="bookClass(cls.id)" :disabled="cls.spots <= 0 || isBooking">
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
import { ref } from 'vue'
import api from "../services/api";
import { onMounted } from "vue";
import { computed } from 'vue';

const router = useRouter()
const userStore = useUserStore()
const classesStore = useClassesStore()
const toastStore = useToastStore()
const spinner = useSpinnerStore()

const isBooking = ref(false)

onMounted(async () => {
    await classesStore.fetchClasses();
    if (userStore.token) {
        await userStore.fetchUserBookings();
    }
});

const bookingsMap = computed(() => {
    const map = {};
    userStore.userBookings.forEach(b => {
        map[b.class_id] = b.id;
    });
    return map;
});

const bookClass = async (classId) => {
    if (!userStore.token) return;

    if (isBooking.value) return;
    if (bookingsMap.value[classId]) {
        toastStore.showToast("⚠️ You already booked this class", "error");
        return;
    }

    isBooking.value = true;

    try {
        const res = await api.post(
            '/bookings',
            { class_id: classId },
            { headers: { Authorization: `Bearer ${userStore.token}` } }
        );

        userStore.userBookings.push({
            id: res.data.id,
            class_id: classId
        });

        const cls = classesStore.classes.find(c => c.id === classId);
        if (cls) cls.spots--;

    } catch (err) {
        toastStore.showToast('⚠️ Something went wrong', 'error');
    } finally {
        isBooking.value = false;
    }
};



const unbookClass = async (bookingId) => {
    if (!bookingId || !userStore.token) return;

    try {
        await api.delete(`/bookings/${bookingId}`, {
            headers: { Authorization: `Bearer ${userStore.token}` },
        });
        const index = userStore.userBookings.findIndex(b => b.id === bookingId);
        if (index !== -1) {
            const classId = userStore.userBookings[index].class_id;
            userStore.userBookings.splice(index, 1);

            const cls = classesStore.classes.find(c => c.id === classId);
            if (cls) cls.spots++;
        }

    } catch (err) {
        toastStore.showToast('⚠️ Something went wrong', 'error');
    }
};

</script>