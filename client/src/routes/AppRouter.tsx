import React from 'react';
import { useRoutes, Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // On importe useAuth


// Import des Layouts
import { PublicLayout, AdminLayout } from '../components/layouts';

// Import des Pages Publiques
import { 
  HomePage, 
  MembershipPage, 
  EventsPage, 
  NewsPage, 
  ContactPage 
} from '../pages/public';

// Import des Pages Admin
import { 
  AdminLoginPage, 
  AdminDashboard, 
  AdminEvents, 
  AdminTicketing,
  AdminInvitationsPage  
} from '../pages/admin';

// --- COMPOSANT DE PROTECTION (AUTH GUARD) ---
/**
 * Ce composant vérifie si l'utilisateur est connecté et s'il a le bon rôle.
 * @param allowedRoles : Liste des rôles autorisés (ex: ['ROLE_ADMIN'])
 */
const AuthGuard = ({ allowedRoles }: { allowedRoles: string[] }) => {
  const { user, loading } = useAuth();

   // On attend que le context ait fini de vérifier le localStorage au démarrage
   if (loading) {
    return <div className="h-screen flex items-center justify-center text-primary font-bold">Chargement...</div>;
  }

  // 1. Si l'utilisateur n'est pas connecté -> Direction la page de Login
  if (!user) {
    return <Navigate to="/admin" replace />;
  }

  // 2. Vérification des rôles (Security)
  // .some vérifie si au moins un des rôles de l'utilisateur est dans la liste autorisée
  const hasAccess = allowedRoles.some(role => user.roles.includes(role));

  if (!hasAccess) {
    // Si l'utilisateur est connecté mais n'a pas le droit (ex: ROLE_USER simple)
    // On le renvoie à l'accueil
    return <Navigate to="/" replace />;
  }

  // 3. Si tout est OK, on affiche les pages enfants
  return <Outlet />;
};

// --- ARCHITECTURE DES ROUTES ---
const AppRouter: React.FC = () => {
  return useRoutes([
    {
      // --- ROUTES PUBLIQUES (Ouvertes à tous) ---
      path: '/',
      element: <PublicLayout />,
      children: [
        { index: true, element: <HomePage /> },
        { path: 'adhesion', element: <MembershipPage /> },
        { path: 'evenements', element: <EventsPage /> },
        { path: 'actualites', element: <NewsPage /> },
        { path: 'contact', element: <ContactPage /> },
        // On pourra ajouter ici les pages Success/Cancel de HelloAsso plus tard
      ],
    },
    {
      // --- ROUTES ADMIN & BUREAU ---
      path: '/admin',
      children: [
        // Page de connexion (toujours accessible)
        { index: true, element: <AdminLoginPage /> },

        // 1. ZONE BUREAU (Accessible par ROLE_BUREAU et ROLE_ADMIN)
        {
          element: <AuthGuard allowedRoles={['ROLE_BUREAU', 'ROLE_ADMIN']} />,
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

        // 2. ZONE ADMIN SUPRÊME (Accessible UNIQUEMENT par ROLE_ADMIN)
        // C'est ici qu'on mettra la gestion des membres et des invitations
        {
          element: <AuthGuard allowedRoles={['ROLE_ADMIN']} />,
          children: [
            {
              element: <AdminLayout />,
              children: [
                { path: 'invitations', element: <AdminInvitationsPage />},
                { path: 'members-management', element: <div className="p-8">Page de gestion des rôles (À venir)</div> },
              ],
            },
          ],
        },
      ],
    },
    {
      // REDIRECTION SI L'URL N'EXISTE PAS
      path: '*',
      element: <Navigate to="/" replace />,
    },
  ]);
};

export default AppRouter;