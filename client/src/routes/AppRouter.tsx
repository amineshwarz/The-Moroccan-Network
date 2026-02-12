// src/routes/AppRouter.tsx
import React from 'react';
import { useRoutes, Navigate } from 'react-router-dom';

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
  AdminTicketing 
} from '../pages/AdminPages';

const AppRouter: React.FC = () => {
  // On définit le tableau des routes
  const routes = useRoutes([
    {
      // SECTION PUBLIQUE
      path: '/',
      element: <PublicLayout />, // Le cadre avec Header/Footer
      children: [
        { index: true, element: <HomePage /> }, // Route par défaut : /
        { path: 'adhesion', element: <MembershipPage /> },
        { path: 'evenements', element: <EventsPage /> },
        { path: 'actualites', element: <NewsPage /> },
        { path: 'contact', element: <ContactPage /> },
      ],
    },
    {
      // SECTION ADMIN
      path: '/admin',
      children: [
        // Page de login (sans la sidebar d'admin)
        { index: true, element: <AdminLoginPage /> },
        
        // Pages de gestion (avec la sidebar d'admin)
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
    {
      // GESTION DES ERREURS 404
      // Si aucune route ne correspond, on redirige vers l'accueil
      path: '*',
      element: <Navigate to="/" replace />,
    },
  ]);

  return routes;
};

export default AppRouter;