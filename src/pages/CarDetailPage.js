// src/pages/CarDetailPage.js
import React, { useState, useEffect } from 'react';
import { getCarById } from '../firebase/firestoreService'; // Importă funcția de fetch specific
import LoadingSpinner from '../components/Shared/LoadingSpinner';
import Button from '../components/Shared/Button';
import ExpenseList from '../components/Expenses/ExpenseList'; // Importat
import RefuelList from '../components/Refuels/RefuelList';   // Importat
import { checkDateProximity } from '../utils/dateUtils'; // <- Importăm utilitarul pentru a verifica datele

/**
 * Afișează detaliile complete ale unei mașini.
 * Include secțiuni interactive pentru Cheltuieli și Alimentări.
 * Evidențiază datele de expirare apropiate sau depășite.
 *
 * @param {string} carId - ID-ul mașinii de afișat.
 * @param {string} userId - ID-ul utilizatorului curent (necesar pentru fetch și sub-liste).
 * @param {function} onBack - Funcția apelată pentru a reveni la dashboard.
 */
const CarDetailPage = ({ carId, userId, onBack }) => {
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Efect pentru a prelua datele mașinii
  useEffect(() => {
    const fetchCarData = async () => {
      if (!userId || !carId) { setError("ID utilizator sau ID mașină lipsă."); setLoading(false); return; }
      setLoading(true); setError(null);
      try {
        const carData = await getCarById(userId, carId);
        if (carData) { setCar(carData); }
        else { setError("Mașina nu a fost găsită sau nu aveți permisiunea."); }
      } catch (err) { console.error("CarDetailPage: Error fetching car data:", err); setError("A apărut o eroare la încărcarea datelor mașinii."); }
      finally { setLoading(false); }
    };
    fetchCarData();
  }, [carId, userId]);

  // Funcție helper pentru formatarea datelor
  const formatDate = (dateValue) => {
      if (!dateValue) return 'N/A'; try { const dateObj = dateValue.toDate ? dateValue.toDate() : new Date(dateValue); if (isNaN(dateObj.getTime())) { if (typeof dateValue === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(dateValue)) { const parts = dateValue.split('-'); return `${parts[2]}.${parts[1]}.${parts[0]}`; } return 'Data invalidă'; } return dateObj.toLocaleDateString('ro-RO', { day: '2-digit', month: '2-digit', year: 'numeric' }); } catch (e) { console.error("Error formatting date:", dateValue, e); return 'Eroare dată'; }
  };

  // Funcție helper pentru formatarea numerelor
  const formatNumber = (numValue, isCurrency = false, decimals = 0) => {
      if (numValue === null || numValue === undefined || numValue === '') return 'N/A'; const number = Number(numValue); if (isNaN(number)) return 'Valoare invalidă';
      const options = isCurrency
          ? { style: 'currency', currency: 'RON', minimumFractionDigits: decimals, maximumFractionDigits: decimals }
          : { minimumFractionDigits: decimals, maximumFractionDigits: decimals };
      return number.toLocaleString('ro-RO', options);
  };

  // --- Funcție helper pentru clase CSS bazate pe status ---
  const getStatusColorClass = (status) => {
    switch (status) {
      case 'expired': return 'text-red-600 font-bold';
      case 'urgent': return 'text-orange-600 font-semibold';
      case 'warning': return 'text-yellow-600';
      default: return 'text-gray-800'; // Culoare normală pentru 'ok' sau necunoscut
    }
  };


  // --- Redare în funcție de stări ---
  if (loading) { return ( <div className="flex justify-center items-center min-h-screen bg-gray-100"><LoadingSpinner size="w-16 h-16" /></div> ); }
  if (error) { return ( <div className="container mx-auto p-6 text-center"><div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert"><strong className="font-bold">Eroare!</strong><span className="block sm:inline"> {error}</span></div><Button onClick={onBack} variant="secondary" className="mt-4">Înapoi la Dashboard</Button></div> ); }
  if (!car) { return ( <div className="container mx-auto p-6 text-center"><p className="text-gray-600">Datele mașinii nu sunt disponibile.</p><Button onClick={onBack} variant="secondary" className="mt-4">Înapoi la Dashboard</Button></div> ); }

  // --- Calculează statusurile DOAR DUPĂ ce 'car' este încărcat ---
  const itpInfo = checkDateProximity(car.dataITP);
  const rcaInfo = checkDateProximity(car.dataRCA);
  const cascoInfo = checkDateProximity(car.dataCASCO);
  const revizieInfo = checkDateProximity(car.dataUrmatoareiRevizii);


  // --- Redare Detalii Mașină ---
  const carImageUrl = car.imageUrl || 'https://via.placeholder.com/600x400/e0e0e0/909090?text=Fara+Imagine';

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <div className="container mx-auto px-4 py-6 md:px-6 lg:px-8">
        {/* Buton Înapoi și Titlu */}
        <div className="flex items-center justify-between mb-6">
            <Button onClick={onBack} variant="outline">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                Înapoi
            </Button>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 text-right truncate ml-4">{car.marca} {car.model} <span className="text-lg font-medium text-gray-500">({car.numarInmatriculare?.toUpperCase()})</span></h1>
        </div>

        {/* Grid Principal Detalii */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Coloana Stânga */}
                <div className="md:col-span-1">
                     <img src={carImageUrl} alt={`${car.marca} ${car.model}`} className="w-full h-auto object-cover rounded-lg shadow mb-6 aspect-video" onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/600x400/f87171/ffffff?text=Eroare+Img'; }}/>
                     <h2 className="text-xl font-semibold text-gray-700 mb-3 border-b pb-2">Date Generale</h2>
                     <dl className="space-y-2 text-sm">
                        <div className="flex justify-between"><dt className="text-gray-500">An Fabricație:</dt><dd className="font-medium text-gray-800">{car.anFabricatie || 'N/A'}</dd></div>
                        <div className="flex justify-between"><dt className="text-gray-500">Kilometraj:</dt><dd className="font-medium text-gray-800">{formatNumber(car.kilometrajActual, false, 0)} km</dd></div>
                        <div className="flex justify-between"><dt className="text-gray-500">Motorizare:</dt><dd className="font-medium text-gray-800 capitalize">{car.motorizare || 'N/A'}</dd></div>
                        <div className="flex justify-between"><dt className="text-gray-500">Cutie Viteze:</dt><dd className="font-medium text-gray-800 capitalize">{car.cutieViteze || 'N/A'}</dd></div>
                     </dl>
                </div>

                {/* Coloana Dreapta */}
                <div className="md:col-span-2">
                     {/* === MODIFICAT: Documente & Revizii === */}
                     <h2 className="text-xl font-semibold text-gray-700 mb-3 border-b pb-2">Documente & Revizii</h2>
                     <dl className="space-y-2 text-sm mb-6">
                         {/* ITP */}
                         <div className="flex justify-between items-start">
                             <dt className="text-gray-500 pt-0.5">Expirare ITP:</dt>
                             <dd className={`font-medium text-right ${getStatusColorClass(itpInfo.status)}`}>
                                 {formatDate(car.dataITP)}
                                 {/* Afișăm zilele rămase/trecute dacă statusul nu e 'ok' */}
                                 {itpInfo.status !== 'ok' && itpInfo.daysRemaining !== null && (
                                     <span className="block text-xs opacity-80">
                                         ({itpInfo.daysRemaining < 0 ? `expirat acum ${Math.abs(itpInfo.daysRemaining)} zile` : `în ${itpInfo.daysRemaining} zile`})
                                     </span>
                                 )}
                             </dd>
                         </div>
                         {/* RCA */}
                         <div className="flex justify-between items-start">
                             <dt className="text-gray-500 pt-0.5">Expirare RCA:</dt>
                             <dd className={`font-medium text-right ${getStatusColorClass(rcaInfo.status)}`}>
                                 {formatDate(car.dataRCA)}
                                 {rcaInfo.status !== 'ok' && rcaInfo.daysRemaining !== null && (
                                     <span className="block text-xs opacity-80">
                                         ({rcaInfo.daysRemaining < 0 ? `expirat acum ${Math.abs(rcaInfo.daysRemaining)} zile` : `în ${rcaInfo.daysRemaining} zile`})
                                     </span>
                                 )}
                             </dd>
                         </div>
                         {/* CASCO - Afișăm doar dacă există data */}
                         {car.dataCASCO && (
                             <div className="flex justify-between items-start">
                                 <dt className="text-gray-500 pt-0.5">Expirare CASCO:</dt>
                                 <dd className={`font-medium text-right ${getStatusColorClass(cascoInfo.status)}`}>
                                     {formatDate(car.dataCASCO)}
                                     {cascoInfo.status !== 'ok' && cascoInfo.daysRemaining !== null && (
                                         <span className="block text-xs opacity-80">
                                             ({cascoInfo.daysRemaining < 0 ? `expirat acum ${Math.abs(cascoInfo.daysRemaining)} zile` : `în ${cascoInfo.daysRemaining} zile`})
                                         </span>
                                     )}
                                 </dd>
                             </div>
                         )}
                         {/* Ultima Revizie - Fără status */}
                         <div className="flex justify-between items-start">
                             <dt className="text-gray-500 pt-0.5">Ultima Revizie:</dt>
                             <dd className="font-medium text-right text-gray-800">{formatDate(car.dataUltimaRevizie)}</dd>
                         </div>
                         {/* Următoarea Revizie - Afișăm doar dacă există data */}
                         {car.dataUrmatoareiRevizii && (
                             <div className="flex justify-between items-start">
                                 <dt className="text-gray-500 pt-0.5">Următoarea Revizie:</dt>
                                 <dd className={`font-medium text-right ${getStatusColorClass(revizieInfo.status)}`}>
                                     {formatDate(car.dataUrmatoareiRevizii)}
                                     {revizieInfo.status !== 'ok' && revizieInfo.daysRemaining !== null && (
                                         <span className="block text-xs opacity-80">
                                             ({revizieInfo.daysRemaining < 0 ? `recomandată (data trecută)` : `recomandată în ${revizieInfo.daysRemaining} zile`})
                                         </span>
                                     )}
                                 </dd>
                             </div>
                         )}
                     </dl>
                     {/* ===================================== */}

                     {/* Costuri Estimate (neschimbat) */}
                      <h2 className="text-xl font-semibold text-gray-700 mb-3 border-b pb-2">Costuri Estimate Anuale</h2>
                      <dl className="space-y-2 text-sm mb-6">{/* ... costuri ... */}</dl>

                     {/* Istoric Tehnic (neschimbat) */}
                     <h2 className="text-xl font-semibold text-gray-700 mb-3 border-b pb-2">Istoric Tehnic / Note</h2>
                     <div className="text-sm text-gray-700 bg-gray-50 p-3 rounded border border-gray-200 min-h-[100px] whitespace-pre-wrap">{/* ... istoric ... */}</div>
                </div>
            </div>
        </div>

         {/* Secțiunile Cheltuieli și Alimentări (neschimbate) */}
         <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Secțiune Cheltuieli */}
            <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg">
                 <h2 className="text-xl font-semibold text-gray-700 mb-4 border-b pb-2">Istoric Cheltuieli</h2>
                 {userId && carId ? ( <ExpenseList carId={carId} userId={userId} /> ) : ( <p className="text-center text-red-500">ID Mașină sau Utilizator lipsă.</p> )}
            </div>
            {/* Secțiune Alimentări */}
             <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg">
                 <h2 className="text-xl font-semibold text-gray-700 mb-4 border-b pb-2">Istoric Alimentări</h2>
                 {userId && carId ? ( <RefuelList carId={carId} userId={userId} /> ) : ( <p className="text-center text-red-500">ID Mașină sau Utilizator lipsă.</p> )}
             </div>
         </div>

      </div>
    </div>
  );
};

export default CarDetailPage;