// src/components/Auth/LoginButton.js
import React, { useState } from 'react';
import { signInWithGoogle } from '../../firebase/auth'; // Importă funcția de sign-in
import LoadingSpinner from '../Shared/LoadingSpinner'; // Importă spinner-ul

// O pictogramă simplă Google SVG (poți folosi o librărie de iconițe dacă preferi)
const GoogleIcon = () => (
  <svg className="w-5 h-5 mr-2" viewBox="0 0 48 48">
    <path fill="#EA4335" d="M24 9.5c3.9 0 6.9 1.6 9 3.6l6.5-6.5C35.3 2.8 30.1 0 24 0 14.5 0 6.5 5.8 2.9 14.2l7.7 6C12.2 13.8 17.6 9.5 24 9.5z"></path>
    <path fill="#4285F4" d="M46.8 24.5c0-1.6-.1-3.2-.4-4.7H24v9.1h12.8c-.6 3-2.2 5.5-4.7 7.2l7.3 5.7c4.3-4 6.8-9.9 6.8-17.3z"></path>
    <path fill="#FBBC05" d="M10.6 28.6c-.5-1.5-.8-3.1-.8-4.8s.3-3.3.8-4.8l-7.7-6C1.2 16.7 0 20.2 0 24s1.2 7.3 2.9 10.6l7.7-6z"></path>
    <path fill="#34A853" d="M24 48c5.8 0 10.8-1.9 14.4-5.2l-7.3-5.7c-1.9 1.3-4.4 2.1-7.1 2.1-6.4 0-11.8-4.3-13.7-10.1l-7.7 6C6.5 42.2 14.5 48 24 48z"></path>
    <path fill="none" d="M0 0h48v48H0z"></path>
  </svg>
);

const LoginButton = () => {
  // Stare locală pentru a gestiona încărcarea în timpul procesului de login
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  // Stare locală pentru a afișa eventuale mesaje de eroare
  const [error, setError] = useState(null);

  // Funcția handler pentru click pe buton
  const handleLogin = async () => {
    setIsLoggingIn(true); // Arată starea de încărcare
    setError(null); // Resetează eroarea anterioară

    try {
      await signInWithGoogle();
      // Nu mai facem nimic aici după succes, deoarece AuthProvider va detecta
      // schimbarea stării și va re-renda App.js pentru a afișa DashboardPage.
      // setIsLoggingIn(false); // Tehnic, nu mai ajunge aici dacă loginul reușește și pagina se schimbă
    } catch (err) {
      // Dacă signInWithGoogle aruncă o eroare, o prindem aici
      console.error("Login failed in component:", err);
      setError("Autentificarea a eșuat. Te rugăm să încerci din nou."); // Mesaj generic pentru user
      setIsLoggingIn(false); // Oprește starea de încărcare
    }
  };

  return (
    <div className="flex flex-col items-center">
      <button
        onClick={handleLogin}
        // Dezactivează butonul în timp ce procesul de login este în desfășurare
        disabled={isLoggingIn}
        className={`
          flex items-center justify-center px-6 py-3 border border-transparent
          text-base font-medium rounded-md shadow-sm text-white
          bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700
          focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
          transition duration-150 ease-in-out
          disabled:opacity-70 disabled:cursor-not-allowed
        `}
      >
        {/* Afișează spinner sau iconița/textul */}
        {isLoggingIn ? (
          <LoadingSpinner size="w-5 h-5 mr-2" color="border-t-white" trackColor='border-gray-300 opacity-25' />
        ) : (
          <GoogleIcon />
        )}
        {isLoggingIn ? 'Conectare...' : 'Continuă cu Google'}
      </button>

      {/* Afișează mesajul de eroare dacă există */}
      {error && (
        <p className="mt-3 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

export default LoginButton;