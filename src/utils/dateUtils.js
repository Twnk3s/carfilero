// src/utils/dateUtils.js
import { REMINDER_THRESHOLD_DAYS_WARNING, REMINDER_THRESHOLD_DAYS_URGENT } from '../config/constants';

/**
 * Verifică dacă o dată este expirată sau aproape de expirare în raport cu data curentă.
 * Gestionează input de tip string 'YYYY-MM-DD', obiect Date, sau Timestamp Firebase.
 *
 * @param {string | Date | import("firebase/firestore").Timestamp | null | undefined} dateValue - Valoarea datei de verificat.
 * @returns {{isRelevant: boolean, status: 'expired' | 'urgent' | 'warning' | 'ok', daysRemaining: number | null}}
 *          - isRelevant: true dacă data e validă și în pragul de avertizare/urgentă/expirată.
 *          - status: Starea datei ('expired', 'urgent', 'warning', 'ok').
 *          - daysRemaining: Numărul de zile rămase (negative dacă a expirat). Null dacă data e invalidă sau goală.
 */
export const checkDateProximity = (dateValue) => {
  // Pas 1: Verifică dacă data de intrare este validă/existentă
  if (!dateValue) {
    return { isRelevant: false, status: 'ok', daysRemaining: null };
  }

  let targetDate;
  try {
    // Pas 2: Converteste inputul într-un obiect Date standardizat
    if (typeof dateValue.toDate === 'function') {
      // Este Timestamp Firebase
      targetDate = dateValue.toDate();
    } else if (typeof dateValue === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(dateValue)) {
      // Este string 'YYYY-MM-DD' - tratament special pentru a evita probleme de fus orar
      // Cream data folosind componentele pentru a folosi fusul local al browserului
      const parts = dateValue.split('-'); // [YYYY, MM, DD]
      // Atenție: luna în constructorul Date este 0-indexată (0 = Ianuarie)
      targetDate = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
    } else if (dateValue instanceof Date) {
      // Este deja obiect Date
      targetDate = dateValue;
    } else {
      // Format necunoscut sau invalid
      throw new Error("Unsupported date format");
    }

    // Verifică dacă data rezultată este validă
    if (isNaN(targetDate.getTime())) {
      throw new Error("Invalid date object created");
    }

  } catch (e) {
    console.error("checkDateProximity: Error parsing date value:", dateValue, e);
    // Dacă nu putem parsa data, o considerăm 'ok' și nerelevantă
    return { isRelevant: false, status: 'ok', daysRemaining: null };
  }

  // Pas 3: Obține data curentă și normalizează ambele la începutul zilei
  const today = new Date();
  today.setHours(0, 0, 0, 0);       // Setăm ora la 00:00:00 pentru azi
  targetDate.setHours(0, 0, 0, 0); // Setăm ora la 00:00:00 pentru data țintă

  // Pas 4: Calculează diferența în zile
  const diffTime = targetDate.getTime() - today.getTime(); // Diferența în milisecunde
  // Math.ceil asigură că o fracțiune de zi rămasă contează ca o zi întreagă
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  // Pas 5: Determină statusul și relevanța
  let status = 'ok';
  let isRelevant = false;

  if (diffDays < 0) {
    // Data a expirat
    status = 'expired';
    isRelevant = true;
  } else if (diffDays <= REMINDER_THRESHOLD_DAYS_URGENT) {
    // Data este în pragul urgent
    status = 'urgent';
    isRelevant = true;
  } else if (diffDays <= REMINDER_THRESHOLD_DAYS_WARNING) {
    // Data este în pragul de avertizare
    status = 'warning';
    isRelevant = true;
  }
  // Altfel, statusul rămâne 'ok' și isRelevant rămâne false

  // Pas 6: Returnează rezultatul
  return { isRelevant, status, daysRemaining: diffDays };
};

// --- Alte funcții utilitare pentru date pot fi adăugate aici ---
// Exemplu: formatare dată (deși o avem deja în CarDetailPage, ar putea fi centralizată aici)
/*
export const formatDateForDisplay = (dateValue) => {
  if (!dateValue) return 'N/A';
  try {
    const dateObj = dateValue.toDate ? dateValue.toDate() : new Date(dateValue);
    if (isNaN(dateObj.getTime())) {
        if (typeof dateValue === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(dateValue)) {
            const parts = dateValue.split('-');
            return `${parts[2]}.${parts[1]}.${parts[0]}`;
        } return 'Data invalidă';
    }
    return dateObj.toLocaleDateString('ro-RO', { day: '2-digit', month: '2-digit', year: 'numeric' });
  } catch (e) { return 'Eroare dată'; }
}
*/