import { defineStore } from 'pinia';
import { auth } from '../composables/useFirebase';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
  }),
  actions: {
    async login(email, password) {
      const res = await signInWithEmailAndPassword(auth, email, password);
      this.user = res.user;
    },
    async logout() {
      await signOut(auth);
      this.user = null;
    }
  }
});