<template>
    <div class="booking-page">
        <h2>Book a Class</h2>
        <div>
            <div v-for="cls in classesStore.classes" :key="cls.id">

                <ClassCard v-if="cls" :className="cls.className" :instructor="cls.instructor" :day="cls.day" :time="cls.time"
                    :spots="cls.spots" :showSpots="true" />
                <button v-if="userStore.userBookings.find(b => b.class_id === cls.id)"
                    @click="unbookClass(userStore.userBookings.find(b => b.class_id === cls.id).booking_id)">
                    Unbook
                </button>
                <button v-else @click="bookClass(cls.id)" :disabled="cls.spots <= 0">
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

const router = useRouter()
const userStore = useUserStore()
const classesStore = useClassesStore()
const toastStore = useToastStore()
const spinner = useSpinnerStore()

const isBooking = ref(false)

onMounted(async () => {
    await classesStore.fetchClasses();
});


const bookClass = async (classId) => {
    if (!userStore.token) {
        toastStore.showToast('⚠️ You must be logged in to book a class', "error")
        router.push('/login')
        return
    }

    if (isBooking.value) return;
    isBooking.value = true;
    spinner.showSpinner('Booking your class...');

    try {
        const res = await api.post(
            "/bookings",
            { class_id: classId },
            {
                headers: {
                    Authorization: `Bearer ${userStore.token}`,
                },
            }
        );
        toastStore.showToast("✅ Class booked successfully!", "success");

        const bookedClass = classesStore.classes.find((c) => c.id === classId);
        if (bookedClass && bookedClass.spots > 0) {
            bookedClass.spots--;
        }
    } catch (err) {
        if (err.response?.status === 409) {
            toastStore.showToast("⚠️ You already booked this class", "error");
        } else if (err.response?.status === 401) {
            toastStore.showToast("❌ Unauthorized. Please login again.", "error");
        } else {
            toastStore.showToast("⚠️ Something went wrong", "error");
        }
    } finally {
        spinner.hideSpinner();
        isBooking.value = false;
        await classesStore.fetchClasses();
    }

}

const unbookClass = async (bookingId) => {
    if (!userStore.token) {
        toastStore.showToast('⚠️ You must be logged in', 'error');
        router.push('/login');
        return;
    }

    try {
        await api.delete(`bookings/${bookingId}`, {
            headers: {
                Authorization: `Bearer ${userStore.token}`,
            },
        });
        toastStore.showToast('✅ Class unbooked successfully', 'success');
        userStore.userBookings = userStore.userBookings.filter(
            (b) => b.id !== bookingId
        );

        await userStore.fetchUserBookings();
    } catch (err) {
        toastStore.showToast('⚠️ Something went wrong', 'error')
    }

}
</script>