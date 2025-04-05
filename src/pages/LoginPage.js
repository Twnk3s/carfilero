// src/pages/LoginPage.js
import React from 'react';
import LoginButton from '../components/Auth/LoginButton'; // Butonul de login existent

const LoginPage = () => {
  return (
    // Container principal - Ocupă tot ecranul, centrează conținutul, fundal gradient bogat
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-tr from-gray-900 via-indigo-900 to-purple-900 p-4 text-white">

      {/* Cardul principal - Alb, rotunjit, umbră pronunțată, spațiere generoasă */}
      <div className="bg-white text-gray-800 p-10 sm:p-12 rounded-xl shadow-2xl text-center max-w-md w-full mb-8
                     transform transition-all duration-500 ease-in-out hover:shadow-3xl hover:-translate-y-1">

        {/* Logo/Titlu - Iconiță mașină + text cu gradient */}
        <div className="flex items-center justify-center mb-5 space-x-3">
          {/* Poți înlocui emoji-ul cu un SVG logo dacă ai unul */}
          <span role="img" aria-label="car emoji" className="text-5xl drop-shadow-md">🚗</span>
          <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 filter hover:brightness-110 transition duration-300">
            CarFile
          </h1>
        </div>

        {/* Slogan / Tagline - Mai descriptiv */}
        <p className="text-lg text-gray-600 mb-10">
          Gestionează inteligent toate datele mașinii tale. Simplu și eficient.
        </p>

        {/* Butonul de Login */}
        <div className="mb-8"> {/* Spațiu sub buton */}
            <LoginButton />
        </div>

        {/* Text suplimentar */}
        <p className="text-xs text-gray-400">
          Folosește contul tău Google pentru acces rapid și securizat.
        </p>

      </div>

      {/* Footer - Culoare adaptată fundalului */}
      <footer className="text-center text-gray-400 text-xs">
        © {new Date().getFullYear()} CarFile. Creat cu pasiune pentru șoferi.
      </footer>
    </div>
  );
};

export default LoginPage;