import { defineStore } from 'pinia'
import { 
  auth,
  googleProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged
} from '../firebase'
import { doc, setDoc } from 'firebase/firestore'
import { db } from '../firebase'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    loading: false,
    error: null
  }),
  actions: {
    async emailSignup(email, password) {
      this.loading = true
      this.error = null
      try {
        const { user } = await createUserWithEmailAndPassword(auth, email, password)
        await setDoc(doc(db, "users", user.uid), {
          email,
          learningStyle: null,
          progress: {
            completedModules: [],
            weakAreas: []
          },
          createdAt: new Date().toISOString()
        })
      } catch (err) {
        this.error = this.mapAuthError(err.code)
      } finally {
        this.loading = false
      }
    },

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
          console.log('User logged in:', user.email)
        }
      })
    },

    // Error mapper (updated with signup errors)
    mapAuthError(code) {
      const errors = {
        'auth/invalid-credential': 'Invalid email or password',
        'auth/email-already-in-use': 'Email already exists',
        'auth/weak-password': 'Password should be at least 6 characters',
        'auth/too-many-requests': 'Account temporarily locked - try again later',
        'auth/popup-closed-by-user': 'Google sign-in was cancelled'
      }
      return errors[code] || 'Authentication failed. Please try again.'
    }
  }
})