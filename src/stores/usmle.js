import { defineStore } from 'pinia';
import { db } from '../composables/useFirebase';
import { doc, getDoc } from 'firebase/firestore';

export const useUSMLEStore = defineStore('usmle', {
  state: () => ({
    currentModule: null,
    learningStyle: 'visual' // Default
  }),
  actions: {
    async fetchModule(moduleId) {
      const docRef = doc(db, 'modules', moduleId);
      const docSnap = await getDoc(docRef);
      this.currentModule = docSnap.data();
    },
    setLearningStyle(style) {
      this.learningStyle = style;
    }
  }
});