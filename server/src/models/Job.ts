import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

export interface Job {
  id: string;
  userId: string;
  title: string;
  company: string;
  url: string;

  // AI Analysis fields
  aiAnalysis: string;
  matchScore: number;
  keySkillMatches: string[];

  // Tracking fields
  originalJobId: string;
  createdAt: Date;
  savedAt: Date;
  appliedAt: Date;
}