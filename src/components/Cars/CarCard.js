// src/components/Cars/CarCard.js
import React from 'react';
import Button from '../Shared/Button';
// Nu mai este nevoie să importăm checkDateProximity aici, statusul vine ca prop

/**
 * Componenta helper pentru afișarea unei iconițe de status pe baza string-ului de status.
 * @param {{ status: 'expired' | 'urgent' | 'warning' | 'ok' | undefined }} props
 */
const StatusIcon = ({ status }) => {
  switch (status) {
    case 'expired':
      return <span title="Expirat!" className="text-red-500 ml-1.5 text-xs">🔴</span>; // Punct roșu
    case 'urgent':
      return <span title="Expiră curând (Urgent)!" className="text-orange-500 ml-1.5 text-xs">⚠️</span>; // Warning
    case 'warning':
      return <span title="Expiră în curând" className="text-yellow-500 ml-1.5 text-xs">🔔</span>; // Clopoțel
    default:
      // Nu afișăm nimic pentru 'ok' sau status necunoscut/undefined
      return null;
  }
};

/**
 * Afișează un card sumar pentru o mașină, inclusiv indicatori de status pentru documente/revizii.
 * @param {object} car - Obiectul mașinii.
 * @param {function} onView - Handler pentru click pe "Detalii".
 * @param {function} onEdit - Handler pentru click pe "Editează".
 * @param {function} onDelete - Handler pentru click pe "Șterge".
 * @param {'expired' | 'urgent' | 'warning' | 'ok'} [itpStatus] - Statusul ITP-ului.
 * @param {'expired' | 'urgent' | 'warning' | 'ok'} [rcaStatus] - Statusul RCA-ului.
 * @param {'expired' | 'urgent' | 'warning' | 'ok'} [revizieStatus] - Statusul următoarei revizii.
 * @param {'expired' | 'urgent' | 'warning' | 'ok'} [cascoStatus] - Statusul CASCO (opțional).
 */
const CarCard = ({
    car,
    onView,
    onEdit,
    onDelete,
    itpStatus,
    rcaStatus,
    revizieStatus,
    cascoStatus // Primim și statusul CASCO
}) => {
  // Verificare input (rămâne la fel)
  if (!car || !car.id) {
    // ... cod eroare/warning ...
    return <div className="bg-white ...">Date invalide.</div>;
  }

  const handleViewClick = () => onView(car);
  const handleEditClick = () => onEdit(car);
  const handleDeleteClick = () => onDelete(car.id);

  const carImageUrl = car.imageUrl || 'https://via.placeholder.com/300x200/e0e0e0/909090?text=Fara+Imagine';

  // Helper intern simplificat pentru formatare dată scurtă (DD.MM.YY)
  const formatDateShort = (dateValue) => {
    if (!dateValue) return 'N/A';
     try {
       const d = dateValue.toDate ? dateValue.toDate() : new Date(dateValue);
       // Verifică dacă data e validă înainte de a formata
       if (isNaN(d.getTime())) {
            // Încearcă să parseze YYYY-MM-DD dacă e string
            if (typeof dateValue === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(dateValue)) {
                const parts = dateValue.split('-');
                return `${parts[2]}.${parts[1]}.${parts[0].slice(-2)}`; // Afișează doar ultimele 2 cifre ale anului
            }
            return 'Inv.'; // Data invalidă
       }
       return d.toLocaleDateString('ro-RO', { day: '2-digit', month: '2-digit', year: '2-digit' });
     } catch {
       return 'Err.'; // Eroare la formatare
     }
  };

  // Determină clasa pentru bordura de sus
  let topBorderClass = 'border-transparent'; // Default: fără bordură vizibilă
  if (itpStatus === 'expired' || rcaStatus === 'expired' || revizieStatus === 'expired' || cascoStatus === 'expired') {
    topBorderClass = 'border-red-500';
  } else if (itpStatus === 'urgent' || rcaStatus === 'urgent' || revizieStatus === 'urgent' || cascoStatus === 'urgent') {
    topBorderClass = 'border-orange-500';
  } else if (itpStatus === 'warning' || rcaStatus === 'warning' || revizieStatus === 'warning' || cascoStatus === 'warning') {
    topBorderClass = 'border-yellow-500';
  }

  return (
    // Aplicăm clasa calculată pentru bordură
    <div className={`bg-white rounded-lg shadow-md overflow-hidden transition-shadow duration-300 hover:shadow-lg flex flex-col border-t-4 ${topBorderClass}`}>
      {/* Imaginea Mașinii */}
      <img
        src={carImageUrl}
        alt={`${car.marca || 'N/A'} ${car.model || ''}`}
        className="w-full h-48 object-cover"
        onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/300x200/f87171/ffffff?text=Eroare+Img'; }}
      />

      {/* Container Conținut */}
      <div className="p-4 flex flex-col flex-grow">
        {/* Detalii Principale (Marca, Model, Nr, An, Km) - neschimbate */}
        <h3 className="text-lg font-semibold text-gray-900 truncate" title={`${car.marca} ${car.model}`}> {car.marca || 'Marca'} {car.model || 'Model'} </h3>
        <p className="text-sm text-gray-600 mb-1"> {car.numarInmatriculare ? car.numarInmatriculare.toUpperCase() : 'Nr. N/A'} {' • '} {car.anFabricatie || 'An N/A'} </p>
        <p className="text-sm text-gray-500 mb-3"> {typeof car.kilometrajActual === 'number' ? `${car.kilometrajActual.toLocaleString('ro-RO')} km` : 'Km N/A'} </p>

        {/* --- MODIFICAT: Afișare statusuri documente --- */}
        <div className="text-xs text-gray-600 space-y-1 mb-3">
          {/* Afișăm doar dacă există data respectivă */}
          {car.dataITP && (
            <div className="flex items-center justify-between">
              <span>ITP: {formatDateShort(car.dataITP)}</span>
              <StatusIcon status={itpStatus} />
            </div>
          )}
           {car.dataRCA && (
            <div className="flex items-center justify-between">
              <span>RCA: {formatDateShort(car.dataRCA)}</span>
              <StatusIcon status={rcaStatus} />
            </div>
          )}
           {car.dataCASCO && ( // Afișăm CASCO doar dacă există data
             <div className="flex items-center justify-between">
                <span>CASCO: {formatDateShort(car.dataCASCO)}</span>
                <StatusIcon status={cascoStatus} />
             </div>
            )}
           {car.dataUrmatoareiRevizii && ( // Afișăm Revizia doar dacă există data
             <div className="flex items-center justify-between">
               <span>Revizie: {formatDateShort(car.dataUrmatoareiRevizii)}</span>
               <StatusIcon status={revizieStatus} />
             </div>
            )}
        </div>
        {/* ------------------------------------------- */}

        {/* Flex Grow și Butoane Acțiune (neschimbate) */}
        <div className="flex-grow"></div>
        <hr className="my-3 border-gray-200" />
        <div className="flex justify-end space-x-2">
            <Button onClick={handleViewClick} variant="outline" className="text-xs px-2 py-1"> Detalii </Button>
            <Button onClick={handleEditClick} variant="secondary" className="text-xs px-2 py-1"> Editează </Button>
            <Button onClick={handleDeleteClick} variant="danger" className="text-xs px-2 py-1"> Șterge </Button>
        </div>
      </div>
    </div>
  );
};

export default CarCard;