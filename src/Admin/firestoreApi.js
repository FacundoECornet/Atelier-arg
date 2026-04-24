import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  limit,
  writeBatch,
} from 'firebase/firestore';
import { db } from '../Firebase';

export async function listAll(collectionName) {
  const snap = await getDocs(collection(db, collectionName));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function listAllOrdered(collectionName, field = 'orden', dir = 'desc') {
  const q = query(collection(db, collectionName), orderBy(field, dir));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function getNextOrden(collectionName) {
  const q = query(collection(db, collectionName), orderBy('orden', 'desc'), limit(1));
  const snap = await getDocs(q);
  if (snap.empty) return 1;
  const top = snap.docs[0].data().orden ?? 0;
  return top + 1;
}

export async function bulkUpdateOrden(collectionName, updates) {
  const batch = writeBatch(db);
  updates.forEach(({ id, orden }) => {
    batch.update(doc(db, collectionName, id), { orden });
  });
  await batch.commit();
}

export async function getOne(collectionName, id) {
  const snap = await getDoc(doc(db, collectionName, id));
  if (!snap.exists()) throw new Error('Documento no encontrado');
  return { id: snap.id, ...snap.data() };
}

export async function create(collectionName, data) {
  const ref = await addDoc(collection(db, collectionName), data);
  return ref.id;
}

export async function update(collectionName, id, data) {
  await updateDoc(doc(db, collectionName, id), data);
}

export async function remove(collectionName, id) {
  await deleteDoc(doc(db, collectionName, id));
}
