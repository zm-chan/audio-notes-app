import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAhxUlRq18KYPwdszrz_JxsHxH0iC1mqWs",
  authDomain: "audio-notes-app.firebaseapp.com",
  projectId: "audio-notes-app",
  storageBucket: "audio-notes-app.appspot.com",
  messagingSenderId: "111078587487",
  appId: "1:111078587487:web:91d14194d4010dfdc12fea",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage();
