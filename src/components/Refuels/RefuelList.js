// src/components/Refuels/RefuelList.js
import React, { useState, useEffect, useCallback } from 'react';
import { getRefuels, addRefuel, updateRefuel, deleteRefuel } from '../../firebase/firestoreService';
import LoadingSpinner from '../Shared/LoadingSpinner';
import Button from '../Shared/Button';
import Modal from '../Shared/Modal';
import RefuelForm from './RefuelForm';
import RefuelItem from './RefuelItem';

/**
 * Componentă pentru afișarea și gestionarea listei de alimentări pentru o mașină.
 * @param {string} carId - ID-ul mașinii curente.
 * @param {string} userId - ID-ul utilizatorului curent.
 */
const RefuelList = ({ carId, userId }) => {
  const [refuels, setRefuels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Stări pentru modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRefuel, setEditingRefuel] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  // Fetch Refuels
  const fetchRefuels = useCallback(async () => {
    if (!userId || !carId) return;
    setLoading(true); setError(null);
    try {
      const fetchedRefuels = await getRefuels(userId, carId);
      setRefuels(fetchedRefuels);
    } catch (err) { console.error("Error fetching refuels:", err); setError("Nu am putut încărca alimentările."); }
    finally { setLoading(false); }
  }, [userId, carId]);

  useEffect(() => {
    fetchRefuels();
  }, [fetchRefuels]);

  // Handlere Modal
  const handleAddRefuelClick = () => { setEditingRefuel(null); setIsModalOpen(true); setError(null); };
  const handleEditRefuelClick = (refuel) => { setEditingRefuel(refuel); setIsModalOpen(true); setError(null); };
  const handleCloseModal = () => { setIsModalOpen(false); setEditingRefuel(null); setIsSaving(false); };

  // Salvare (Add/Update)
  const handleSaveRefuel = async (formData) => {
    setIsSaving(true); setError(null);
    try {
      if (editingRefuel) {
        await updateRefuel(userId, carId, editingRefuel.id, formData);
        setRefuels(prev => prev.map(ref => ref.id === editingRefuel.id ? { ...ref, ...formData } : ref));
      } else {
        const docRef = await addRefuel(userId, carId, formData);
        const newRefuel = { ...formData, id: docRef.id, createdAt: new Date(), updatedAt: new Date() };
        // Adaugă și sortează din nou după dată
        setRefuels(prev => [newRefuel, ...prev].sort((a, b) => new Date(b.date) - new Date(a.date)));
         // Alternativ: fetchRefuels();
      }
      handleCloseModal();
    } catch (err) { console.error("Error saving refuel:", err); setError(`Salvarea a eșuat: ${err.message}`); }
    finally { setIsSaving(false); }
  };

  // Ștergere
  const handleDeleteRefuel = async (refuelId) => {
    if (window.confirm("Ești sigur că vrei să ștergi această alimentare?")) {
      setError(null);
      try {
        await deleteRefuel(userId, carId, refuelId);
        setRefuels(prev => prev.filter(ref => ref.id !== refuelId));
      } catch (err) { console.error("Error deleting refuel:", err); setError(`Ștergerea a eșuat: ${err.message}`); }
    }
  };

  // Redare Listă
  const renderContent = () => {
    if (loading) return <div className="flex justify-center p-4"><LoadingSpinner /></div>;
    if (error && refuels.length === 0) return <p className="text-center text-red-600 p-4">{error}</p>;
    if (refuels.length === 0) return <p className="text-center text-gray-500 p-4">Nicio alimentare înregistrată.</p>;
    return (
      <div className="space-y-1">
        {refuels.map(refuel => (
          <RefuelItem key={refuel.id} refuel={refuel} onEdit={handleEditRefuelClick} onDelete={handleDeleteRefuel} />
        ))}
      </div>
    );
  };

  return (
    <div>
       {/* Eroare Salvare/Ștergere */}
       {error && !loading && refuels.length > 0 && (
           <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded relative mb-3 text-sm" role="alert">
              {error}
           </div>
       )}
      {/* Buton Adăugare */}
      <div className="text-right mb-4">
        <Button onClick={handleAddRefuelClick} variant="primary" size="sm">
          Adaugă Alimentare
        </Button>
      </div>
      {/* Lista */}
      <div className="border border-gray-200 rounded-md">
        {renderContent()}
      </div>
      {/* Modal */}
      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={editingRefuel ? "Editare Alimentare" : "Adăugare Alimentare Nouă"} widthClass="max-w-lg">
          {/* Eroare în modal */}
         {error && isModalOpen && (
             <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded relative mb-4 text-sm" role="alert">
                <span className="block sm:inline">{error}</span>
             </div>
          )}
        <RefuelForm initialData={editingRefuel} onSave={handleSaveRefuel} onCancel={handleCloseModal} isSaving={isSaving} />
      </Modal>
    </div>
  );
};

export default RefuelList;