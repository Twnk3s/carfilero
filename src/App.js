// src/App.js
import React, { useState } from 'react'; // Importă useState
import { useAuth } from './hooks/useAuth';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import CarDetailPage from './pages/CarDetailPage'; // <- Importă noua pagină

function App() {
  const { currentUser } = useAuth();
  // Stare pentru a decide ce vedem: null = dashboard, ID = detalii mașină
  const [viewingCarId, setViewingCarId] = useState(null);

  // Notă: Starea 'loading' din useAuth() este gestionată de AuthProvider
  // pentru încărcarea inițială. Nu e nevoie să o folosim explicit aici
  // pentru a decide între Login/Dashboard, deoarece AuthProvider nu va
  // reda <App /> până când nu se termină verificarea inițială.

  // Funcție pentru a naviga la detalii mașină
  const handleViewCarDetails = (carId) => {
    console.log("App: Navigating to view car ID:", carId);
    setViewingCarId(carId);
  };

  // Funcție pentru a reveni la dashboard
  const handleBackToDashboard = () => {
    console.log("App: Navigating back to dashboard");
    setViewingCarId(null);
  };

  // --- Logica de Redare ---

  // 1. Verifica dacă utilizatorul este autentificat
  if (!currentUser) {
    // Dacă nu este autentificat, arată mereu pagina de Login
    return <LoginPage />;
  }

  // 2. Dacă utilizatorul ESTE autentificat, verifică ce pagină să afișeze
  if (viewingCarId) {
    // Dacă avem un ID de mașină selectat, afișează pagina de detalii
    return (
      <CarDetailPage
        carId={viewingCarId}
        userId={currentUser.uid} // Pasează ID-ul userului pentru query-uri Firestore
        onBack={handleBackToDashboard} // Pasează funcția pentru butonul "Înapoi"
      />
    );
  } else {
    // Dacă nu avem un ID de mașină selectat, afișează Dashboard-ul
    return (
      <DashboardPage
        onViewCarDetails={handleViewCarDetails} // Pasează funcția pentru a permite navigarea la detalii
      />
    );
  }
}

export default App;