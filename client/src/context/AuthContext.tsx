import React, { createContext, useContext, useState, useEffect } from 'react';

// -----------------------PARTIE 1 — DÉFINITION DES TYPES

interface User {
  id: number;
  email: string;
  roles: string[];
  firstName: string;
  lastName: string;
}

interface AuthContextType {
  user: User | null;  // null = non connecté
  loading: boolean;   // true pendant la lecture du localStorage au démarrage
  login: (userData: User, token: string) => void;
  logout: () => void;
}

// ----------------------- PARTIE 2 — CRÉATION DU CONTEXTE
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ----------------------- PARTIE 3 — LE PROVIDER (enveloppe toute l'app dans App.tsx)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // A. PERSISTANCE DE SESSION — lecture au démarrage
  useEffect(() => {
    // Quand React démarre, on relit le localStorage pour restaurer la session si l'utilisateur avait
    const savedUser = localStorage.getItem('user');
    const token = localStorage.getItem('jwt_token');

    if (savedUser && token) {
      try {
        setUser(JSON.parse(savedUser)); // JSON.parse recrée l'objet User depuis la string stockée
      } catch (e) {
        localStorage.removeItem('user'); // Si le JSON est corrompu → on nettoie
      }
    }
    setLoading(false);
    // On indique que la vérification initiale est terminée → AuthGuard dans AppRouter.tsx peut maintenant décider si l'utilisateur doit être redirigé ou non
  }, []);

 // B. LOGIN — appelé par AdminLoginPage après succès Symfony
  const login = (userData: User, token: string) => {
    localStorage.setItem('jwt_token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  // C. LOGOUT — appelé par AdminLayout (bouton Déconnexion)
  const logout = () => {
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// D. LE HOOK useAuth() — pour accéder facilement au contexte dans n'importe quel composant enfant (ex: AdminLoginPage, AdminDashboardPage, etc.)
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth doit être utilisé dans AuthProvider");
  return context;
};