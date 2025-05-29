<template>
  <div v-if="usmleStore.currentModule">
    <!-- Visual Learners -->
    <div v-if="usmleStore.learningStyle === 'visual'">
      <img :src="usmleStore.currentModule.visualDiagram" />
    </div>

    <!-- Auditory Learners -->
    <div v-else-if="usmleStore.learningStyle === 'auditory'">
      <audio controls :src="usmleStore.currentModule.audioSummary"></audio>
    </div>
  </div>
</template>

<script setup>
import { useUSMLEStore } from '@/stores/usmle';
const usmleStore = useUSMLEStore();
</script>