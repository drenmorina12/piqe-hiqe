// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAtbV_kbZsxHKDWWQjijXQhplnZLa6mBoY",
  authDomain: "piqe-hiqe.firebaseapp.com",
  projectId: "piqe-hiqe",
  storageBucket: "piqe-hiqe.firebasestorage.app",
  messagingSenderId: "933922632992",
  appId: "1:933922632992:web:3de5d5731edbb8e3f79345"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
export { auth };
export const db = getFirestore(app);

