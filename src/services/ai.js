import { doc, setDoc } from 'firebase/firestore';
import { db } from '@/firebase';

export const cacheAiResponse = async (prompt, content) => {
  const hash = generateHash(prompt); // Implement your own hash function
  await setDoc(doc(db, 'ai_cache', hash), {
    prompt,
    content,
    modelUsed: 'gpt-4-turbo',
    createdAt: serverTimestamp(),
    expiresAt: new Date(Date.now() + 86400000) // 24h TTL
  });
};