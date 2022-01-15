// Import the functions you need from the SDKs you need
import firebase from 'firebase/compat/app'
import { initializeApp } from 'firebase/app'
import "firebase/compat/auth"
import "firebase/compat/firestore"

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBWZz5xaHBeqbqp83hIHF-zDUjsOTBIjes",
  authDomain: "dialog-25a7d.firebaseapp.com",
  projectId: "dialog-25a7d",
  storageBucket: "dialog-25a7d.appspot.com",
  messagingSenderId: "90496636938",
  appId: "1:90496636938:web:f32ea9e1ae633d757367f3",
  measurementId: "G-EZQDNBF02G"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);

const auth = app.auth();

const db = app.firestore();


const signInWithEmailAndPassword = async (email, password) => {
  try {
    await auth.signInWithEmailAndPassword(email, password);
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

const logout = () => {
  auth.signOut();
};
export {
  auth,
  db,
  signInWithEmailAndPassword,
  logout,
};
