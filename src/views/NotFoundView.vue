<template>
  <div class="not-found">
    <h1>404 - Page Not Found</h1>
    <Button label="Go Home" @click="router.push('/')" />
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()
</script>