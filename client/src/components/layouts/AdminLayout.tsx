import React, { useState } from 'react'; // 1. On ajoute useState
import { Link, useLocation, Outlet } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Calendar, 
  Ticket, 
  LogOut, 
  Users, 
  Mail, 
  Shield 
} from 'lucide-react'; 
import { useAuth } from '../../context/AuthContext';

export const AdminLayout: React.FC = () => {
  const location = useLocation();
  const { user, logout } = useAuth();
  
  // 2. On crée l'état pour afficher ou cacher la confirmation
  const [showConfirm, setShowConfirm] = useState(false);

  const isAdmin = user?.roles?.includes('ROLE_ADMIN');

  const staffLinks = [
    { label: 'Tableau de bord', path: '/admin/dashboard', icon: <LayoutDashboard size={20} /> },
    { label: 'Événements', path: '/admin/events', icon: <Calendar size={20} /> },
    { label: 'Billetterie', path: '/admin/ticketing', icon: <Ticket size={20} /> },
  ];

  const adminOnlyLinks = [
    { label: 'Adhérents', path: '/admin/adherents', icon: <Users size={20} /> },
    { label: 'Invitations Staff', path: '/admin/invitations', icon: <Mail size={20} /> },
    { label: 'Gestion Staff', path: '/admin/members-management', icon: <Shield size={20} /> },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-dark text-white hidden md:flex flex-col shadow-2xl overflow-hidden">
        
        {/* Section Logo Haute */}
        <div className="p-8 border-b border-white/5 flex flex-col items-center">
          <img src="/logo.png" alt="Logo" className="w-40 h-12 object-contain" />
        </div>
        
        {/* Navigation principale */}
        <nav className="flex-1 p-4 space-y-1">
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

        {/* --- SECTION BAS DE SIDEBAR --- */}
        <div className="mt-auto relative">
          
          <div className="relative h-60 overflow-hidden flex justify-center ">
            <img 
              src="/logo-seule.png" 
              alt="Décoration" 
              className="w-60 h-60 rounded-full object-cover opacity-10 grayscale absolute transition-all duration-700 hover:opacity-40 hover:grayscale-0"
            />
          </div>

          {/* Bouton Déconnexion - MODIFIÉ : Il ouvre maintenant la confirmation */}
          <div className="p-4 border-t border-white/10 bg-dark/50 backdrop-blur-md relative z-10">
            <button 
              onClick={() => setShowConfirm(true)} 
              className="w-full flex items-center space-x-3 px-4 py-3 text-gray-400 hover:text-primary hover:bg-white/5 rounded-xl transition-all duration-200"
            >
              <LogOut size={20} />
              <span className="font-medium text-sm">Déconnexion</span>
            </button>
          </div>
        </div>
      </aside>

      {/* --- FENÊTRE DE CONFIRMATION (MODAL) --- */}
      {showConfirm && (
        <div className="fixed inset-0 z-999 flex items-center justify-center p-4">
          {/* Fond sombre et flou */}
          <div 
            className="absolute inset-0 bg-dark/40 backdrop-blur-xs animate-in fade-in duration-300"
            onClick={() => setShowConfirm(false)}
          ></div>

          {/* Carte de message */}
          <div className="relative bg-white p-8 rounded-[2.5rem] shadow-2xl max-w-2xl w-full text-center border-t-8 border-primary animate-in zoom-in duration-200">
            <div className="w-20 h-20 bg-primary-light text-primary rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
              <LogOut size={40} />
            </div>
            
            <h2 className="text-2xl font-black text-dark mb-2">Déconnexion ?</h2>
            <p className="text-gray-500 mb-8 font-medium">
              Voulez-vous vraiment quitter The Moroccan Network ?
            </p>

            <div className="flex gap-3">
              {/* Bouton ANNULER */}
              <button 
                onClick={() => setShowConfirm(false)}
                className="flex-1 py-4 bg-gray-100 text-dark rounded-2xl font-bold hover:bg-gray-200 transition-colors"
              >
                Non
              </button>
              
              {/* Bouton CONFIRMER */}
              <button 
                onClick={() => {
                  setShowConfirm(false);
                  logout(); // Ici on appelle ta fonction logout du contexte
                }}
                className="flex-1 py-4 bg-primary text-white rounded-2xl font-bold hover:bg-dark transition-all shadow-lg shadow-primary/30"
              >
                Oui
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Zone de contenu */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="md:hidden bg-dark text-white p-4 flex justify-between items-center">
             <span className="font-bold text-primary italic text-sm uppercase tracking-tighter">The Moroccan Network</span>
             <button onClick={() => setShowConfirm(true)} className="text-gray-400">
               <LogOut size={20}/>
             </button>
        </header>

        <main className="flex-1 overflow-auto p-8 bg-gray-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
};