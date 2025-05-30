import { initializeApp, cert } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'
import serviceAccount from './serviceAccountKey.json' assert { type: 'json' }

// Initialize Admin SDK
initializeApp({
  credential: cert(serviceAccount)
})

const db = getFirestore()

const seedAllCollections = async () => {
  // ===== MODULES COLLECTION =====
  const modules = {
    cardiac_pharm: {
      title: "Cardiac Pharmacology",
      highYield: true,
      nbmeFrequency: 4.2,
      visual: {
        diagram: "https://storage.googleapis.com/your-bucket/cardiac.png",
        description: "Beta-1 receptor locations in heart tissue"
      },
      auditory: {
        audio: "https://storage.googleapis.com/your-bucket/cardiac.mp3",
        transcript: "Beta blockers act by competitively inhibiting catecholamines..."
      },
      createdAt: new Date().toISOString()
    },
    renal_phys: {
      title: "Renal Physiology",
      highYield: true,
      nbmeFrequency: 3.8,
      visual: {
        diagram: "https://storage.googleapis.com/your-bucket/nephron.png",
        description: "Nephron with highlighted glomerulus"
      },
      createdAt: new Date().toISOString()
    },
    neuro_anatomy: {
      title: "Neuroanatomy",
      highYield: false,
      nbmeFrequency: 2.5,
      kinesthetic: {
        activity: "Label the brain lobes",
        items: ["Frontal", "Temporal", "Parietal", "Occipital"]
      },
      createdAt: new Date().toISOString()
    }
  }

  // ===== USERS COLLECTION =====
  const users = {
    'test_user_1': {
      email: 'test1@usmleai.com',
      learningStyle: 'visual',
      progress: {
        completedModules: ['cardiac_pharm'],
        weakAreas: ['renal_phys'],
        lastActive: new Date().toISOString()
      },
      createdAt: new Date().toISOString()
    }
  }

  // ===== AI_CACHE COLLECTION =====
  const ai_cache = {
    'cardiac_pharm_visual': {
      prompt: "Generate visual content for cardiac pharmacology",
      content: {
        diagram: "https://storage.googleapis.com/.../cardiac.png",
        description: "Beta-1 receptor locations..."
      },
      modelUsed: "gpt-4-turbo",
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 86400000).toISOString() // 24 hours
    }
  }

  // Seed all collections with batch operations
  const collections = [
    { name: 'modules', data: modules },
    { name: 'users', data: users },
    { name: 'ai_cache', data: ai_cache }
  ]

  try {
    // Process each collection
    for (const { name, data } of collections) {
      const batch = db.batch()
      
      // Queue all documents in this collection
      Object.entries(data).forEach(([id, content]) => {
        const docRef = db.collection(name).doc(id)
        batch.set(docRef, content)
        console.log(`Queued ${name}/${id}`)
      })

      // Commit the batch for this collection
      await batch.commit()
      console.log(`✅ Successfully seeded ${name} collection`)
    }
    
    console.log('🎉 All collections seeded successfully!')
    
    // Verification
    const modulesCount = (await db.collection('modules').get()).size
    const usersCount = (await db.collection('users').get()).size
    const aiCacheCount = (await db.collection('ai_cache').get()).size
    console.log(`Verification: Modules=${modulesCount}, Users=${usersCount}, AI Cache=${aiCacheCount}`)
    
  } catch (error) {
    console.error('🔥 Seeding failed:', error)
    process.exit(1)
  }
}

seedAllCollections()