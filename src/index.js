// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; // Stilurile Tailwind
import App from './App'; // Componenta principală a aplicației
import { AuthProvider } from './context/AuthContext'; // Importă Provider-ul

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* Îmbracă App cu AuthProvider */}
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);