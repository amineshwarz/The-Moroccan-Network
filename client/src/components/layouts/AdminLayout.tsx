import React, { useState } from 'react';
import { Link, useLocation, Outlet, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Calendar, Newspaper, LogOut, 
  Users, Mail, Shield, X, ChevronRight, Menu 
} from 'lucide-react'; 
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

export const AdminLayout: React.FC = () => {
  const location = useLocation();
  const { user, logout } = useAuth();
  
  // États pour les menus et confirmations
  const [showConfirm, setShowConfirm] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isAdmin = user?.roles?.includes('ROLE_ADMIN') || user?.roles?.includes('ROLE_SUPER_ADMIN');

  // --- CONFIGURATION DES LIENS ---
  const staffLinks = [
    { label: 'TABLEAU DE BORD', path: '/admin/dashboard', icon: <LayoutDashboard size={18} /> },
    { label: 'ÉVÉNEMENTS', path: '/admin/events', icon: <Calendar size={18} /> },
    { label: 'ACTUALITÉS', path: '/admin/news', icon: <Newspaper size={18} /> },
  ];

  const adminOnlyLinks = [
    { label: 'ADHÉRENTS', path: '/admin/adherents', icon: <Users size={18} /> },
    { label: 'INVITATIONS STAFF', path: '/admin/invitations', icon: <Mail size={18} /> },
    { label: 'GESTION STAFF', path: '/admin/members-management', icon: <Shield size={18} /> },
  ];

  // --- COMPOSANT INTERNE : LE CONTENU DE LA SIDEBAR ---
  // On le définit ici pour ne pas répéter le code entre Desktop et Mobile
  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* 1. Header Sidebar : Logo Officiel */}
      <div className="p-10 border-b border-white/5 flex flex-col items-center">
        <img src="/logo.png" alt="Logo" className="h-14 w-auto object-contain mb-4" />
        <p className="text-[10px] font-black text-primary tracking-[0.4em] uppercase">Administration</p>
      </div>
      
      {/* 2. Navigation */}
      <nav className="flex-1 mt-8 space-y-1 overflow-y-auto custom-scrollbar">
        <p className="px-8 text-[9px] font-black text-gray-500 uppercase tracking-[0.3em] mb-4">Navigation</p>
        {staffLinks.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            onClick={() => setIsMobileMenuOpen(false)} // Ferme le menu sur mobile après clic
            className={`flex items-center gap-4 px-8 py-4 transition-all duration-300 border-l-4 ${
              location.pathname === link.path 
                ? 'bg-primary/10 border-primary text-white font-bold' 
                : 'border-transparent  text-white hover:text-gray-500 hover:bg-white/5'
            }`}
          >
            {link.icon}
            <span className="text-[11px] font-black tracking-widest">{link.label}</span>
          </Link>
        ))}

        {isAdmin && (
          <div className="pt-10">
            <p className="px-8 text-[9px] font-black text-primary uppercase tracking-[0.3em] mb-4">Haute Direction</p>
            {adminOnlyLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center gap-4 px-8 py-4 transition-all duration-300 border-l-4 ${
                  location.pathname === link.path 
                    ? 'bg-primary text-white border-white' 
                    : 'border-transparent  text-white hover:text-gray-500 hover:bg-white/5'
                }`}
              >
                {link.icon}
                <span className="text-[11px] font-black tracking-widest">{link.label}</span>
              </Link>
            ))}
          </div>
        )}
      </nav>

      {/* 3. Footer Sidebar : Effet Ignition & Logout */}
      <div className="mt-auto relative">
        {/* LE LOGO DECO "IGNITION"
  - Grayscale par défaut (éteint)
  - Couleur + Drop shadow au hover (allumage)
*/}
<div className="absolute inset-0 z-0">
  <motion.img
    src="/logo-seule.png"
    alt="Decoration"
    initial={{ opacity: 0.1, filter: "grayscale(100%)" }}
    whileHover={{
      opacity: 0.6,
      filter: "grayscale(0%) drop-shadow(0 0 5px rgba(255, 51, 0, 0.8))",
      transition: { duration: 0.4 },
    }}
    className="absolute -top-20 left-1/2  w-48 h-48 -translate-x-1/2 -translate-y-1/2 pointer-events-auto  object-contain"
  />
</div>

        <div className="p-6 border-t border-white/5 bg-black/40 backdrop-blur-md relative z-10">
          <button 
            onClick={() => setShowConfirm(true)} 
            className="w-full flex items-center justify-between px-4 py-3 text-gray-400 hover:text-primary transition-colors group"
          >
            <div className="flex items-center gap-3">
              <LogOut size={18} />
              <span className="text-[10px] font-black uppercase tracking-widest">Déconnexion</span>
            </div>
            <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-all -translate-x-2.5 group-hover:translate-x-0" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F4F4F4] flex overflow-hidden">
      
      {/* --- SIDEBAR DESKTOP (Fixe à gauche) --- */}
      <aside className="w-72 bg-dark text-white hidden lg:flex flex-col border-r border-white/5 shadow-2xl z-30">
        <SidebarContent />
      </aside>

      {/* --- MOBILE DRAWER (Menu Coulissant) --- */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Overlay sombre derrière le menu mobile */}
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-dark/80 backdrop-blur-sm z-60 lg:hidden"
            />
            {/* Le panneau du menu qui glisse */}
            <motion.aside 
              initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-72 bg-dark text-white z-70 lg:hidden shadow-2xl"
            >
              <button 
                onClick={() => setIsMobileMenuOpen(false)}
                className="absolute top-6 right-6 text-gray-400 hover:text-primary"
              >
                <X size={24} />
              </button>
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* --- MAIN AREA --- */}
      <div className="flex-1 flex flex-col h-screen relative">
        
        {/* HEADER MOBILE (Visible uniquement sur petit écran) */}
        <header className="lg:hidden bg-dark text-white p-5 flex justify-between items-center z-50">
             <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 -ml-2 text-gray-400 hover:text-primary transition-colors">
                <Menu size={28} />
             </button>
             <div className="flex items-center gap-2">
                <img src="/logo.png" alt="Logo" className="h-8 w-auto" />
                {/* <span className="font-black text-primary italic text-[10px] uppercase tracking-tighter">Gateway</span> */}
             </div>
             <div className="w-10"></div> {/* Équilibre visuel */}
        </header>

        {/* ZONE DE CONTENU DYNAMIQUE (Les pages) */}
        <main className="flex-1 overflow-auto p-6 md:p-12">
          {/* Transition douce entre les pages */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }} 
            key={location.pathname}
            className="h-full"
          >
            <Outlet />
          </motion.div>
        </main>
      </div>

      {/* --- MODAL DE CONFIRMATION DE DECONNEXION --- */}
      <AnimatePresence>
        {showConfirm && (
          <div className="fixed inset-0 z-1000 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-dark/90 backdrop-blur-md"
              onClick={() => setShowConfirm(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="relative bg-white border-t-12 border-primary w-full max-w-lg p-12 shadow-2xl"
            >
              <div className="text-center">
                <h2 className="text-4xl font-black text-dark uppercase italic tracking-tighter mb-4">LOGOUT.</h2>
                <p className="text-gray-400 font-bold uppercase text-[10px] tracking-[0.3em] mb-12">Session de gestion sécurisée</p>
                
                <div className="flex gap-4">
                  <button onClick={() => setShowConfirm(false)} className="flex-1 py-5 border-2 border-dark font-black text-[11px] uppercase tracking-widest hover:bg-gray-50 transition-all">
                    Annuler
                  </button>
                  <button 
                    onClick={() => { setShowConfirm(false); logout(); }} 
                    className="flex-1 py-5 bg-dark text-white font-black text-[11px] uppercase tracking-widest hover:bg-primary transition-all"
                  >
                    Confirmer
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};