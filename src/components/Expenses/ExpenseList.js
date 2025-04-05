// src/components/Expenses/ExpenseList.js
import React, { useState, useEffect, useCallback } from 'react';
import { getExpenses, addExpense, updateExpense, deleteExpense } from '../../firebase/firestoreService';
import LoadingSpinner from '../Shared/LoadingSpinner';
import Button from '../Shared/Button';
import Modal from '../Shared/Modal';
import ExpenseForm from './ExpenseForm';
import ExpenseItem from './ExpenseItem';

/**
 * Componentă pentru afișarea și gestionarea listei de cheltuieli pentru o mașină.
 * @param {string} carId - ID-ul mașinii curente.
 * @param {string} userId - ID-ul utilizatorului curent.
 */
const ExpenseList = ({ carId, userId }) => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Stări pentru modalul de adăugare/editare cheltuială
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null); // null = Add, object = Edit
  const [isSaving, setIsSaving] = useState(false);

  // Funcția de preluare cheltuieli
  const fetchExpenses = useCallback(async () => {
    if (!userId || !carId) return;
    setLoading(true);
    setError(null);
    try {
      const fetchedExpenses = await getExpenses(userId, carId);
      setExpenses(fetchedExpenses);
    } catch (err) {
      console.error("Error fetching expenses:", err);
      setError("Nu am putut încărca cheltuielile.");
    } finally {
      setLoading(false);
    }
  }, [userId, carId]);

  // Efect pentru preluare la montare sau schimbare ID-uri
  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  // Handlere Modal Cheltuieli
  const handleAddExpenseClick = () => {
    setEditingExpense(null);
    setIsModalOpen(true);
    setError(null); // Resetează erorile la deschidere
  };

  const handleEditExpenseClick = (expense) => {
    setEditingExpense(expense);
    setIsModalOpen(true);
    setError(null);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingExpense(null);
    setIsSaving(false);
    // Nu resetăm eroarea generală aici
  };

  // Salvare (Add/Update) Cheltuială
  const handleSaveExpense = async (formData) => {
    setIsSaving(true);
    setError(null);
    try {
      if (editingExpense) {
        // Update
        await updateExpense(userId, carId, editingExpense.id, formData);
        setExpenses(prev => prev.map(exp =>
          exp.id === editingExpense.id ? { ...exp, ...formData } : exp
        ));
      } else {
        // Add
        const docRef = await addExpense(userId, carId, formData);
        const newExpense = { ...formData, id: docRef.id, createdAt: new Date(), updatedAt: new Date() };
        // Adaugă la listă (sau re-fetch pentru sortare corectă pe server)
         setExpenses(prev => [newExpense, ...prev].sort((a, b) => new Date(b.date) - new Date(a.date))); // Sortare după dată desc
         // Alternativ: fetchExpenses(); // Simplu, dar mai lent
      }
      handleCloseModal();
    } catch (err) {
      console.error("Error saving expense:", err);
      setError(`Salvarea a eșuat: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  // Ștergere Cheltuială
  const handleDeleteExpense = async (expenseId) => {
    if (window.confirm("Ești sigur că vrei să ștergi această cheltuială?")) {
      setError(null); // Resetează eroarea
      // Poți adăuga o stare de încărcare specifică pentru item (mai avansat)
      try {
        await deleteExpense(userId, carId, expenseId);
        setExpenses(prev => prev.filter(exp => exp.id !== expenseId));
      } catch (err) {
        console.error("Error deleting expense:", err);
        setError(`Ștergerea a eșuat: ${err.message}`);
      }
    }
  };

  // --- Redare Listă ---
  const renderContent = () => {
    if (loading) {
      return <div className="flex justify-center p-4"><LoadingSpinner /></div>;
    }
    // Afișăm eroarea de fetch deasupra listei
    if (error && expenses.length === 0) {
         return <p className="text-center text-red-600 p-4">{error}</p>;
    }
    if (expenses.length === 0) {
      return <p className="text-center text-gray-500 p-4">Nicio cheltuială înregistrată.</p>;
    }
    return (
      <div className="space-y-1">
        {expenses.map(expense => (
          <ExpenseItem
            key={expense.id}
            expense={expense}
            onEdit={handleEditExpenseClick}
            onDelete={handleDeleteExpense}
          />
        ))}
      </div>
    );
  };

  return (
    <div>
       {/* Afișăm eroarea de salvare/ștergere deasupra listei, dacă nu e eroare de fetch */}
       {error && !loading && expenses.length > 0 && (
           <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded relative mb-3 text-sm" role="alert">
              {error}
           </div>
       )}

      {/* Butonul de Adăugare */}
      <div className="text-right mb-4">
        <Button onClick={handleAddExpenseClick} variant="primary" size="sm">
          Adaugă Cheltuială
        </Button>
      </div>

      {/* Lista sau Mesajele */}
      <div className="border border-gray-200 rounded-md">
        {renderContent()}
      </div>

      {/* Modal pentru Formular */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingExpense ? "Editare Cheltuială" : "Adăugare Cheltuială Nouă"}
        widthClass="max-w-lg" // Modal mai mic pentru cheltuieli
      >
         {/* Eroare specifică în modal */}
         {error && isModalOpen && (
             <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded relative mb-4 text-sm" role="alert">
                <span className="block sm:inline">{error}</span>
             </div>
          )}
        <ExpenseForm
          initialData={editingExpense}
          onSave={handleSaveExpense}
          onCancel={handleCloseModal}
          isSaving={isSaving}
        />
      </Modal>
    </div>
  );
};

export default ExpenseList;