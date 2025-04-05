// src/components/Shared/TextAreaField.js
import React from 'react';

/**
 * Componentă reutilizabilă pentru un câmp textarea.
 *
 * @param {string} label - Eticheta afișată deasupra câmpului.
 * @param {string} id - ID-ul unic pentru textarea și atributul 'htmlFor' al etichetei.
 * @param {string} name - Numele textareei. Default: id.
 * @param {string} value - Valoarea controlată a textareei.
 * @param {function} onChange - Funcția handler pentru schimbarea valorii. Primește evenimentul.
 * @param {string} [placeholder] - Textul placeholder.
 * @param {number} [rows=4] - Numărul de rânduri vizibile inițial.
 * @param {boolean} [required=false] - Dacă câmpul este obligatoriu (nu are efect vizual implicit pe textarea, doar logic).
 * @param {string} [className] - Clase Tailwind suplimentare pentru containerul div.
 * @param {string} [textareaClassName] - Clase Tailwind suplimentare specifice pentru elementul textarea.
 * @param {boolean} [disabled=false] - Dacă textarea este dezactivată.
 * @param {string|null} [error] - Mesajul de eroare de afișat sub câmp.
 */
const TextAreaField = ({
  label,
  id,
  name,
  value,
  onChange,
  placeholder = '',
  rows = 4,
  required = false, // Required logic, no visual cue here by default
  className = '',
  textareaClassName = '',
  disabled = false,
  error = null
}) => {
  return (
    <div className={`mb-4 ${className}`}>
      {/* Eticheta */}
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
        {label} {/* Nu adaugăm '*' automat pentru textarea, e mai puțin standard */}
      </label>

      {/* Câmpul Textarea */}
      <textarea
        id={id}
        name={name || id}
        rows={rows}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        className={`
          mt-1 block w-full px-3 py-2 border rounded-md shadow-sm
          focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm
          transition duration-150 ease-in-out resize-y {/* Permite redimensionare verticală */}
          ${error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300'}
          ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}
          ${textareaClassName}
        `}
      />

      {/* Mesajul de Eroare */}
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
};

export default TextAreaField;