import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCMeuyqTIa7TP9ttguzywxWewEimmdtPZo",
  authDomain: "sosc-6611f.firebaseapp.com",
  projectId: "sosc-6611f",
  storageBucket: "sosc-6611f.firebasestorage.app",
  messagingSenderId: "634750963220",
  appId: "1:634750963220:web:e91b565c8707db32dce101"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
