// src/components/Shared/Modal.js
import React, { useEffect } from 'react';

/**
 * O componentă Modal generică și reutilizabilă.
 * Afișează conținutul `children` într-un overlay centrat.
 *
 * @param {boolean} isOpen - Controlează vizibilitatea modalului.
 * @param {function} onClose - Funcția apelată la click pe overlay sau pe butonul de închidere.
 * @param {string} [title] - Titlul opțional afișat în header-ul modalului.
 * @param {node} children - Conținutul principal al modalului (ex: un formular).
 * @param {string} [widthClass='max-w-xl'] - Clasa Tailwind pentru lățimea maximă a modalului.
 */
const Modal = ({ isOpen, onClose, title, children, widthClass = 'max-w-xl' }) => {

  // Efect pentru a preveni scroll-ul pe body când modalul este deschis
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    // Cleanup: Resetează overflow la demontare (dacă modalul dispare brusc)
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]); // Rulează doar când isOpen se schimbă

  // Nu reda nimic dacă modalul nu este deschis
  if (!isOpen) return null;

  // Handler pentru click pe fundal (închide modalul)
  const handleBackgroundClick = (e) => {
    // Închide doar dacă se dă click direct pe fundal (nu pe conținutul modalului)
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    // Container principal (Overlay) - fixat, acoperă tot ecranul
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm p-4 transition-opacity duration-300 ease-in-out"
      onClick={handleBackgroundClick} // Închide la click pe fundal
      role="dialog" // Semnificație semantică pentru accesibilitate
      aria-modal="true" // Indică faptul că interacțiunea cu restul paginii e blocată
      aria-labelledby={title ? "modal-title" : undefined} // Leagă titlul pentru screen readere
    >
      {/* Containerul Conținutului Modalului */}
      <div
        className={`bg-white rounded-lg shadow-2xl overflow-hidden w-full ${widthClass} flex flex-col max-h-[90vh]`} // Limitează înălțimea și permite scroll intern
        onClick={(e) => e.stopPropagation()} // Previne închiderea la click pe conținut
      >
        {/* Header Modal (Opțional, doar dacă există titlu sau buton de închidere explicit) */}
        {(title || onClose) && (
          <div className="flex justify-between items-center p-4 border-b border-gray-200">
            {/* Titlul Modalului */}
            {title && (
              <h2 id="modal-title" className="text-lg font-semibold text-gray-800">
                {title}
              </h2>
            )}
            {/* Butonul de Închidere (X) */}
            {onClose && (
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400 rounded-full p-1 ml-auto" // ml-auto pentru a-l împinge la dreapta dacă nu e titlu
                aria-label="Close modal" // Accesibilitate
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        )}

        {/* Conținutul Principal (Scrollabil dacă depășește înălțimea) */}
        <div className="p-6 overflow-y-auto">
          {children} {/* Aici va fi injectat conținutul, ex: CarForm */}
        </div>

        {/* Footer Modal (Opțional - poate conține butoane de acțiune comune, dar le vom pune în formular deocamdată) */}
        {/* <div className="p-4 bg-gray-50 border-t border-gray-200 text-right">
          <Button onClick={onClose} variant="secondary">Close</Button>
        </div> */}
      </div>
    </div>
  );
};

export default Modal;