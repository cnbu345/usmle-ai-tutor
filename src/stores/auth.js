import { defineStore } from 'pinia'
import { 
  auth,
  googleProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged
} from '../firebase'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    loading: false,
    error: null
  }),
  actions: {
    // Email/password login
    async emailLogin(email, password) {
      this.loading = true
      this.error = null
      try {
        await signInWithEmailAndPassword(auth, email, password)
      } catch (err) {
        this.error = this.mapAuthError(err.code)
      } finally {
        this.loading = false
      }
    },

    // Google login
    async googleLogin() {
      this.loading = true
      try {
        await signInWithPopup(auth, googleProvider)
      } catch (err) {
        this.error = this.mapAuthError(err.code)
      } finally {
        this.loading = false
      }
    },

    // Logout
    async logout() {
      await signOut(auth)
    },

    // Auth state listener
    initAuthListener() {
      onAuthStateChanged(auth, (user) => {
        this.user = user
        if (user) {
          // Optional: Sync user data to Firestore
          console.log('User logged in:', user.email)
        }
      })
    },

    // Error mapper
    mapAuthError(code) {
      const errors = {
        'auth/invalid-credential': 'Invalid email or password',
        'auth/too-many-requests': 'Account temporarily locked - try again later',
        'auth/popup-closed-by-user': 'Google sign-in was cancelled'
      }
      return errors[code] || 'Login failed. Please try again.'
    }
  }
})