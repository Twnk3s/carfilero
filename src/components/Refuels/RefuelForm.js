// src/components/Refuels/RefuelForm.js
import React, { useState, useEffect } from 'react';
import InputField from '../Shared/InputField';
import Button from '../Shared/Button';
import LoadingSpinner from '../Shared/LoadingSpinner';

/**
 * Formular pentru adăugarea sau editarea unei înregistrări de alimentare.
 * @param {object|null} initialData - Datele alimentării pentru editare, null pentru adăugare.
 * @param {function} onSave - Funcția apelată la salvare. Primește datele { date, liters, amount, mileage }.
 * @param {function} onCancel - Funcția apelată la anulare.
 * @param {boolean} [isSaving=false] - Indicator de stare pentru salvare.
 */
const RefuelForm = ({ initialData, onSave, onCancel, isSaving = false }) => {
  const [formData, setFormData] = useState({
    date: '',    // Data alimentării (YYYY-MM-DD)
    liters: '',  // Litri alimentați
    amount: '',  // Suma plătită (RON)
    mileage: '', // Kilometraj la momentul alimentării
  });
  const [errors, setErrors] = useState({});

  // Populează formularul la intrarea în modul Editare
  useEffect(() => {
    if (initialData) {
      setFormData({
        // Formatăm data pentru input type="date" dacă vine ca Timestamp
        date: initialData.date?.toDate ? initialData.date.toDate().toISOString().split('T')[0] : initialData.date || '',
        liters: initialData.liters?.toString() ?? '',
        amount: initialData.amount?.toString() ?? '',
        mileage: initialData.mileage?.toString() ?? '',
      });
    } else {
      // Resetează la valori default pentru modul Adăugare
      setFormData({ date: '', liters: '', amount: '', mileage: '' });
    }
    setErrors({}); // Resetează erorile
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
    if (!formData.date) newErrors.date = 'Data este obligatorie.';

    if (!formData.liters || isNaN(Number(formData.liters)) || Number(formData.liters) <= 0) {
      newErrors.liters = 'Numărul de litri trebuie să fie pozitiv.';
    }
    if (!formData.amount || isNaN(Number(formData.amount)) || Number(formData.amount) <= 0) {
      newErrors.amount = 'Suma trebuie să fie un număr pozitiv.';
    }
     if (!formData.mileage || isNaN(Number(formData.mileage)) || Number(formData.mileage) < 0) {
        // Permitem 0, dar nu negativ
      newErrors.mileage = 'Kilometrajul trebuie să fie un număr valid (>= 0).';
    }
    // TODO (Opțional): Adaugă validare ca mileage să fie >= decât mileage-ul ultimei alimentări/cheltuieli

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      // Trimitem datele procesate (numere)
      const dataToSave = {
        date: formData.date,
        liters: parseFloat(formData.liters),
        amount: parseFloat(formData.amount),
        mileage: parseInt(formData.mileage, 10), // Kilometrajul e de obicei întreg
      };
      onSave(dataToSave);
    } else {
      console.warn("RefuelForm validation failed:", errors);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="grid grid-cols-1 gap-y-4 sm:grid-cols-2 sm:gap-x-6">
        {/* Data */}
        <InputField
          label="Data Alimentare" id="date" name="date" type="date"
          value={formData.date} onChange={handleChange}
          required error={errors.date}
          inputClassName="appearance-none"
          className="sm:col-span-1"
        />

        {/* Kilometraj */}
        <InputField
          label="Kilometraj" id="mileage" name="mileage" type="number"
          value={formData.mileage} onChange={handleChange}
          placeholder="Ex: 150500" required error={errors.mileage}
          inputProps={{ min: "0", step: "1" }}
          className="sm:col-span-1"
        />

        {/* Litri */}
        <InputField
          label="Litri Alimentați" id="liters" name="liters" type="number"
          value={formData.liters} onChange={handleChange}
          placeholder="Ex: 45.5" required error={errors.liters}
          inputProps={{ step: "0.01", min: "0.01" }}
          className="sm:col-span-1"
        />

        {/* Suma */}
        <InputField
          label="Sumă Plătită (RON)" id="amount" name="amount" type="number"
          value={formData.amount} onChange={handleChange}
          placeholder="Ex: 300.50" required error={errors.amount}
          inputProps={{ step: "0.01", min: "0.01" }}
          className="sm:col-span-1"
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
            {initialData ? 'Actualizează Alimentarea' : 'Adaugă Alimentarea'}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default RefuelForm;