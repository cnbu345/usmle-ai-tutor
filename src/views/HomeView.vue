<template>
  <div class="home">
    <Card class="w-full md:w-30rem">
      <template #title>USMLE AI Tutor</template>
      <template #content>
        <p>Personalized learning for visual, auditory, and kinesthetic learners.</p>
        <div class="flex flex-column gap-3 mt-5">
          <Button label="Login" @click="navigateTo('/login')" />
          <Button label="Browse Demo Modules" @click="navigateTo('/modules')" outlined />
        </div>
      </template>
    </Card>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();
const navigateTo = (path) => router.push(path);
</script>

<style scoped>
.home {
  display: flex;
  justify-content: center;
  padding: 2rem;
}
</style>