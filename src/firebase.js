// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAy9k4fPELPm9pO3RYDC9TcVX6XvgbwRxk",
  authDomain: "crud-react-712b2.firebaseapp.com",
  projectId: "crud-react-712b2",
  storageBucket: "crud-react-712b2.appspot.com",
  messagingSenderId: "520803427372",
  appId: "1:520803427372:web:8b4b298e51b75cd5bc5d89",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore();
const auth = getAuth();

export { db, auth };
