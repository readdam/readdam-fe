import { initializeApp } from "firebase/app";
import { getMessaging, onMessage  } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyCNv23_6gEsgfJ2IBapbtEXEneFEcqSqqc",
  authDomain: "readdam-3d9c0.firebaseapp.com",
  projectId: "readdam-3d9c0",
  storageBucket: "readdam-3d9c0.firebasestorage.app",
  messagingSenderId: "552261318486",
  appId: "1:552261318486:web:09cec7786bb8d4831088f7",
  measurementId: "G-MXY3VJNG38"
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

export { messaging, onMessage };