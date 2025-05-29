<template>
  <Card class="login-card">
    <template #title>Login</template>
    <template #content>
      <div class="flex flex-column gap-3">
        <InputText v-model="email" placeholder="Email" />
        <Password v-model="password" placeholder="Password" />
        <Button label="Login" @click="handleLogin" />
      </div>
    </template>
  </Card>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const email = ref('')
const password = ref('')
const router = useRouter()
const authStore = useAuthStore()

const handleLogin = async () => {
  await authStore.login(email.value, password.value)
  router.push({ name: 'dashboard' })
}
</script>

<style scoped>
.login-card {
  max-width: 400px;
  margin: 2rem auto;
}
</style>