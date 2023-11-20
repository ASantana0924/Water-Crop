// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase, ref, onValue } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCmzwITTR7afWDNiftj-EIcuLSSqDOz8l8",
  authDomain: "water-crop.firebaseapp.com",
  projectId: "water-crop",
  storageBucket: "water-crop.appspot.com",
  messagingSenderId: "152128044274",
  appId: "1:152128044274:web:81689db4c71684f2e4246b",
  measurementId: "G-JHYJCLSC4Y"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const realtimeDatabase = getDatabase();
export const RTDBRef = ref(realtimeDatabase, 'Plants/');