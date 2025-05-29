import { db } from '@/firebase'
import { collection, doc, setDoc } from 'firebase/firestore'

const seedModules = async () => {
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
      }
    },
    renal_phys: {
      title: "Renal Physiology",
      highYield: true,
      nbmeFrequency: 3.8,
      visual: {
        diagram: "https://storage.googleapis.com/your-bucket/nephron.png",
        description: "Nephron with highlighted glomerulus"
      }
    },
    neuro_anatomy: {
      title: "Neuroanatomy",
      highYield: false,
      nbmeFrequency: 2.5,
      kinesthetic: {
        activity: "Label the brain lobes",
        items: ["Frontal", "Temporal", "Parietal", "Occipital"]
      }
    }
  }

  for (const [id, data] of Object.entries(modules)) {
    await setDoc(doc(db, "modules", id), data)
    console.log(`Seeded ${id}`)
  }
}

seedModules().catch(console.error)