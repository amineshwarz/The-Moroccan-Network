import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import AppRouter from './routes/AppRouter';
import { AuthProvider } from './context/AuthContext'; // Import du provider

const App: React.FC = () => {
  return (
    <AuthProvider> {/* On entoure le router avec l'AuthProvider */}
      <Router>
        <AppRouter />
      </Router>
    </AuthProvider>
  );
};

export default App;