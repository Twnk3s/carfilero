// src/firebase/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Verifică dacă variabilele de mediu sunt încărcate
// console.log("Firebase API Key:", process.env.REACT_APP_FIREBASE_API_KEY);

// Configurația Firebase preluată din variabilele de mediu
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID
};

// Verifică dacă toate cheile sunt prezente (pentru depanare)
if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
  console.error("Firebase config values are missing. Check your .env file and ensure it's loaded correctly.");
  // Poți arunca o eroare sau afișa un mesaj utilizatorului aici
}

// Inițializează aplicația Firebase
const app = initializeApp(firebaseConfig);

// Obține instanțele serviciilor necesare
const auth = getAuth(app); // Serviciul de autentificare
const db = getFirestore(app); // Serviciul Firestore (baza de date)
const googleProvider = new GoogleAuthProvider(); // Providerul Google pentru login

// Exportă instanțele pentru a le folosi în alte părți ale aplicației
export { auth, db, googleProvider };