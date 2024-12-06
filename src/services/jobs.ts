import { 
  collection, 
  addDoc, 
  deleteDoc, 
  doc, 
  getDocs, 
  query, 
  where,
  updateDoc,
  serverTimestamp,
  type QueryDocumentSnapshot,
  getDoc
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import type { Job, SavedJob } from '../types';

const COLLECTION_NAME = 'saved_jobs';

export async function isJobSaved(jobId: string, userId: string): Promise<boolean> {
  const q = query(
    collection(db, COLLECTION_NAME),
    where('originalJobId', '==', jobId),
    where('userId', '==', userId)
  );
  
  const snapshot = await getDocs(q);
  return !snapshot.empty;
}

export async function saveJob(job: Job, userId: string): Promise<string> {
  // Check if job is already saved
  const alreadySaved = await isJobSaved(job.id, userId);
  if (alreadySaved) {
    throw new Error('Job already saved');
  }

  const docRef = await addDoc(collection(db, COLLECTION_NAME), {
    ...job,
    originalJobId: job.id, // Store original job ID
    userId,
    savedAt: serverTimestamp(),
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function removeJob(jobId: string): Promise<void> {
  await deleteDoc(doc(db, COLLECTION_NAME, jobId));
}

export async function getSavedJobs(userId: string): Promise<SavedJob[]> {
  const q = query(
    collection(db, COLLECTION_NAME), 
    where('userId', '==', userId)
  );
  
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc: QueryDocumentSnapshot) => ({
    ...doc.data(),
    id: doc.id,
    savedAt: doc.data().savedAt?.toDate().toISOString(),
    appliedAt: doc.data().appliedAt?.toDate()?.toISOString(),
  })) as SavedJob[];
}

export async function markJobAsApplied(jobId: string): Promise<void> {
  await updateDoc(doc(db, COLLECTION_NAME, jobId), {
    appliedAt: serverTimestamp(),
  });
}

export async function markJobAsNotApplied(jobId: string): Promise<void> {
  await updateDoc(doc(db, COLLECTION_NAME, jobId), {
    appliedAt: null,
  });
}