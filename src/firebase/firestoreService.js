// src/firebase/firestoreService.js
import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  Timestamp, // Asigură-te că Timestamp este importat
  getDoc,
  serverTimestamp, // Asigură-te că serverTimestamp este importat
  // where // Importă where dacă va fi necesar
} from 'firebase/firestore';
import { db } from './firebaseConfig'; // Importă instanța Firestore configurată

// --- Cars CRUD ---

/**
 * Construiește referința către colecția de mașini a unui utilizator specific.
 * @param {string} userId - ID-ul utilizatorului.
 * @returns {import("firebase/firestore").CollectionReference} Referința către colecția /users/{userId}/cars.
 * @throws {Error} Dacă userId lipsește.
 */
const getCarsCollectionRef = (userId) => {
  if (!userId) throw new Error("User ID is required.");
  return collection(db, 'users', userId, 'cars');
};

/**
 * Construiește referința către un document specific de mașină.
 * @param {string} userId - ID-ul utilizatorului.
 * @param {string} carId - ID-ul mașinii.
 * @returns {import("firebase/firestore").DocumentReference} Referința către documentul /users/{userId}/cars/{carId}.
 * @throws {Error} Dacă userId sau carId lipsesc.
 */
const getCarDocRef = (userId, carId) => {
    if (!userId || !carId) throw new Error("User ID and Car ID are required.");
    return doc(db, 'users', userId, 'cars', carId);
};

/**
 * Adaugă o mașină nouă în Firestore pentru un utilizator specific.
 * Se adaugă automat timestamp-uri pentru creare și actualizare.
 * @param {string} userId - ID-ul utilizatorului.
 * @param {object} carData - Datele mașinii de adăugat (fără ID, createdAt, updatedAt).
 * @returns {Promise<import("firebase/firestore").DocumentReference>} Referința documentului nou creat.
 * @throws {Error} Aruncă eroare dacă operația eșuează.
 */
