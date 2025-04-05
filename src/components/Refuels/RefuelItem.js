// src/components/Refuels/RefuelItem.js
import React from 'react';
import Button from '../Shared/Button';

/**
 * Afișează detaliile unei singure alimentări.
 * @param {object} refuel - Obiectul alimentării { id, date, liters, amount, mileage, ... }.
 * @param {function} onEdit - Funcția apelată la click pe Editare. Primește obiectul `refuel`.
 * @param {function} onDelete - Funcția apelată la click pe Ștergere. Primește ID-ul `refuel.id`.
 */
const RefuelItem = ({ refuel, onEdit, onDelete }) => {
  // Funcții helper locale sau importate
  const formatDate = (dateValue) => { /* ... aceeași funcție ca în ExpenseItem ... */
    if (!dateValue) return 'N/A'; try { const dateObj = dateValue.toDate ? dateValue.toDate() : new Date(dateValue); if (isNaN(dateObj.getTime())) { if (typeof dateValue === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(dateValue)) { const parts = dateValue.split('-'); return `${parts[2]}.${parts[1]}.${parts[0]}`; } return 'Inv.'; } return dateObj.toLocaleDateString('ro-RO', { day: '2-digit', month: '2-digit', year: 'numeric' }); } catch (e) { return 'Err.'; }
  };
  const formatNumber = (numValue, decimals = 0) => { /* ... funcție similară, permite specificarea zecimalelor ... */
      if (numValue === null || numValue === undefined) return 'N/A'; const number = Number(numValue); if (isNaN(number)) return 'Inv.'; return number.toLocaleString('ro-RO', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
  };
   const formatCurrency = (numValue) => { /* ... aceeași funcție ca în ExpenseItem ... */
     if (numValue === null || numValue === undefined) return 'N/A'; const number = Number(numValue); if (isNaN(number)) return 'Inv.'; return number.toLocaleString('ro-RO', { style: 'currency', currency: 'RON', minimumFractionDigits: 2 });
  };


  const handleEdit = () => onEdit(refuel);
  const handleDelete = () => onDelete(refuel.id);

  // Calcul preț per litru (opțional)
  const pricePerLiter = (refuel.amount && refuel.liters && refuel.liters > 0)
    ? (Number(refuel.amount) / Number(refuel.liters)).toFixed(2)
    : null;

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between py-3 px-2 border-b border-gray-200 last:border-b-0 hover:bg-gray-50">
      {/* Detalii Alimentare */}
      <div className="flex-1 mb-2 sm:mb-0 grid grid-cols-3 sm:grid-cols-4 gap-x-2 text-sm">
        {/* Data */}
        <div className="font-medium text-gray-700">{formatDate(refuel.date)}</div>
        {/* Litri */}
        <div className="text-gray-600 text-right">{formatNumber(refuel.liters, 2)} L</div>
        {/* Suma */}
        <div className="text-gray-600 text-right">{formatCurrency(refuel.amount)}</div>
        {/* Kilometraj */}
        <div className="text-gray-500 text-right col-span-3 sm:col-span-1 mt-1 sm:mt-0">
            @{formatNumber(refuel.mileage)} km
            {pricePerLiter && <span className="ml-2 text-xs text-blue-600">({pricePerLiter} RON/L)</span>}
        </div>
      </div>

      {/* Butoane Acțiune */}
      <div className="flex space-x-2 flex-shrink-0 self-end sm:self-center sm:ml-4">
        <Button onClick={handleEdit} variant="secondary" className="text-xs px-2 py-1">
          Editează
        </Button>
        <Button onClick={handleDelete} variant="danger" className="text-xs px-2 py-1">
          Șterge
        </Button>
      </div>
    </div>
  );
};

export default RefuelItem;