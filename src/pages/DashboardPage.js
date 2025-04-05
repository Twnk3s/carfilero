// src/pages/DashboardPage.js
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from '../hooks/useAuth';
import { logout } from '../firebase/auth';
// Importăm TOATE funcțiile CRUD pentru mașini
import { getCars, addCar, updateCar, deleteCar } from '../firebase/firestoreService';
import LoadingSpinner from '../components/Shared/LoadingSpinner';
import CarCard from '../components/Cars/CarCard'; // Asigură-te că importezi CarCard actualizat
import Button from '../components/Shared/Button';
import Modal from '../components/Shared/Modal';
import CarForm from '../components/Cars/CarForm';
import { checkDateProximity } from '../utils/dateUtils'; // <- Importă utilitarul
import BellIcon from '../components/Shared/Notifications/BellIcon'; // <- Importă iconița
import NotificationPanel from '../components/Shared/Notifications/NotificationPanel'; // <- Importă panoul

// Componenta DashboardPage (primește onViewCarDetails ca prop)
const DashboardPage = ({ onViewCarDetails }) => {
  const { currentUser } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [logoutError, setLogoutError] = useState(null);
  const [cars, setCars] = useState([]);
  const [loadingCars, setLoadingCars] = useState(true);
  const [carsError, setCarsError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCar, setEditingCar] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  // --- Stări Noi pentru Notificări ---
  const [showNotificationPanel, setShowNotificationPanel] = useState(false);

  // --- Calculare Notificări (cu useMemo) ---
  const activeNotifications = useMemo(() => {
     if (!cars || cars.length === 0) return [];
     const allNotifications = [];
     cars.forEach(car => {
       const carLabel = `${car.marca || 'Mașină'} ${car.model || ''} (${car.numarInmatriculare || 'N/A'})`;
       // Funcție internă pentru a adăuga o notificare dacă este relevantă
       const checkAndAdd = (date, type, labelSingular, labelPlural) => {
            const check = checkDateProximity(date);
             if (check.isRelevant) {
                let verb = check.status === 'expired' ? labelPlural.expirat : labelPlural.expira;
                let timeText = '';
                 if (check.daysRemaining !== null) {
                     timeText = check.daysRemaining < 0 ? `acum ${Math.abs(check.daysRemaining)} zile` : `în ${check.daysRemaining} zile`;
                 }
                 allNotifications.push({
                     id: `${car.id}-${type}`, // ID unic pentru notificare
                     message: `${labelSingular} ${verb} ${timeText} pentru ${carLabel}.`,
                     type: check.status, // 'expired', 'urgent', 'warning'
                     carId: car.id, // ID-ul mașinii pentru navigare
                 });
             }
       };

        // Verifică și adaugă notificări pentru ITP, RCA, Revizie, CASCO
        checkAndAdd(car.dataITP, 'itp', 'ITP', { expirat: 'expirat', expira: 'expiră' });
        checkAndAdd(car.dataRCA, 'rca', 'RCA', { expirat: 'expirat', expira: 'expiră' });
        checkAndAdd(car.dataUrmatoareiRevizii, 'revizie', 'Revizia', { expirat: 'necesară (data estimată a expirat)', expira: 'recomandată' });
        checkAndAdd(car.dataCASCO, 'casco', 'CASCO', { expirat: 'expirat', expira: 'expiră' }); // Verificăm și CASCO
     });

     // Sortează notificările: Expirat > Urgent > Warning
     allNotifications.sort((a, b) => {
         const order = { expired: 1, urgent: 2, warning: 3 };
         return (order[a.type] || 4) - (order[b.type] || 4);
     });
     return allNotifications;
  }, [cars]); // Recalculează când lista de mașini se schimbă

  // --- Efect pentru Închiderea Panoului la Click Exterior ---
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Verifică dacă panoul e deschis și click-ul e în afara elementelor relevante
      if (showNotificationPanel &&
          !event.target.closest('.notification-panel-wrapper') &&
          !event.target.closest('.notification-bell-button')) {
         setShowNotificationPanel(false);
      }
    };
    if (showNotificationPanel) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showNotificationPanel]);

  // --- Funcții CRUD și Handlere (folosind useCallback) ---
  const fetchCars = useCallback(async () => {
    if (!currentUser) { setLoadingCars(false); return; }
    setLoadingCars(true); setCarsError(null);
    try { const userCars = await getCars(currentUser.uid); setCars(userCars); }
    catch (error) { console.error("DashboardPage: Error fetching cars:", error); setCarsError("Nu am putut încărca lista de mașini."); setCars([]); }
    finally { setLoadingCars(false); }
  }, [currentUser]);

  useEffect(() => { fetchCars(); }, [fetchCars]);

  const handleLogout = useCallback(async () => {
    setIsLoggingOut(true); setLogoutError(null);
    try { await logout(); }
    catch (error) { console.error("Logout failed:", error); setLogoutError("Deconectarea a eșuat."); setIsLoggingOut(false); }
  }, []);

  const handleAddCarClick = useCallback(() => { setEditingCar(null); setIsModalOpen(true); setCarsError(null); }, []);
  const handleEditCar = useCallback((car) => { setEditingCar(car); setIsModalOpen(true); setCarsError(null); }, []);
  const handleCloseModal = useCallback(() => { setIsModalOpen(false); setEditingCar(null); setIsSaving(false); }, []);

  const handleSaveCar = useCallback(async (formData) => {
    if (!currentUser) { setCarsError("Eroare: Utilizator neautentificat."); return; }
    setIsSaving(true); setCarsError(null);
    try {
      if (editingCar) {
        await updateCar(currentUser.uid, editingCar.id, formData);
        setCars(prev => prev.map(car => car.id === editingCar.id ? { ...car, ...formData } : car));
      } else {
        const docRef = await addCar(currentUser.uid, formData);
        const newCar = { ...formData, id: docRef.id, createdAt: new Date(), updatedAt: new Date() };
        setCars(prev => [newCar, ...prev]);
      }
      handleCloseModal();
    } catch (error) { console.error("DashboardPage: Error saving car:", error); setCarsError(`Salvarea mașinii a eșuat: ${error.message}`); }
    finally { setIsSaving(false); }
  }, [currentUser, editingCar, handleCloseModal]);

  const handleDeleteCar = useCallback(async (carId) => {
    if (window.confirm(`Ești sigur că vrei să ștergi mașina? Această acțiune este ireversibilă!`)) {
      if (!currentUser) { setCarsError("Eroare: Utilizator neautentificat."); return; }
      setCarsError(null);
      try { await deleteCar(currentUser.uid, carId); setCars(prev => prev.filter(car => car.id !== carId)); }
      catch (error) { console.error("Failed to delete car:", error); setCarsError(`Eroare la ștergerea mașinii (ID: ${carId}). ${error.message}`); }
    }
  }, [currentUser]);

  const handleViewCar = useCallback((car) => {
    console.log("Dashboard: Requesting to view details for car ID:", car.id);
    if (typeof onViewCarDetails === 'function') { onViewCarDetails(car.id); }
    else { console.error("onViewCarDetails prop is not a function or is missing in DashboardPage"); }
  }, [onViewCarDetails]);

  // --- Funcție de redare a listei de mașini ---
    const renderCarList = () => {
       if (loadingCars) return <div className="flex justify-center items-center py-16"><LoadingSpinner size="w-12 h-12" /><p className="ml-4 text-gray-500">Se încarcă mașinile...</p></div>;
       if (carsError && cars.length === 0 && !isModalOpen) return <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 text-center" role="alert"><p className="font-bold">Eroare</p><p>{carsError}</p><Button onClick={fetchCars} variant="danger" className="mt-4">Reîncearcă</Button></div>;
       if (!loadingCars && cars.length === 0) return <div className="text-center text-gray-500 py-16 px-6"> <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}><path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg><h3 className="mt-2 text-lg font-medium text-gray-900">Nicio mașină adăugată</h3><p className="mt-1 text-sm text-gray-500">Începe prin a adăuga prima ta mașină.</p><div className="mt-6"><Button onClick={handleAddCarClick} variant="primary"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" /></svg>Adaugă Prima Mașină</Button></div></div>;

       return (
         <>
           {/* Eroare generală afișată deasupra listei */}
           {carsError && cars.length > 0 && !isModalOpen && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded relative mb-4 text-sm" role="alert">
                   <span className="block sm:inline">{carsError}</span>
                </div>
           )}
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
             {cars.map((car) => {
               // Calculează TOATE statusurile necesare
               const itpStatus = checkDateProximity(car.dataITP).status;
               const rcaStatus = checkDateProximity(car.dataRCA).status;
               const revizieStatus = checkDateProximity(car.dataUrmatoareiRevizii).status;
               const cascoStatus = checkDateProximity(car.dataCASCO).status; // Calculează și CASCO

               return (
                 <CarCard
                   key={car.id}
                   car={car}
                   onView={handleViewCar}
                   onEdit={handleEditCar}
                   onDelete={handleDeleteCar}
                   // Pasează statusurile calculate
                   itpStatus={itpStatus}
                   rcaStatus={rcaStatus}
                   revizieStatus={revizieStatus}
                   cascoStatus={cascoStatus} // Pasează și CASCO
                 />
               );
             })}
           </div>
         </>
       );
   };

  // --- JSX Principal ---
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-6 md:px-6 lg:px-8">
        {/* Header */}
        <header className="flex flex-wrap sm:flex-nowrap justify-between items-center mb-6 pb-4 border-b border-gray-300 gap-4 bg-white p-4 rounded-lg shadow-sm">
             <h1 className="text-2xl md:text-3xl font-semibold text-gray-800 w-full sm:w-auto"> <span role="img" aria-label="car emoji" className='mr-2'>🚗</span> Dashboard Mașini </h1>
             <div className='flex items-center space-x-4 sm:space-x-6 w-full sm:w-auto justify-end'>
                {currentUser && ( <span className='text-sm text-gray-600 hidden md:inline truncate' title={currentUser.displayName || currentUser.email}> Salut, {currentUser.displayName?.split(' ')[0] || currentUser.email}! </span> )}
                {/* Container Notificări */}
                <div className="relative notification-panel-wrapper">
                     <button
                        onClick={() => setShowNotificationPanel(prev => !prev)}
                        className="notification-bell-button text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 rounded-full p-1"
                        aria-label={`Notificări (${activeNotifications.length})`}
                        title={`Ai ${activeNotifications.length} notificări active`}
                    >
                       <BellIcon hasNotification={activeNotifications.length > 0} className="w-6 h-6" />
                    </button>
                    {showNotificationPanel && (
                        <NotificationPanel
                            notifications={activeNotifications}
                            onClose={() => setShowNotificationPanel(false)}
                             onNotificationClick={(notification) => { if (notification.carId && onViewCarDetails) { onViewCarDetails(notification.carId); setShowNotificationPanel(false); } }}
                        />
                    )}
                </div>
                <Button onClick={handleLogout} disabled={isLoggingOut} variant="secondary" className="text-xs sm:text-sm"> {isLoggingOut ? <LoadingSpinner size="w-4 h-4 mr-1" /> : null} {isLoggingOut ? 'Deconectare...' : 'Logout'} </Button>
             </div>
        </header>

        {/* Mesaj Eroare Logout */}
        {logoutError && ( <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert"> {logoutError} </div> )}

        {/* Buton Adaugă Mașină */}
        <div className="mb-6 text-right">
          <Button onClick={handleAddCarClick} variant="primary" disabled={loadingCars}>
             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" /></svg>
             Adaugă Mașină
          </Button>
        </div>

        {/* Zona de conținut principal (include și eroarea generală pentru mașini) */}
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
          {renderCarList()}
        </div>

        {/* Footer */}
         <footer className="text-center mt-12 py-4 text-gray-500 text-xs border-t border-gray-200"> © {new Date().getFullYear()} CarFile. MVP Project. </footer>
      </div>

      {/* Modal Adăugare/Editare Mașină */}
      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={editingCar ? 'Editare Mașină' : 'Adăugare Mașină Nouă'} widthClass="max-w-3xl">
          {/* Eroare specifică salvării în modal */}
          {carsError && isModalOpen && ( <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded relative mb-4 text-sm" role="alert"> <span className="block sm:inline">{carsError}</span> </div> )}
          <CarForm initialData={editingCar} onSave={handleSaveCar} onCancel={handleCloseModal} isSaving={isSaving} />
      </Modal>
    </div>
  );
};

export default DashboardPage;