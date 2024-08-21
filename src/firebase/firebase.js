// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyAbq8VX80Ky5knqxDkpcpt0rCkjKmkHzWQ",
  authDomain: "videocall-811cb.firebaseapp.com",
  projectId: "videocall-811cb",
  storageBucket: "videocall-811cb.appspot.com",
  messagingSenderId: "594494177446",
  appId: "1:594494177446:web:aeb82d1574bba42f8d7467"
};

// Initialize Firebase
const appFirebase = initializeApp(firebaseConfig);
const auth = getAuth(appFirebase);
const db = getFirestore(appFirebase);

export { appFirebase, auth,db }