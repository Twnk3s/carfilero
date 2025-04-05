// src/hooks/useAuth.js
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext'; // Importă contextul creat

/**
 * Hook custom pentru a accesa ușor contextul de autentificare.
 * Oferă o verificare pentru a se asigura că este folosit în interiorul unui AuthProvider.
 * @returns {{ currentUser: import('firebase/auth').User | null, loading: boolean }} Obiectul cu starea autentificării.
 */
export const useAuth = () => {
  const context = useContext(AuthContext);

  // Eroare dacă hook-ul este folosit în afara provider-ului
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context; // Returnează valoarea contextului (currentUser, loading)
};