// src/components/Shared/InputField.js
import React from 'react';

/**
 * Componentă reutilizabilă pentru un câmp de input standard.
 *
 * @param {string} label - Eticheta afișată deasupra câmpului.
 * @param {string} id - ID-ul unic pentru input și atributul 'htmlFor' al etichetei.
 * @param {string} name - Numele inputului (util pentru submit-ul tradițional, dar bun de avut). Default: id.
 * @param {string} type - Tipul inputului (text, number, email, date, password etc.). Default: 'text'.
 * @param {string|number} value - Valoarea controlată a inputului.
 * @param {function} onChange - Funcția handler pentru schimbarea valorii. Primește evenimentul.
 * @param {string} [placeholder] - Textul placeholder.
 * @param {boolean} [required=false] - Dacă câmpul este obligatoriu (adaugă * la label).
 * @param {string} [className] - Clase Tailwind suplimentare pentru containerul div.
 * @param {string} [inputClassName] - Clase Tailwind suplimentare specifice pentru elementul input.
 * @param {boolean} [disabled=false] - Dacă inputul este dezactivat.
 * @param {string|null} [error] - Mesajul de eroare de afișat sub câmp. Null dacă nu există eroare.
 * @param {object} [inputProps] - Orice alte props native HTML care trebuie pasate direct elementului input (ex: min, max, step pentru type="number").
 */
const InputField = ({
  label,
  id,
  name,
  type = 'text',
  value,
  onChange,
  placeholder = '',
  required = false,
  className = '',
  inputClassName = '',
  disabled = false,
  error = null,
  inputProps = {} // Prop pentru a pasa atribute extra (min, max, step etc.)
}) => {
  return (
    <div className={`mb-4 ${className}`}>
      {/* Eticheta */}
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      {/* Câmpul de Input */}
      <input
        type={type}
        id={id}
        name={name || id} // Folosește name sau id
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required} // Atributul HTML required (util pentru validarea browserului, dar vom face și validare JS)
        disabled={disabled}
        className={`
          mt-1 block w-full px-3 py-2 border rounded-md shadow-sm
          focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm
          transition duration-150 ease-in-out
          ${error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300'}
          ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}
          ${inputClassName}
        `}
        {...inputProps} // Pasează props suplimentare (ex: min, max, step)
      />

      {/* Mesajul de Eroare */}
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
};

export default InputField;