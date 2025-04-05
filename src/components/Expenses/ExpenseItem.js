// src/components/Expenses/ExpenseItem.js
import React from 'react';
import Button from '../Shared/Button';

/**
 * Afișează detaliile unei singure cheltuieli într-un rând/item.
 * @param {object} expense - Obiectul cheltuielii { id, amount, type, date, description, createdAt, ... }.
 * @param {function} onEdit - Funcția apelată la click pe Editare. Primește obiectul `expense`.
 * @param {function} onDelete - Funcția apelată la click pe Ștergere. Primește ID-ul `expense.id`.
 */
const ExpenseItem = ({ expense, onEdit, onDelete }) => {
  // Funcții helper locale sau importate pentru formatare
   const formatDate = (dateValue) => {
    if (!dateValue) return 'N/A';
    try {
      const dateObj = dateValue.toDate ? dateValue.toDate() : new Date(dateValue);
       if (isNaN(dateObj.getTime())) {
            if (typeof dateValue === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(dateValue)) {
                const parts = dateValue.split('-');
                return `${parts[2]}.${parts[1]}.${parts[0]}`;
            } return 'Inv.';
        }
      return dateObj.toLocaleDateString('ro-RO', { day: '2-digit', month: '2-digit', year: 'numeric' });
    } catch (e) { return 'Err.'; }
  };

  const formatCurrency = (numValue) => {
    if (numValue === null || numValue === undefined) return 'N/A';
    const number = Number(numValue);
    if (isNaN(number)) return 'Inv.';
    return number.toLocaleString('ro-RO', { style: 'currency', currency: 'RON', minimumFractionDigits: 2 });
  };

  const handleEdit = () => onEdit(expense);
  const handleDelete = () => onDelete(expense.id);

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between py-3 px-2 border-b border-gray-200 last:border-b-0 hover:bg-gray-50">
      {/* Detalii Cheltuială */}
      <div className="flex-1 mb-2 sm:mb-0">
        <div className="flex items-center justify-between sm:justify-start space-x-3">
            <span className="font-semibold text-gray-800 w-24 text-right sm:text-left">{formatCurrency(expense.amount)}</span>
            <span className="text-sm text-gray-600 flex-shrink-0">({formatDate(expense.date)})</span>
        </div>
        <p className="text-sm text-gray-700 mt-1 ml-1 sm:ml-0">{expense.type || 'Tip nespecificat'}</p>
        {expense.description && (
          <p className="text-xs text-gray-500 mt-1 ml-1 sm:ml-0 truncate" title={expense.description}>
            {expense.description}
          </p>
        )}
      </div>

      {/* Butoane Acțiune */}
      <div className="flex space-x-2 flex-shrink-0 self-end sm:self-center">
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

export default ExpenseItem;