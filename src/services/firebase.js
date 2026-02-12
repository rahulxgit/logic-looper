import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBXIonQGdNZ7hnxbJ8HQ0tarRRbGDouNZY",
  authDomain: "logic-looper-6e94a.firebaseapp.com",
  projectId: "logic-looper-6e94a",
  storageBucket: "logic-looper-6e94a.firebasestorage.app",
  messagingSenderId: "412914030898",
  appId: "1:412914030898:web:2f59fc36fe8f2cb6959f2b",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
