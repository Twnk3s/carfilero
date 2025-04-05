// src/firebase/auth.js
import { signInWithPopup, signOut, GoogleAuthProvider } from 'firebase/auth'; // Asigură-te că imporți și GoogleAuthProvider aici
import { auth, googleProvider } from './firebaseConfig'; // Importă auth și provider-ul din config

/**
 * Inițiază procesul de autentificare cu Google folosind un popup.
 * @returns {Promise<import('firebase/auth').UserCredential>} Rezultatul autentificării care conține informații despre user.
 * @throws {Error} Aruncă eroare dacă autentificarea eșuează (ex: popup închis, eroare rețea etc.).
 */
export const signInWithGoogle = async () => {
  try {
    // Setează parametri adiționali dacă e necesar (ex: selectarea contului)
    // googleProvider.setCustomParameters({ prompt: 'select_account' });

    console.log("Attempting Google Sign-In...");
    // Așteaptă rezultatul popup-ului de autentificare
    const result = await signInWithPopup(auth, googleProvider);

    // Autentificare reușită! Firebase gestionează automat starea internă.
    // Obiectul `user` este acum disponibil prin onAuthStateChanged (din AuthContext).
    const user = result.user;
    console.log("Google Sign-In successful for:", user.displayName || user.email, `(UID: ${user.uid})`);

    // Poți opțional să salvezi/actualizezi informații despre user în Firestore aici,
    // de exemplu, ultima dată de login, dar nu este necesar pentru funcționalitatea de bază.

    return result; // Returnează rezultatul complet dacă e necesar în altă parte

  } catch (error) {
    // Gestionează erorile comune
    if (error.code === 'auth/popup-closed-by-user') {
      console.warn("Google Sign-In popup closed by user.");
    } else if (error.code === 'auth/cancelled-popup-request') {
      console.warn("Multiple Google Sign-In popups opened. Request cancelled.");
    } else {
      console.error("Error during Google Sign-In:", error.code, error.message);
    }
    // Aruncă eroarea pentru a putea fi prinsă și gestionată în UI, dacă e necesar
    throw error;
  }
};

/**
 * Deconectează utilizatorul curent din Firebase.
 * @returns {Promise<void>} Se rezolvă când deconectarea este completă.
 * @throws {Error} Aruncă eroare dacă deconectarea eșuează.
 */
export const logout = async () => {
  try {
    console.log("Attempting Sign Out...");
    await signOut(auth); // Funcția Firebase pentru logout
    console.log("User signed out successfully.");
  } catch (error) {
    console.error("Error signing out:", error.code, error.message);
    throw error;
  }
};