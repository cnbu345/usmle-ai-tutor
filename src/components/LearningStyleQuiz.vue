<template>
  <div>
    <h3>How do you learn best?</h3>
    <div class="flex gap-3">
      <Button 
        v-for="style in ['visual', 'auditory', 'reading', 'kinesthetic']" 
        @click="setStyle(style)"
        :label="style"
      />
    </div>
  </div>
</template>

<script setup>
import { useUSMLEStore } from '@/stores/usmle';

const usmleStore = useUSMLEStore();
const setStyle = (style) => usmleStore.setLearningStyle(style);
</script>