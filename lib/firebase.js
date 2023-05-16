// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from 'firebase/storage'

// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {
  apiKey: "AIzaSyDc1mRzfVNIEXGZwWIPCCKBIY_iXZr2dQs",
  authDomain: "flow-2384e.firebaseapp.com",
  projectId: "flow-2384e",
  storageBucket: "flow-2384e.appspot.com",
  messagingSenderId: "461783215437",
  appId: "1:461783215437:web:3947a80dc05b2b5fd2db04",
  measurementId: "G-Q1K83XNG9H"
};


// Initialize Firebase

export const app = initializeApp(firebaseConfig);
export const storage = getStorage(app, "gs://flow-2384e.appspot.com");