<template>
  <Card class="w-full max-w-md">
    <template #title>USMLE AI Tutor Login</template>
    <template #content>
      <form @submit.prevent="handleEmailLogin">
        <div class="flex flex-col gap-3">
          <InputText 
            v-model="email" 
            placeholder="Email" 
            type="email"
            required
          />
          <Password 
            v-model="password" 
            placeholder="Password" 
            :feedback="false"
            required
          />
          <Button 
            type="submit" 
            label="Login" 
            :loading="authStore.loading"
          />
          <Divider />
          <Button 
            label="Continue with Google" 
            icon="pi pi-google"
            @click="authStore.googleLogin()"
          />
        </div>
      </form>
      
      <Message v-if="authStore.error" severity="error" class="mt-3">
        {{ authStore.error }}
      </Message>
    </template>
  </Card>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '../stores/auth'
import Button from 'primevue/button'
import Card from 'primevue/card'
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import Divider from 'primevue/divider'
import Message from 'primevue/message'

const email = ref('')
const password = ref('')
const authStore = useAuthStore()

const handleEmailLogin = () => {
  authStore.emailLogin(email.value, password.value)
}
</script>

<style scoped>
.login-card {
  max-width: 400px;
  margin: 2rem auto;
}
</style>