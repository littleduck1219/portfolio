// Import the functions you need from the SDKs you need
import { FirebaseApp, getApp, initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "@firebase/auth";

export let app: FirebaseApp;

const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_ID,
  measurementId: process.env.REACT_APP_MEASUREMENT_ID,
};

// Initialize Firebase
try {
  app = getApp("app");
} catch (error) {
  app = initializeApp(firebaseConfig, "app");
}

export const firebase = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
// export const analytics = getAnalytics(app);

export const auth = getAuth();
