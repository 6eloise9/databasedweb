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
  apiKey: "AIzaSyCqxFnx-Rii5vdGdwrb0D20keWMSf88pJc",
  authDomain: "diappetes-73193.firebaseapp.com",
  projectId: "diappetes-73193",
  storageBucket: "diappetes-73193.appspot.com",
  messagingSenderId: "368319839130",
  appId: "1:368319839130:web:9f5921d9e822542e569823",
  measurementId: "G-H5QVENXHD0"
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
