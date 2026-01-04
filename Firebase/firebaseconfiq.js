// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD_LI7mGtT9VJkuOB7qUFqI55Z3-dUlAg0",
  authDomain: "productivity-44237.firebaseapp.com",
  projectId: "productivity-44237",
  storageBucket: "productivity-44237.firebasestorage.app",
  messagingSenderId: "1014850549852",
  appId: "1:1014850549852:web:fd754299ee6e4e377e0e99",
  measurementId: "G-7K2F7PK613"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app)