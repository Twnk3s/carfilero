// src/components/Shared/LoadingSpinner.js
import React from 'react';

/**
 * Un simplu spinner de încărcare realizat cu Tailwind CSS.
 * @param {string} size - Clasa Tailwind pentru dimensiune (ex: 'w-8 h-8'). Default 'w-8 h-8'.
 * @param {string} color - Clasa Tailwind pentru culoarea marginii vizibile (ex: 'border-t-blue-500'). Default 'border-t-blue-500'.
 * @param {string} trackColor - Clasa Tailwind pentru culoarea fundalului spinnerului (ex: 'border-gray-200'). Default 'border-gray-200'.
 * @param {string} className - Clase Tailwind suplimentare.
 */
const LoadingSpinner = ({
  size = 'w-8 h-8',
  color = 'border-t-blue-500',
  trackColor = 'border-gray-200',
  className = ''
}) => {
  return (
    <div
      className={`animate-spin rounded-full border-4 border-t-4 ${trackColor} ${color} ${size} ${className}`}
      role="status" // Accesibilitate: indică faptul că elementul se încarcă
    >
      {/* Screen reader only text */}
      <span className="sr-only">Loading...</span>
    </div>
  );
};

export default LoadingSpinner;