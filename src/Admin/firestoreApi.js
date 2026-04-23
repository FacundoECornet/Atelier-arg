import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
} from 'firebase/firestore';
import { db } from '../Firebase';

export async function listAll(collectionName) {
  const snap = await getDocs(collection(db, collectionName));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
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
