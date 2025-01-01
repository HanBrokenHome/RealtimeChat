// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getAuth, GoogleAuthProvider} from 'firebase/auth'
import {getFirestore} from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCXWMhJqtkUONzGAn7hXdT-kAcxEDGq3xE",
  authDomain: "firechat-d39e6.firebaseapp.com",
  projectId: "firechat-d39e6",
  storageBucket: "firechat-d39e6.firebasestorage.app",
  messagingSenderId: "562871375443",
  appId: "1:562871375443:web:81872e743fc2da6f3c58a6",
  measurementId: "G-F3PHBYL9CZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const GoogleAuth = new GoogleAuthProvider();
export const db = getFirestore(app)