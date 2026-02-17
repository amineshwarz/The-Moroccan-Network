import React from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Calendar, 
  Ticket, 
  LogOut, 
  Users, 
  Mail, 
  Shield // Import de l'icône pour la gestion du staff
} from 'lucide-react'; 
import { useAuth } from '../../context/AuthContext';

export const AdminLayout: React.FC = () => {
  const location = useLocation();
  const { user, logout } = useAuth();

  // Vérification du rôle Admin
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
    // --- NOUVEAU LIEN AJOUTÉ ICI ---
    { label: 'Gestion Staff', path: '/admin/members-management', icon: <Shield size={20} /> },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar (Barre latérale) */}
      <aside className="w-64 bg-dark text-white hidden md:flex flex-col shadow-2xl">
        {/* Logo Section */}
        <div className="p-8 border-b border-white/5 flex flex-col items-center">
          <img src="/logo.png" alt="Logo" className="w-40 h-12 mb-4" />
          {/* <div className="text-center">
            <p className="text-xs font-bold text-primary tracking-widest uppercase">The Moroccan</p>
            <p className="text-lg font-black text-white tracking-tighter">NETWORK</p>
          </div> */}
        </div>
        
        <nav className="flex-1 p-4 space-y-1">
          {/* Menu Staff */}
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

          {/* Menu Administration (Visible seulement par l'ADMIN) */}
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

        {/* Bouton Déconnexion */}
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
        {/* Header mobile */}
        <header className="md:hidden bg-dark text-white p-4 flex justify-between items-center">
             <span className="font-bold text-primary italic">M4L Admin</span>
             <button onClick={logout} className="text-gray-400"><LogOut size={20}/></button>
        </header>

        <main className="flex-1 overflow-auto p-8 bg-gray-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
};