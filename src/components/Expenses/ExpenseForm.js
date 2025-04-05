// src/components/Expenses/ExpenseForm.js
import React, { useState, useEffect } from 'react';
import InputField from '../Shared/InputField';
import TextAreaField from '../Shared/TextAreaField'; // Opțional pentru descriere
import Button from '../Shared/Button';
import LoadingSpinner from '../Shared/LoadingSpinner';

/**
 * Formular pentru adăugarea sau editarea unei cheltuieli.
 * @param {object|null} initialData - Datele cheltuielii pentru editare, null pentru adăugare.
 * @param {function} onSave - Funcția apelată la salvare. Primește datele { amount, type, date, description }.
 * @param {function} onCancel - Funcția apelată la anulare.
 * @param {boolean} [isSaving=false] - Indicator de stare pentru salvare.
 */
const ExpenseForm = ({ initialData, onSave, onCancel, isSaving = false }) => {
  const [formData, setFormData] = useState({
    amount: '', // Suma cheltuielii
    type: '',   // Tipul cheltuielii (ex: Service, RCA, ITP, Combustibil)
    date: '',   // Data cheltuielii (YYYY-MM-DD)
    description: '', // Descriere opțională
  });
  const [errors, setErrors] = useState({});

  // Populează formularul la intrarea în modul Editare
  useEffect(() => {
    if (initialData) {
      setFormData({
        amount: initialData.amount?.toString() ?? '',
        type: initialData.type || '',
        // Formatăm data pentru input type="date" dacă vine ca Timestamp
        date: initialData.date?.toDate ? initialData.date.toDate().toISOString().split('T')[0] : initialData.date || '',
        description: initialData.description || '',
      });
    } else {
      // Resetează la valori default pentru modul Adăugare (sau la prima randare)
      setFormData({ amount: '', type: '', date: '', description: '' });
    }
    setErrors({}); // Resetează erorile la schimbarea modului
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.amount || isNaN(Number(formData.amount)) || Number(formData.amount) <= 0) {
      newErrors.amount = 'Suma trebuie să fie un număr pozitiv.';
    }
    if (!formData.type.trim()) newErrors.type = 'Tipul cheltuielii este obligatoriu.';
    if (!formData.date) newErrors.date = 'Data este obligatorie.';
    // Descrierea este opțională

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
        // Trimitem datele procesate (suma ca număr)
        const dataToSave = {
            ...formData,
            amount: parseFloat(formData.amount) // Asigurăm că e număr
        };
      onSave(dataToSave);
    } else {
      console.warn("ExpenseForm validation failed:", errors);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="grid grid-cols-1 gap-y-4 sm:grid-cols-2 sm:gap-x-6">
        {/* Suma */}
        <InputField
          label="Sumă (RON)" id="amount" name="amount" type="number"
          value={formData.amount} onChange={handleChange}
          required error={errors.amount}
          inputProps={{ step: "0.01", min: "0.01" }} // Permite zecimale, minim > 0
          className="sm:col-span-1"
        />

        {/* Data */}
        <InputField
          label="Data" id="date" name="date" type="date"
          value={formData.date} onChange={handleChange}
          required error={errors.date}
          inputClassName="appearance-none" // Stilare browser date input
          className="sm:col-span-1"
        />

        {/* Tipul - Input simplu pentru MVP */}
        <InputField
          label="Tip Cheltuială" id="type" name="type"
          value={formData.type} onChange={handleChange}
          placeholder="Ex: Revizie, RCA, Anvelope, Parcare"
          required error={errors.type}
          className="sm:col-span-2" // Ocupă toată lățimea
          // Alternativă: Folosește SelectField dacă ai tipuri predefinite
        />

        {/* Descriere - TextArea */}
        <TextAreaField
          label="Descriere (Opțional)" id="description" name="description"
          value={formData.description} onChange={handleChange}
          rows={3} placeholder="Detalii suplimentare despre cheltuială..."
          error={errors.description}
          className="sm:col-span-2" // Ocupă toată lățimea
        />
      </div>

      {/* Butoane Acțiune */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex justify-end space-x-3">
          <Button type="button" variant="outline" onClick={onCancel} disabled={isSaving}>
            Anulează
          </Button>
          <Button type="submit" variant="primary" disabled={isSaving}>
            {isSaving && <LoadingSpinner size="w-4 h-4 mr-2 border-t-white" />}
            {initialData ? 'Actualizează Cheltuiala' : 'Adaugă Cheltuiala'}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default ExpenseForm;