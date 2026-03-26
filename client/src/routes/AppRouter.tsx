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
  NewsDetailPage, 
  ContactPage,
  RegistrationPage,
  ForgotPasswordPage,
} from '../pages/public';

// --- NOUVEAUX IMPORTS : STATUS DE PAIEMENT ---
import { SuccessPage } from '../pages/public/PaymentStatus/SuccessPage';
import { CancelPage } from '../pages/public/PaymentStatus/CancelPage';

// Import des Pages Admin
import { 
  AdminLoginPage, 
  AdminDashboard, 
  AdminEvents,
  AdminEventDetailsPage, 
  AdminInvitationsPage,  
  AdminSubscribersPage,
  AdminMembersPage,
  AdminNews,
  AdminTicketing,
} from '../pages/admin';

// --- COMPOSANT DE PROTECTION (AUTH GUARD) ---
const AuthGuard = ({ allowedRoles }: { allowedRoles: string[] }) => {
  const { user, loading } = useAuth();

  // On attend que le context ait fini de charger (lecture du localStorage)
  if (loading) {
    return <div className="h-screen flex items-center justify-center text-primary font-bold animate-pulse text-2xl uppercase tracking-widest italic">The Moroccan Network...</div>;
  }

  // Redirection vers l'accueil public si l'utilisateur n'est pas connecté
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // Sécurité : On vérifie si l'utilisateur a au moins UN des rôles autorisés.
  // Utilisation de l'optional chaining (?.) pour éviter les crashs si l'objet user est mal formé.
  const hasAccess = user?.roles && allowedRoles.some(role => user.roles.includes(role));

  if (!hasAccess) {
    // Si l'utilisateur est connecté mais tente d'accéder à une zone interdite (ex: Staff qui veut aller en zone Admin)
    return <Navigate to="/admin/dashboard" replace />;
  }

  return <Outlet />;
};

// --- ARCHITECTURE DES ROUTES ---
const AppRouter: React.FC = () => {
  return useRoutes([
    {
      // --- 1. ROUTES PUBLIQUES (Ouvertes à tous les visiteurs) ---
      path: '/',
      element: <PublicLayout />,
      children: [
        { index: true, element: <HomePage /> },
        { path: 'adhesion', element: <MembershipPage /> },
        { path: 'register', element: <RegistrationPage /> },
        { path: 'evenements', element: <EventsPage /> },
        { path: 'actualites', element: <NewsPage /> },
        { path: 'actualites/:slug', element: <NewsDetailPage /> },
        { path: 'contact', element: <ContactPage /> },
        { path: 'forgot-password', element: <ForgotPasswordPage /> },
        
        // --- ROUTES DE RETOUR HELLOASSO ---
        // Ces routes doivent correspondre aux URLs envoyées dans ton PaymentController Symfony
        { path: 'payment/success', element: <SuccessPage /> },
        { path: 'payment/cancel', element: <CancelPage /> },
      ],
    },
    {
      // --- 2. ROUTES D'ACCÈS ADMIN/BUREAU ---
      path: '/admin',
      children: [
        // Page de login (toujours accessible pour se connecter)
        { index: true, element: <AdminLoginPage /> },

        // --- ZONE STAFF / BUREAU (Rôles : Bureau, Bras Droit, Président) ---
        {
          element: <AuthGuard allowedRoles={['ROLE_USER', 'ROLE_ADMIN', 'ROLE_SUPER_ADMIN']} />,
          children: [
            {
              element: <AdminLayout />,
              children: [
                { path: 'dashboard', element: <AdminDashboard /> },
                { path: 'events', element: <AdminEvents /> },
                { path: 'news', element: <AdminNews /> },
                { path: 'events/:id/tickets', element: <AdminEventDetailsPage /> },
                { path: 'ticketing', element: <AdminTicketing /> },
              ],
            },
          ],
        },

        // --- ZONE ADMINISTRATION SUPRÊME (Rôles : Bras Droit et Président uniquement) ---
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
      // FALLBACK : Si l'URL n'est pas reconnue, retour à l'accueil
      path: '*',
      element: <Navigate to="/" replace />,
    },
  ]);
};

export default AppRouter;