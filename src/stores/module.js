import { defineStore } from 'pinia'
import { 
  db, 
  doc, 
  getDoc, 
  collection, 
  getDocs,
  query,
  where,
  serverTimestamp 
} from 'firebase/firestore'

export const useModuleStore = defineStore('modules', {
  state: () => ({
    currentModule: null,
    allModules: [],
    loading: false,
    error: null
  }),
  getters: {
    // Getter for high-yield modules only
    highYieldModules: (state) => state.allModules.filter(m => m.highYield),
    
    // Getter for modules by NBME frequency
    modulesByNbmeScore: (state) => (minScore) => 
      state.allModules.filter(m => m.nbmeFrequency >= minScore)
  },
  actions: {
    // Fetch single module
    async fetchModule(id) {
      this.loading = true
      this.error = null
      try {
        const docRef = doc(db, "modules", id)
        const docSnap = await getDoc(docRef)
        if (docSnap.exists()) {
          this.currentModule = { id: docSnap.id, ...docSnap.data() }
        } else {
          throw new Error('Module not found')
        }
      } catch (err) {
        this.error = err.message
      } finally {
        this.loading = false
      }
    },

    // Fetch all modules (for browsing)
    async fetchAllModules() {
      this.loading = true
      try {
        const querySnapshot = await getDocs(collection(db, "modules"))
        this.allModules = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
      } catch (err) {
        this.error = "Failed to load modules"
      } finally {
        this.loading = false
      }
    },

    // Fetch modules by learning style (for recommendations)
    async fetchModulesByStyle(style) {
      this.loading = true
      try {
        const q = query(
          collection(db, "modules"),
          where(`learningStyles.${style}`, "==", true)
        )
        const snapshot = await getDocs(q)
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      } finally {
        this.loading = false
      }
    },

    // Update module progress in user profile
    async completeModule(userId, moduleId) {
      const userRef = doc(db, "users", userId)
      await updateDoc(userRef, {
        "progress.completedModules": arrayUnion(moduleId),
        "progress.lastActive": serverTimestamp()
      })
    }
  }
})