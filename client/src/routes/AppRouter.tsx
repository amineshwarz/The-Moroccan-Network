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
  AdminSubscribersPage
} from '../pages/admin';

// --- COMPOSANT DE PROTECTION (AUTH GUARD) ---
const AuthGuard = ({ allowedRoles }: { allowedRoles: string[] }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="h-screen flex items-center justify-center text-primary font-bold">Chargement...</div>;
  }

  if (!user) {
    return <Navigate to="/admin" replace />;
  }

  // Vérifie si l'utilisateur possède l'un des rôles autorisés pour cette zone
  const hasAccess = user.roles && allowedRoles.some(role => user.roles.includes(role));

  if (!hasAccess) {
    // Si l'utilisateur est connecté mais n'a pas le bon rôle (ex: un membre bureau qui veut aller en zone Admin)
    return <Navigate to="/admin/dashboard" replace />;
  }

  return <Outlet />;
};

// --- ARCHITECTURE DES ROUTES ---
const AppRouter: React.FC = () => {
  return useRoutes([
    {
      // --- 1. ROUTES PUBLIQUES (Ouvertes à tout le monde) ---
      path: '/',
      element: <PublicLayout />,
      children: [
        { index: true, element: <HomePage /> },
        { path: 'adhesion', element: <MembershipPage /> },
        { path: 'register', element: <RegistrationPage /> }, // Accessible via ton lien d'invitation
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
        // Page de login (accessible si non connecté)
        { index: true, element: <AdminLoginPage /> },

        // ZONE STAFF / BUREAU (Accessible par ROLE_USER et ROLE_ADMIN)
        // C'est ici qu'ils arrivent immédiatement après inscription
        {
          element: <AuthGuard allowedRoles={['ROLE_USER', 'ROLE_ADMIN']} />,
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

        // ZONE SUPER-ADMIN (Accessible UNIQUEMENT par ROLE_ADMIN)
        // Ni le nouveau staff, ni les intrus ne peuvent voir ces pages
        {
          element: <AuthGuard allowedRoles={['ROLE_ADMIN']} />,
          children: [
            {
              element: <AdminLayout />,
              children: [
                { path: 'invitations', element: <AdminInvitationsPage />},
                { path: 'adherents', element: <AdminSubscribersPage /> }, 
                { path: 'members-management', element: <div className="p-8">Page de gestion des rôles (À venir)</div> },
              ],
            },
          ],
        },
      ],
    },
    {
      // FALLBACK : Si l'URL n'existe pas, retour à l'accueil
      path: '*',
      element: <Navigate to="/" replace />,
    },
  ]);
};

export default AppRouter;