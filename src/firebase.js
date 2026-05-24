import { initializeApp } from 'firebase/app';
import { getAuth, setPersistence, browserLocalPersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAsWJPYWcwJ5XtnJPOV_PRmL7dyt5eJems",
  authDomain: "goddess-plan.firebaseapp.com",
  projectId: "goddess-plan",
  storageBucket: "goddess-plan.firebasestorage.app",
  messagingSenderId: "225308869833",
  appId: "1:225308869833:web:b5cc454324237a0ec87918",
  measurementId: "G-9GLY2NNQME"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Keep users signed in permanently across page reloads and app restarts
setPersistence(auth, browserLocalPersistence).catch(() => {});
