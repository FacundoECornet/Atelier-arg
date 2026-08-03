// ONE-TIME MIGRATION — assigns 'fechaIngreso' to all propiedades docs that lack it.
//
// Why: usePropiedades.js queries orderBy('fechaIngreso', 'desc'). Firestore orderBy
// EXCLUDES documents where the field is absent — without backfill, properties would
// disappear from the public listing after the sort change.
//
// Run once (Node 22+ --env-file loads .env into process.env):
//   node --env-file=.env scripts/backfill-fechaIngreso.mjs
//
// Required env vars in .env:
//   VITE_FIREBASE_API_KEY, VITE_FIREBASE_AUTH_DOMAIN, VITE_FIREBASE_PROJECT_ID,
//   VITE_FIREBASE_STORAGE_BUCKET, VITE_FIREBASE_MESSAGING_SENDER_ID, VITE_FIREBASE_APP_ID
//   VITE_ADMIN_EMAIL, VITE_ADMIN_PASSWORD  (valid admin credentials for signIn)
//
// Note: Firestore security rules (Phase 2) enforce `allow write: if request.auth != null`.
// The script signs in with admin credentials BEFORE writing via updateDoc.
//
// This script initializes Firebase directly from process.env — it does NOT import
// ../src/Firebase.js (that file uses Vite-specific import.meta.env, undefined in Node ESM).

import { initializeApp } from 'firebase/app'
import { getFirestore, collection, getDocs, doc, updateDoc } from 'firebase/firestore'
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'

const REQUIRED_ENV = [
  'VITE_FIREBASE_API_KEY',
  'VITE_FIREBASE_AUTH_DOMAIN',
  'VITE_FIREBASE_PROJECT_ID',
  'VITE_FIREBASE_STORAGE_BUCKET',
  'VITE_FIREBASE_MESSAGING_SENDER_ID',
  'VITE_FIREBASE_APP_ID',
  'VITE_ADMIN_EMAIL',
  'VITE_ADMIN_PASSWORD',
]

function assertEnv() {
  const missing = REQUIRED_ENV.filter((key) => !process.env[key])
  if (missing.length > 0) {
    console.error(`Missing required environment variables: ${missing.join(', ')}`)
    console.error('Ensure .env contains Firebase config vars AND VITE_ADMIN_EMAIL/VITE_ADMIN_PASSWORD with valid admin credentials.')
    console.error('Then run: node --env-file=.env scripts/backfill-fechaIngreso.mjs')
    process.exit(1)
  }
}

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
}

assertEnv()

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)
const auth = getAuth(app)

// Format a JS Date as YYYY-MM-DD (local time)
function formatDate(date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

async function main() {
  // Sign in BEFORE writing — Firestore rules require request.auth != null for writes
  await signInWithEmailAndPassword(auth, process.env.VITE_ADMIN_EMAIL, process.env.VITE_ADMIN_PASSWORD)
  console.log(`Signed in as ${process.env.VITE_ADMIN_EMAIL}`)

  // Query all docs (no orderBy — this is a backfill pass, not a display query)
  const snap = await getDocs(collection(db, 'propiedades'))
  const total = snap.size

  let backfilled = 0
  for (const docSnapshot of snap.docs) {
    const data = docSnapshot.data()
    if (data.fechaIngreso !== undefined && data.fechaIngreso !== null) continue

    let fechaIngreso = '2024-01-01'
    if (docSnapshot.createTime) {
      try {
        fechaIngreso = formatDate(docSnapshot.createTime.toDate())
      } catch {
        // keep fallback
      }
    }

    await updateDoc(doc(db, 'propiedades', docSnapshot.id), { fechaIngreso })
    backfilled += 1
    console.log(`Backfilled ${docSnapshot.id} -> ${fechaIngreso}`)
  }

  console.log(`Summary: ${total} docs checked, ${backfilled} backfilled.`)
  process.exit(0)
}

main().catch((err) => {
  console.error('Error during backfill:', err.code || err.message || err)
  process.exit(1)
})
