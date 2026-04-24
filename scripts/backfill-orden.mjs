// One-shot migration: assign 'orden' to all propiedades docs that lack it.
// Run once: node scripts/backfill-orden.mjs
// Docs without 'orden' are excluded from orderBy queries in Firestore, so this is required.

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, writeBatch, doc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'REDACTED_API_KEY',
  authDomain: 'atelierhomesarg.firebaseapp.com',
  projectId: 'atelierhomesarg',
  storageBucket: 'atelierhomesarg.appspot.com',
  messagingSenderId: 'REDACTED_ID',
  appId: '1:REDACTED_ID:web:e0d5353bb8715b1c8c4683',
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function main() {
  const snap = await getDocs(collection(db, 'propiedades'));
  const docs = snap.docs.map((d) => ({ id: d.id, ...d.data() }));

  const missing = docs.filter((d) => d.orden === undefined || d.orden === null);
  if (missing.length === 0) {
    console.log('All docs already have "orden". Nothing to do.');
    process.exit(0);
  }

  console.log(`Found ${missing.length} docs without "orden". Assigning...`);

  // Docs with orden already set — find max
  const existing = docs.filter((d) => d.orden !== undefined && d.orden !== null);
  const maxExisting = existing.length > 0 ? Math.max(...existing.map((d) => d.orden)) : 0;

  // Assign orden starting from maxExisting + 1, oldest-first convention
  // (newer uploads will get higher numbers = first in DESC order)
  const batch = writeBatch(db);
  missing.forEach((d, idx) => {
    batch.update(doc(db, 'propiedades', d.id), { orden: maxExisting + idx + 1 });
  });

  await batch.commit();
  console.log(`Done. Assigned orden ${maxExisting + 1} – ${maxExisting + missing.length}.`);
  process.exit(0);
}

main().catch((err) => {
  console.error('Error:', err);
  process.exit(1);
});
