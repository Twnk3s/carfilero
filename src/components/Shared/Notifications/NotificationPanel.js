// src/components/Shared/Notifications/NotificationPanel.js
import React from 'react';
import PropTypes from 'prop-types'; // Importăm PropTypes pentru validare

/**
 * Afișează o listă simplă de notificări/remindere într-un panou dropdown.
 * @param {Array<{id: string, message: string, type: 'expired' | 'urgent' | 'warning' | 'info'}>} notifications - Lista de notificări.
 * @param {function} onClose - Funcția apelată la click pe butonul de închidere sau în afara panoului (gestionat de componenta părinte).
 * @param {function} [onNotificationClick] - (Opțional) Funcție apelată la click pe o notificare. Primește notificarea.
 */
const NotificationPanel = ({ notifications = [], onClose, onNotificationClick }) => {

  // Funcție helper pentru a returna iconița corespunzătoare tipului
  const getIcon = (type) => {
    switch (type) {
      case 'expired': return <span className="text-red-500 mr-2 text-lg" title="Expirat">‼️</span>; // Exclamation Mark
      case 'urgent': return <span className="text-orange-500 mr-2 text-lg" title="Urgent">⚠️</span>; // Warning Sign
      case 'warning': return <span className="text-yellow-500 mr-2 text-lg" title="Avertisment">🔔</span>; // Bell
      default: return <span className="text-blue-500 mr-2 text-lg" title="Info">ℹ️</span>; // Info Icon
    }
  };

  // Funcția apelată la click pe un item de notificare
  const handleItemClick = (notification) => {
    if (onNotificationClick) {
      onNotificationClick(notification);
    }
    // Poate închide panoul automat la click, sau lasă componenta părinte să decidă
    // onClose();
  };

  return (
    // Containerul principal al panoului, poziționat absolut
    <div
      className="absolute right-0 mt-2 w-72 sm:w-80 md:w-96 bg-white rounded-lg shadow-xl overflow-hidden z-50 border border-gray-200"
      // Previne închiderea panoului la click în interiorul său
      onClick={(e) => e.stopPropagation()}
    >
      {/* Header-ul panoului */}
      <div className="flex justify-between items-center px-4 py-2 bg-gray-50 border-b border-gray-200">
        <h3 className="font-semibold text-sm text-gray-700">Notificări Recente</h3>
        {/* Butonul de închidere (X) */}
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-1 focus:ring-gray-400 rounded-full p-1 -mr-1"
          aria-label="Închide notificările"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Lista de notificări */}
      <div className="max-h-80 overflow-y-auto"> {/* Scroll dacă lista e prea lungă */}
        {notifications.length === 0 ? (
          // Mesaj dacă nu există notificări
          <div className="py-6 px-4 text-sm text-gray-500 text-center">
            Nicio notificare nouă. Ești la zi! 👍
          </div>
        ) : (
          // Iterează și afișează fiecare notificare
          notifications.map((notif) => (
            <div
              key={notif.id}
              className={`flex items-start px-4 py-3 text-sm border-b border-gray-100 last:border-b-0 transition-colors duration-150 ease-in-out ${onNotificationClick ? 'cursor-pointer hover:bg-gray-100' : ''}`}
              onClick={() => handleItemClick(notif)} // Apelează handlerul la click
            >
              {/* Iconița */}
              <div className="flex-shrink-0 mt-0.5">
                {getIcon(notif.type)}
              </div>
              {/* Mesajul */}
              <div className="ml-2 text-gray-700">
                {notif.message}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer Opțional (ex: link "Vezi toate") */}
      {/* <div className="px-4 py-2 bg-gray-50 border-t border-gray-200 text-center">
        <a href="#" className="text-xs text-blue-600 hover:underline">Vezi toate notificările</a>
      </div> */}
    </div>
  );
};

// Definirea tipurilor de props pentru validare (bună practică)
NotificationPanel.propTypes = {
  notifications: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    message: PropTypes.string.isRequired,
    type: PropTypes.oneOf(['expired', 'urgent', 'warning', 'info']).isRequired,
    // Poți adăuga și alte câmpuri așteptate, ex: carId
  })),
  onClose: PropTypes.func.isRequired,
  onNotificationClick: PropTypes.func,
};

export default NotificationPanel;