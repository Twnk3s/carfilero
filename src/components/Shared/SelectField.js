// src/components/Shared/SelectField.js
import React from 'react';

/**
 * Componentă reutilizabilă pentru un câmp de selecție (dropdown).
 *
 * @param {string} label - Eticheta afișată deasupra câmpului.
 * @param {string} id - ID-ul unic pentru select și atributul 'htmlFor' al etichetei.
 * @param {string} name - Numele selectului. Default: id.
 * @param {string|number} value - Valoarea controlată selectată.
 * @param {function} onChange - Funcția handler pentru schimbarea valorii. Primește evenimentul.
 * @param {Array<{value: string|number, label: string}>} options - Array de obiecte pentru opțiunile din dropdown.
 * @param {string} [placeholder="Selectează..."] - Textul pentru opțiunea goală/default.
 * @param {boolean} [required=false] - Dacă câmpul este obligatoriu.
 * @param {string} [className] - Clase Tailwind suplimentare pentru containerul div.
 * @param {string} [selectClassName] - Clase Tailwind suplimentare specifice pentru elementul select.
 * @param {boolean} [disabled=false] - Dacă selectul este dezactivat.
 * @param {string|null} [error] - Mesajul de eroare de afișat sub câmp.
 */
const SelectField = ({
  label,
  id,
  name,
  value,
  onChange,
  options = [], // Default la array gol
  placeholder = "Selectează...",
  required = false,
  className = '',
  selectClassName = '',
  disabled = false,
  error = null
}) => {
  return (
    <div className={`mb-4 ${className}`}>
      {/* Eticheta */}
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      {/* Câmpul Select */}
      <select
        id={id}
        name={name || id}
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
        className={`
          mt-1 block w-full pl-3 pr-10 py-2 border rounded-md shadow-sm
          text-base focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm
          transition duration-150 ease-in-out
          ${error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300'}
          ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}
          ${selectClassName}
        `}
      >
        {/* Opțiunea Placeholder */}
        <option value="" disabled={required}> {/* Opțiunea goală e disabled dacă field-ul e required */}
          {placeholder}
        </option>
        {/* Opțiunile din Array */}
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      {/* Mesajul de Eroare */}
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
};

export default SelectField;