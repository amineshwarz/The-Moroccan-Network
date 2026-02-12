import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AppRouter from './routes/AppRouter';

const App: React.FC = () => {
  return (
    <Router>
      {/* 
          On appelle simplement AppRouter. 
          Le hook useRoutes à l'intérieur va détecter l'URL 
          et afficher le bon composant automatiquement.
      */}
      <AppRouter />
    </Router>
  );
};

export default App;