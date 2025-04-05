// src/components/Shared/Notifications/BellIcon.js
import React from 'react';

/**
 * Componenta iconiță clopoțel cu un indicator opțional pentru notificări necitite/active.
 * @param {boolean} hasNotification - Dacă trebuie afișat indicatorul roșu.
 * @param {string} [className='w-6 h-6'] - Clase Tailwind pentru dimensiunea și stilul iconiței SVG.
 */
const BellIcon = ({ hasNotification, className = 'w-6 h-6' }) => {
  return (
    <div className="relative">
      {/* Iconița SVG */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className={className} // Aplică clasa primită pentru dimensiune/stil
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5} // Grosime linie puțin mai subțire
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          // Path-ul pentru clopoțel (poți folosi altul dacă preferi)
          d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"
        />
      </svg>

      {/* Indicatorul Roșu (Dot) - Afișat condiționat */}
      {hasNotification && (
        <span
          className="absolute -top-1 -right-1 block h-2.5 w-2.5 rounded-full ring-2 ring-white bg-red-500 animate-pulse" // Animație puls subtilă
          aria-hidden="true" // Ascunde de screen readere, informația e dată de aria-label pe buton
        />
      )}
    </div>
  );
};

export default BellIcon;