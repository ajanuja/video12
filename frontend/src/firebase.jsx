// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDcpUl3-RFRElAicUfZgzO0FPItTTPCNxA",
  authDomain: "video-conferencing-8e1b7.firebaseapp.com",
  projectId: "video-conferencing-8e1b7",
  storageBucket: "video-conferencing-8e1b7.appspot.com",
  messagingSenderId: "626640928905",
  appId: "1:626640928905:web:32dd5051641bf20c240658",
  measurementId: "G-RRPFXQBM1H",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const analytics = getAnalytics(app);
const completedMeetings = getFirestore(app);  

export { auth, analytics ,completedMeetings};
