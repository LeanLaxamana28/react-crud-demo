// Import only what you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyA5-wYdqfNFSNynQN9PomaafP7jqmitcJA",
  authDomain: "react-crud-demo-7f8a1.firebaseapp.com",
  projectId: "react-crud-demo-7f8a1",
  storageBucket: "react-crud-demo-7f8a1.firebasestorage.app",
  messagingSenderId: "476915563514",
  appId: "1:476915563514:web:9b1f1c293fd754310243"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Auth and Firestore
export const auth = getAuth(app);
export const db = getFirestore(app);
