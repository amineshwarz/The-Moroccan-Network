import React from 'react';
import { useRoutes, Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Import des Layouts
import { PublicLayout, AdminLayout } from '../components/layouts';

// Import des Pages Publiques
import { 
  HomePage, 
  MembershipPage, 
  EventsPage, 
  NewsPage, 
  ContactPage,
  RegistrationPage,
  ForgotPasswordPage
} from '../pages/public';

// Import des Pages Admin
import { 
  AdminLoginPage, 
  AdminDashboard, 
  AdminEvents, 
  AdminTicketing,
  AdminInvitationsPage,  
  AdminSubscribersPage,
  AdminMembersPage,
} from '../pages/admin';

// --- COMPOSANT DE PROTECTION (AUTH GUARD) ---
const AuthGuard = ({ allowedRoles }: { allowedRoles: string[] }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="h-screen flex items-center justify-center text-primary font-bold">Chargement...</div>;
  }

  // Redirection vers l'accueil public si non connecté
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // CHANGEMENT ICI : On vérifie si l'utilisateur a au moins UN des rôles autorisés.
  // On utilise l'optional chaining (?.) pour éviter les erreurs si roles est undefined.
  const hasAccess = user.roles && allowedRoles.some(role => user.roles.includes(role));

  if (!hasAccess) {
    // Si connecté mais rôle insuffisant, retour au dashboard
    return <Navigate to="/admin/dashboard" replace />;
  }

  return <Outlet />;
};

// --- ARCHITECTURE DES ROUTES ---
const AppRouter: React.FC = () => {
  return useRoutes([
    {
      // --- 1. ROUTES PUBLIQUES ---
      path: '/',
      element: <PublicLayout />,
      children: [
        { index: true, element: <HomePage /> },
        { path: 'adhesion', element: <MembershipPage /> },
        { path: 'register', element: <RegistrationPage /> },
        { path: 'evenements', element: <EventsPage /> },
        { path: 'actualites', element: <NewsPage /> },
        { path: 'contact', element: <ContactPage /> },
        { path: 'forgot-password', element: <ForgotPasswordPage /> }
      ],
    },
    {
      // --- 2. ROUTES D'ACCÈS ADMIN/BUREAU ---
      path: '/admin',
      children: [
        { index: true, element: <AdminLoginPage /> },

        // --- ZONE STAFF / BUREAU ---
        // CHANGEMENT : On ajoute ROLE_SUPER_ADMIN pour que le Président puisse aussi y accéder
        {
          element: <AuthGuard allowedRoles={['ROLE_USER', 'ROLE_ADMIN', 'ROLE_SUPER_ADMIN']} />,
          children: [
            {
              element: <AdminLayout />,
              children: [
                { path: 'dashboard', element: <AdminDashboard /> },
                { path: 'events', element: <AdminEvents /> },
                { path: 'ticketing', element: <AdminTicketing /> },
              ],
            },
          ],
        },

        // --- ZONE ADMINISTRATION (Sensible) ---
        // CHANGEMENT : On autorise ROLE_ADMIN (Bras droit) ET ROLE_SUPER_ADMIN (Président)
        // La restriction entre les deux se fera ensuite directement dans les composants (boutons grisés)
        {
          element: <AuthGuard allowedRoles={['ROLE_ADMIN', 'ROLE_SUPER_ADMIN']} />,
          children: [
            {
              element: <AdminLayout />,
              children: [
                { path: 'invitations', element: <AdminInvitationsPage />},
                { path: 'adherents', element: <AdminSubscribersPage /> }, 
                { path: 'members-management', element: <AdminMembersPage /> },
              ],
            },
          ],
        },
      ],
    },
    {
      path: '*',
      element: <Navigate to="/" replace />,
    },
  ]);
};

export default AppRouter;