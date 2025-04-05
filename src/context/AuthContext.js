// src/context/AuthContext.js
import React, { createContext, useState, useEffect, useMemo } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase/firebaseConfig'; // Importă instanța auth din config
import LoadingSpinner from '../components/Shared/LoadingSpinner'; // Importă spinner-ul

// 1. Creează Contextul
// Acesta va expune `currentUser` și starea `loading`
export const AuthContext = createContext();

// 2. Creează Provider-ul Componentă
// Această componentă va "îmbrăca" aplicația și va gestiona starea autentificării
export const AuthProvider = ({ children }) => {
  // Stare pentru a stoca obiectul utilizatorului autentificat (sau null)
  const [currentUser, setCurrentUser] = useState(null);
  // Stare pentru a indica dacă verificarea inițială a autentificării s-a încheiat
  const [loading, setLoading] = useState(true);

  // 3. Efect pentru a asculta schimbările de stare ale autentificării Firebase
  useEffect(() => {
    // onAuthStateChanged este un observer Firebase.
    // Se declanșează imediat la încărcare și apoi de fiecare dată când userul se loghează sau deloghează.
    // 'user' va fi obiectul User de la Firebase dacă e logat, sau null dacă nu.
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user); // Actualizează starea locală cu user-ul primit
      setLoading(false); // Marchează că verificarea inițială s-a terminat
      console.log("Auth State Changed:", user ? `User UID: ${user.uid}` : 'No user logged in');
    });

    // 4. Funcția de cleanup
    // Când componenta AuthProvider se demontează (rar, dar posibil),
    // oprim ascultarea pentru a evita memory leaks.
    return () => {
      // console.log("Unsubscribing from Auth State Changes");
      unsubscribe();
    }
  }, []); // Array-ul gol de dependențe asigură rularea efectului doar o dată, la montare

  // 5. Optimizare: Memoizează valoarea contextului
  // Folosim useMemo pentru a ne asigura că obiectul `value` nu este recreat la fiecare render
  // decât dacă `currentUser` sau `loading` se schimbă efectiv.
  // Acest lucru previne re-renderizări inutile ale componentelor consumatoare.
  const value = useMemo(() => ({
     currentUser,
     loading
  }), [currentUser, loading]);

  // 6. Afișează un spinner global cât timp se verifică starea inițială
  // Acest lucru previne afișarea scurtă a paginii de login/dashboard înainte de a ști dacă userul e logat.
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <LoadingSpinner size="w-16 h-16" />
      </div>
    );
  }

  // 7. Oferă valoarea (currentUser, loading) componentelor copil
  // Orice componentă din interiorul <AuthProvider> va putea accesa `value`.
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};