export const addCar = async (userId, carData) => {
  console.log("Attempting to add car for user:", userId, "Data:", carData);
  try {
    const carsCollectionRef = getCarsCollectionRef(userId);
    const dataToSave = {
      ...carData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
    const docRef = await addDoc(carsCollectionRef, dataToSave);
    console.log("Car added successfully with ID: ", docRef.id);
    return docRef;
  } catch (error) {
    console.error("Error adding car: ", error);
    throw error;
  }
};

/**
 * Preia toate mașinile unui utilizator din Firestore.
 * Rezultatele sunt ordonate implicit după marca (ascendent).
 * @param {string} userId - ID-ul utilizatorului.
 * @returns {Promise<Array<object>>} Un array cu obiectele mașinilor (fiecare obiect include și ID-ul documentului).
 * @throws {Error} Aruncă eroare dacă operația eșuează.
 */
export const getCars = async (userId) => {
  console.log("Attempting to fetch cars for user:", userId);
  try {
    const carsCollectionRef = getCarsCollectionRef(userId);
    const q = query(carsCollectionRef, orderBy('marca', 'asc'));
    const querySnapshot = await getDocs(q);
    const cars = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    console.log(`Fetched ${cars.length} cars for user ${userId}`);
    return cars;
  } catch (error) {
    console.error("Error getting cars: ", error);
    throw error;
  }
};

 /**
 * Preia datele unei singure mașini pe baza ID-ului său.
 * @param {string} userId - ID-ul utilizatorului.
 * @param {string} carId - ID-ul mașinii.
 * @returns {Promise<object|null>} Datele mașinii (inclusiv ID) sau null dacă nu este găsită.
 * @throws {Error} Aruncă eroare dacă operația eșuează.
 */
export const getCarById = async (userId, carId) => {
    console.log(`Attempting to fetch car with ID: ${carId} for user: ${userId}`);
    try {
        const carDocRef = getCarDocRef(userId, carId);
        const docSnap = await getDoc(carDocRef);
        if (docSnap.exists()) {
            console.log("Car data found:", docSnap.data());
            return { id: docSnap.id, ...docSnap.data() };
        } else {
            console.warn(`No car found with ID: ${carId} for user: ${userId}`);
            return null;
        }
    } catch (error) {
        console.error("Error getting car by ID: ", error);
        throw error;
    }
};


/**
 * Actualizează datele unei mașini existente în Firestore.
 * Adaugă automat un timestamp pentru ultima actualizare.
 * @param {string} userId - ID-ul utilizatorului.
 * @param {string} carId - ID-ul mașinii de actualizat.
 * @param {object} updatedData - Obiectul cu câmpurile de actualizat.
 * @returns {Promise<void>} Se rezolvă când actualizarea este completă.
 * @throws {Error} Aruncă eroare dacă operația eșuează.
 */
export const updateCar = async (userId, carId, updatedData) => {
  console.log(`Attempting to update car ID: ${carId} for user: ${userId} with data:`, updatedData);
  try {
    const carDocRef = getCarDocRef(userId, carId);
    const dataToUpdate = {
      ...updatedData,
      updatedAt: serverTimestamp(),
    };
    await updateDoc(carDocRef, dataToUpdate);
    console.log("Car updated successfully: ", carId);
  } catch (error) {
    console.error("Error updating car: ", error);
    throw error;
  }
};

/**
 * Șterge o mașină din Firestore.
 * **ATENȚIE:** Șterge doar documentul mașinii, NU subcolecțiile.
 * @param {string} userId - ID-ul utilizatorului.
 * @param {string} carId - ID-ul mașinii de șters.
 * @returns {Promise<void>} Se rezolvă când ștergerea este completă.
 * @throws {Error} Aruncă eroare dacă operația eșuează.
 */
export const deleteCar = async (userId, carId) => {
  console.warn(`Attempting to delete car ID: ${carId} for user: ${userId}. This will NOT delete subcollections (expenses, refuels).`);
  try {
    const carDocRef = getCarDocRef(userId, carId);
    await deleteDoc(carDocRef);
    console.log("Car document deleted successfully: ", carId);
    // TODO (Post-MVP): Implementează ștergerea subcolecțiilor
  } catch (error) {
    console.error("Error deleting car: ", error);
    throw error;
  }
};


// --- Expenses CRUD ---

/**
 * Construiește referința către colecția de cheltuieli a unei mașini specifice.
 * @param {string} userId - ID-ul utilizatorului.
 * @param {string} carId - ID-ul mașinii.
 * @returns {import("firebase/firestore").CollectionReference} Referința către /users/{userId}/cars/{carId}/expenses.
 * @throws {Error} Dacă userId sau carId lipsesc.
 */
const getExpensesCollectionRef = (userId, carId) => {
  if (!userId || !carId) throw new Error("User ID and Car ID are required for expenses.");
  return collection(db, 'users', userId, 'cars', carId, 'expenses');
};

 /**
 * Construiește referința către un document specific de cheltuială.
 * @param {string} userId - ID-ul utilizatorului.
 * @param {string} carId - ID-ul mașinii.
 * @param {string} expenseId - ID-ul cheltuielii.
 * @returns {import("firebase/firestore").DocumentReference} Referința către /users/{userId}/cars/{carId}/expenses/{expenseId}.
 * @throws {Error} Dacă oricare ID lipsește.
 */
const getExpenseDocRef = (userId, carId, expenseId) => {
    if (!userId || !carId || !expenseId) throw new Error("User ID, Car ID, and Expense ID are required.");
    return doc(db, 'users', userId, 'cars', carId, 'expenses', expenseId);
};

/**
 * Adaugă o nouă cheltuială pentru o mașină specifică.
 * @param {string} userId - ID-ul utilizatorului.
 * @param {string} carId - ID-ul mașinii.
 * @param {object} expenseData - Datele cheltuielii (ex: { amount: number, type: string, date: string, description: string }).
 * @returns {Promise<import("firebase/firestore").DocumentReference>} Referința documentului nou creat.
 * @throws {Error} Aruncă eroare dacă operația eșuează.
 */
export const addExpense = async (userId, carId, expenseData) => {
  console.log(`Attempting to add expense for car: ${carId}, user: ${userId}`, expenseData);
  try {
    const expensesCollectionRef = getExpensesCollectionRef(userId, carId);
    const dataToSave = {
      ...expenseData,
      amount: Number(expenseData.amount) || 0, // Asigură că 'amount' este număr
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
    const docRef = await addDoc(expensesCollectionRef, dataToSave);
    console.log("Expense added successfully with ID: ", docRef.id);
    return docRef;
  } catch (error) {
    console.error("Error adding expense: ", error);
    throw error;
  }
};

/**
 * Preia toate cheltuielile pentru o mașină specifică.
 * Rezultatele sunt ordonate implicit după data cheltuielii (descendent).
 * @param {string} userId - ID-ul utilizatorului.
 * @param {string} carId - ID-ul mașinii.
 * @returns {Promise<Array<object>>} Un array cu obiectele cheltuielilor (incluzând ID-ul).
 * @throws {Error} Aruncă eroare dacă operația eșuează.
 */
export const getExpenses = async (userId, carId) => {
  console.log(`Attempting to fetch expenses for car: ${carId}, user: ${userId}`);
  try {
    const expensesCollectionRef = getExpensesCollectionRef(userId, carId);
    const q = query(expensesCollectionRef, orderBy('date', 'desc'));
    const querySnapshot = await getDocs(q);
    const expenses = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    console.log(`Fetched ${expenses.length} expenses for car ${carId}`);
    return expenses;
  } catch (error) {
    console.error("Error getting expenses: ", error);
    throw error;
  }
};

/**
 * Actualizează datele unei cheltuieli existente.
 * @param {string} userId - ID-ul utilizatorului.
 * @param {string} carId - ID-ul mașinii.
 * @param {string} expenseId - ID-ul cheltuielii de actualizat.
 * @param {object} updatedData - Obiectul cu câmpurile de actualizat.
 * @returns {Promise<void>} Se rezolvă când actualizarea este completă.
 * @throws {Error} Aruncă eroare dacă operația eșuează.
 */
export const updateExpense = async (userId, carId, expenseId, updatedData) => {
  console.log(`Attempting to update expense ID: ${expenseId} for car: ${carId}, user: ${userId}`, updatedData);
  try {
    const expenseDocRef = getExpenseDocRef(userId, carId, expenseId);
    const dataToUpdate = {
      ...updatedData,
      amount: Number(updatedData.amount) || 0,
      updatedAt: serverTimestamp(),
    };
    await updateDoc(expenseDocRef, dataToUpdate);
    console.log("Expense updated successfully: ", expenseId);
  } catch (error) {
    console.error("Error updating expense: ", error);
    throw error;
  }
};

/**
 * Șterge o cheltuială specifică.
 * @param {string} userId - ID-ul utilizatorului.
 * @param {string} carId - ID-ul mașinii.
 * @param {string} expenseId - ID-ul cheltuielii de șters.
 * @returns {Promise<void>} Se rezolvă când ștergerea este completă.
 * @throws {Error} Aruncă eroare dacă operația eșuează.
 */
export const deleteExpense = async (userId, carId, expenseId) => {
  console.log(`Attempting to delete expense ID: ${expenseId} for car: ${carId}, user: ${userId}`);
  try {
    const expenseDocRef = getExpenseDocRef(userId, carId, expenseId);
    await deleteDoc(expenseDocRef);
    console.log("Expense deleted successfully: ", expenseId);
  } catch (error) {
    console.error("Error deleting expense: ", error);
    throw error;
  }
};


// --- Refuels CRUD ---

/**
 * Construiește referința către colecția de alimentări a unei mașini specifice.
 * @param {string} userId - ID-ul utilizatorului.
 * @param {string} carId - ID-ul mașinii.
 * @returns {import("firebase/firestore").CollectionReference} Referința către /users/{userId}/cars/{carId}/refuels.
 * @throws {Error} Dacă userId sau carId lipsesc.
 */
const getRefuelsCollectionRef = (userId, carId) => {
  if (!userId || !carId) throw new Error("User ID and Car ID are required for refuels.");
  return collection(db, 'users', userId, 'cars', carId, 'refuels');
};

 /**
 * Construiește referința către un document specific de alimentare.
 * @param {string} userId - ID-ul utilizatorului.
 * @param {string} carId - ID-ul mașinii.
 * @param {string} refuelId - ID-ul alimentării.
 * @returns {import("firebase/firestore").DocumentReference} Referința către /users/{userId}/cars/{carId}/refuels/{refuelId}.
 * @throws {Error} Dacă oricare ID lipsește.
 */
const getRefuelDocRef = (userId, carId, refuelId) => {
    if (!userId || !carId || !refuelId) throw new Error("User ID, Car ID, and Refuel ID are required.");
    return doc(db, 'users', userId, 'cars', carId, 'refuels', refuelId);
};

/**
 * Adaugă o nouă înregistrare de alimentare pentru o mașină specifică.
 * @param {string} userId - ID-ul utilizatorului.
 * @param {string} carId - ID-ul mașinii.
 * @param {object} refuelData - Datele alimentării (ex: { date: string, liters: number, amount: number, mileage: number }).
 * @returns {Promise<import("firebase/firestore").DocumentReference>} Referința documentului nou creat.
 * @throws {Error} Aruncă eroare dacă operația eșuează.
 */
export const addRefuel = async (userId, carId, refuelData) => {
  console.log(`Attempting to add refuel for car: ${carId}, user: ${userId}`, refuelData);
  try {
    const refuelsCollectionRef = getRefuelsCollectionRef(userId, carId);
    const dataToSave = {
      ...refuelData,
      liters: Number(refuelData.liters) || 0,
      amount: Number(refuelData.amount) || 0,
      mileage: Number(refuelData.mileage) || 0,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
    const docRef = await addDoc(refuelsCollectionRef, dataToSave);
    console.log("Refuel added successfully with ID: ", docRef.id);
    return docRef;
  } catch (error) {
    console.error("Error adding refuel: ", error);
    throw error;
  }
};

/**
 * Preia toate înregistrările de alimentare pentru o mașină specifică.
 * Rezultatele sunt ordonate implicit după data alimentării (descendent).
 * @param {string} userId - ID-ul utilizatorului.
 * @param {string} carId - ID-ul mașinii.
 * @returns {Promise<Array<object>>} Un array cu obiectele alimentărilor (incluzând ID-ul).
 * @throws {Error} Aruncă eroare dacă operația eșuează.
 */
export const getRefuels = async (userId, carId) => {
  console.log(`Attempting to fetch refuels for car: ${carId}, user: ${userId}`);
  try {
    const refuelsCollectionRef = getRefuelsCollectionRef(userId, carId);
    const q = query(refuelsCollectionRef, orderBy('date', 'desc'));
    const querySnapshot = await getDocs(q);
    const refuels = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    console.log(`Fetched ${refuels.length} refuels for car ${carId}`);
    return refuels;
  } catch (error) {
    console.error("Error getting refuels: ", error);
    throw error;
  }
};

/**
 * Actualizează datele unei înregistrări de alimentare existente.
 * @param {string} userId - ID-ul utilizatorului.
 * @param {string} carId - ID-ul mașinii.
 * @param {string} refuelId - ID-ul alimentării de actualizat.
 * @param {object} updatedData - Obiectul cu câmpurile de actualizat.
 * @returns {Promise<void>} Se rezolvă când actualizarea este completă.
 * @throws {Error} Aruncă eroare dacă operația eșuează.
 */
export const updateRefuel = async (userId, carId, refuelId, updatedData) => {
  console.log(`Attempting to update refuel ID: ${refuelId} for car: ${carId}, user: ${userId}`, updatedData);
  try {
    const refuelDocRef = getRefuelDocRef(userId, carId, refuelId);
    const dataToUpdate = {
      ...updatedData,
      liters: Number(updatedData.liters) || 0,
      amount: Number(updatedData.amount) || 0,
      mileage: Number(updatedData.mileage) || 0,
      updatedAt: serverTimestamp(),
    };
    await updateDoc(refuelDocRef, dataToUpdate);
    console.log("Refuel updated successfully: ", refuelId);
  } catch (error) {
    console.error("Error updating refuel: ", error);
    throw error;
  }
};

/**
 * Șterge o înregistrare de alimentare specifică.
 * @param {string} userId - ID-ul utilizatorului.
 * @param {string} carId - ID-ul mașinii.
 * @param {string} refuelId - ID-ul alimentării de șters.
 * @returns {Promise<void>} Se rezolvă când ștergerea este completă.
 * @throws {Error} Aruncă eroare dacă operația eșuează.
 */
export const deleteRefuel = async (userId, carId, refuelId) => {
  console.log(`Attempting to delete refuel ID: ${refuelId} for car: ${carId}, user: ${userId}`);
  try {
    const refuelDocRef = getRefuelDocRef(userId, carId, refuelId);
    await deleteDoc(refuelDocRef);
    console.log("Refuel deleted successfully: ", refuelId);
  } catch (error) {
    console.error("Error deleting refuel: ", error);
    throw error;
  }
};