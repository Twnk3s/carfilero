// src/components/Shared/Button.js
import React from 'react';

/**
 * Componentă buton generică stilizată cu Tailwind.
 * @param {node} children - Conținutul butonului (text, iconiță etc.).
 * @param {function} onClick - Funcția de executat la click.
 * @param {string} type - Tipul HTML al butonului ('button', 'submit', 'reset'). Default 'button'.
 * @param {'primary'|'secondary'|'danger'|'outline'|'link'} variant - Stilul vizual al butonului. Default 'primary'.
 * @param {string} className - Clase Tailwind suplimentare.
 * @param {boolean} disabled - Dacă butonul este dezactivat. Default false.
 */
const Button = ({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  className = '',
  disabled = false,
  // Poți adăuga și alte props, ex: title
}) => {
  // Stiluri de bază comune tuturor variantelor
  const baseStyle = `
    inline-flex items-center justify-center px-4 py-2 border border-transparent
    text-sm font-medium rounded-md shadow-sm focus:outline-none
    focus:ring-2 focus:ring-offset-2 transition ease-in-out duration-150
    disabled:opacity-60 disabled:cursor-not-allowed
  `;

  // Stiluri specifice fiecărei variante
  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
    secondary: 'bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
    outline: 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50 focus:ring-indigo-500', // Exemplu de outline
    link: 'text-blue-600 hover:text-blue-800 underline shadow-none p-0 border-none bg-transparent' // Exemplu de link-style
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${baseStyle} ${variants[variant] || variants.primary} ${className}`}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;