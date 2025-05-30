import { defineStore } from "pinia";
import { doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { db } from "../firebase";

export const useProfileStore = defineStore('profile', {
  actions: {
    async updateLearningStyle(userId, style) {
      await updateDoc(doc(db, 'users', userId), {
        learningStyle: style,
        'progress.lastActive': serverTimestamp()
      });
    }
  }
});