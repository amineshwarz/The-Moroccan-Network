import React from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { LayoutDashboard, Calendar, Ticket, LogOut, Users, Mail } from 'lucide-react';
import { useAuth } from '../../context/AuthContext'; // Import du contexte d'authentification

export const AdminLayout: React.FC = () => {
  const location = useLocation();
  const { user, logout } = useAuth(); // On récupère l'utilisateur et la fonction logout

  // Vérification du rôle
  const isAdmin = user?.roles?.includes('ROLE_ADMIN');

  // 1. Liens accessibles par TOUT LE MONDE (Staff + Admin)
  const staffLinks = [
    { label: 'Tableau de bord', path: '/admin/dashboard', icon: <LayoutDashboard size={20} /> },
    { label: 'Événements', path: '/admin/events', icon: <Calendar size={20} /> },
    { label: 'Billetterie', path: '/admin/ticketing', icon: <Ticket size={20} /> },
  ];

  // 2. Liens accessibles UNIQUEMENT par l'ADMIN
  const adminOnlyLinks = [
    { label: 'Adhérents', path: '/admin/adherents', icon: <Users size={20} /> },
    { label: 'Invitations Staff', path: '/admin/invitations', icon: <Mail size={20} /> },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar (Barre latérale) */}
      <aside className="w-64 bg-dark text-white hidden md:flex flex-col shadow-2xl">
        {/* Logo Section */}
        <div className="p-6 border-b border-white/10 text-center">
          <span className="text-xl font-black text-primary tracking-tighter italic">M4L Admin</span>
        </div>
        
        <nav className="flex-1 p-4 space-y-1">
          {/* Affichage des liens du Staff */}
          <p className="px-4 text-[10px] uppercase font-bold text-gray-500 mb-2 mt-4 tracking-widest">Menu Principal</p>
          {staffLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                location.pathname === link.path
                  ? 'bg-primary text-white shadow-lg shadow-primary/20'
                  : 'text-gray-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              {link.icon}
              <span className="font-medium text-sm">{link.label}</span>
            </Link>
          ))}

          {/* Affichage des liens réservés à l'ADMIN */}
          {isAdmin && (
            <div className="pt-6">
              <p className="px-4 text-[10px] uppercase font-bold text-primary mb-2 tracking-widest">Administration</p>
              {adminOnlyLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                    location.pathname === link.path
                      ? 'bg-primary text-white shadow-lg shadow-primary/20'
                      : 'text-gray-400 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  {link.icon}
                  <span className="font-medium text-sm">{link.label}</span>
                </Link>
              ))}
            </div>
          )}
        </nav>

        {/* Footer Sidebar : Déconnexion */}
        <div className="p-4 border-t border-white/10">
          <button 
            onClick={logout}
            className="w-full flex items-center space-x-3 px-4 py-3 text-gray-400 hover:text-primary hover:bg-white/5 rounded-xl transition-all duration-200"
          >
            <LogOut size={20} />
            <span className="font-medium text-sm">Déconnexion</span>
          </button>
        </div>
      </aside>

      {/* Zone de contenu à droite */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header mobile (visible seulement sur petit écran) */}
        <header className="md:hidden bg-dark text-white p-4 flex justify-between items-center">
             <span className="font-bold text-primary italic">M4L Admin</span>
             <button onClick={logout} className="text-gray-400"><LogOut size={20}/></button>
        </header>

        <main className="flex-1 overflow-auto p-8 bg-gray-50">
          {/* C'est ici que les pages (Dashboard, Events...) s'affichent */}
          <Outlet />
        </main>
      </div>
    </div>
  );
};