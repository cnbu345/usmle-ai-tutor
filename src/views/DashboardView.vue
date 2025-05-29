<template>
  <div class="dashboard">
    <h1>Welcome, {{ authStore.user?.email }}!</h1>
    
    <div class="grid">
      <!-- Learning Style Selector -->
      <Card class="col-12 md:col-4">
        <template #title>Your Learning Style</template>
        <template #content>
          <LearningStyleQuiz />
        </template>
      </Card>

      <!-- Recent Modules -->
      <Card class="col-12 md:col-8">
        <template #title>Continue Studying</template>
        <template #content>
          <DataTable :value="modules" @rowClick="goToModule">
            <Column field="title" header="Module"></Column>
            <Column field="learningStyle" header="Style"></Column>
          </DataTable>
        </template>
      </Card>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { useUSMLEStore } from '@/stores/usmle';
import LearningStyleQuiz from '@/components/LearningStyleQuiz.vue';

const authStore = useAuthStore();
const usmleStore = useUSMLEStore();
const router = useRouter();

const modules = [
  { id: 'cardiac_pharm', title: 'Cardiac Pharmacology', learningStyle: 'visual' },
  { id: 'renal_phys', title: 'Renal Physiology', learningStyle: 'auditory' }
];

const goToModule = (event) => {
  router.push(`/module/${event.data.id}`);
};

onMounted(() => {
  if (!authStore.user) router.push('/login');
});
</script>