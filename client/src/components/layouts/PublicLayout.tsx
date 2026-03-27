import React, { useState } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { Menu, X, Home, Calendar, Mail, Newspaper, HeartHandshake, Network, ArrowRight } from 'lucide-react';

export const PublicLayout: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { label: 'Accueil', path: '/', icon: <Home size={18} /> },
    { label: 'À propos', path: '/apropos', icon: <Network size={18} /> },
    { label: 'Adhérer', path: '/adhesion', icon: <HeartHandshake size={18} /> },
    { label: 'Événements', path: '/evenements', icon: <Calendar size={18} /> },
    { label: 'Actualités', path: '/actualites', icon: <Newspaper size={18} /> },
    { label: 'Contact', path: '/contact', icon: <Mail size={18} /> },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      
      {/* --- HEADER --- */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-24"> {/* Hauteur passée à h-24 pour le logo */}
            
            {/* LOGO SECTION */}
            <Link to="/" className="flex items-center transition-transform hover:scale-105 duration-300">
              <img 
                src="/logo.png" 
                alt="The Moroccan Network Logo" 
                className="h-12 md:h-14 w-auto object-contain" // Taille optimisée pour être élégante
                onError={(e) => (e.currentTarget.style.display = 'none')} 
              /> 
            </Link>

            {/* DESKTOP NAVIGATION */}
            <nav className="hidden lg:flex items-center space-x-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-4 py-2 text-[11px] font-black uppercase tracking-widest transition-all duration-300 border-b-2 ${
                    location.pathname === link.path 
                    ? 'text-primary border-primary' 
                    : 'text-gray-400 border-transparent hover:text-dark hover:border-gray-200'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              
              {/* Accès Admin spécial */}
              <Link 
                to="/admin" 
                className="ml-6 px-5 py-2 bg-dark text-white text-[10px] font-black uppercase tracking-[0.2em] hover:bg-primary transition-all shadow-lg"
              >
                Espace Bureau
              </Link>
            </nav>

            {/* MOBILE MENU BUTTON */}
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)} 
              className="lg:hidden p-2 text-dark hover:bg-gray-50 rounded-lg transition-colors"
            >
              {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>

        {/* MOBILE NAVIGATION */}
        {isMenuOpen && (
          <div className="lg:hidden bg-white border-b border-gray-200 animate-in slide-in-from-top duration-300">
            <nav className="flex flex-col p-4 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center justify-between px-6 py-4 text-xs font-black uppercase tracking-widest ${
                    location.pathname === link.path ? 'bg-primary-light text-primary' : 'text-dark hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    {link.icon}
                    <span>{link.label}</span>
                  </div>
                  <ArrowRight size={14} className="opacity-30" />
                </Link>
              ))}
              <Link
                to="/admin"
                onClick={() => setIsMenuOpen(false)}
                className="block mt-4 px-6 py-4 bg-dark text-white text-center text-xs font-black uppercase tracking-[0.3em]"
              >
                Connexion Bureau
              </Link>
            </nav>
          </div>
        )}
      </header>

      {/* --- MAIN CONTENT --- */}
      <main className="grow">
        <Outlet />
      </main>

      {/* --- FOOTER (STYLE NOIR PROFOND) --- */}
      <footer className="bg-dark text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
            
            {/* Logo & Slogan */}
            <div className="md:col-span-4 space-y-6">
               <img src="/logo.png" alt="Logo" className="h-10 w-auto brightness-0 invert opacity-80" />
               <h2 className="text-2xl font-black uppercase italic tracking-tighter">
                 THE MOROCCAN <span className="text-primary">NETWORK.</span>
               </h2>
               <p className="text-gray-500 text-sm font-medium leading-relaxed max-w-xs">
                 Plateforme d'excellence dédiée à la synergie des compétences et au rayonnement de notre communauté.
               </p>
            </div>

            {/* Navigation rapide */}
            <div className="md:col-span-2 space-y-6">
              <p className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">Réseau</p>
              <ul className="space-y-3 text-sm font-bold text-gray-400">
                <li><Link to="/apropos" className="hover:text-white transition-colors">L'Histoire</Link></li>
                <li><Link to="/evenements" className="hover:text-white transition-colors">Agenda</Link></li>
                <li><Link to="/actualites" className="hover:text-white transition-colors">Presse</Link></li>
              </ul>
            </div>

            {/* Légal */}
            <div className="md:col-span-3 space-y-6">
              <p className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">Légal</p>
              <ul className="space-y-3 text-sm font-bold text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Mentions Légales</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Confidentialité</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Statuts de l'association</a></li>
              </ul>
            </div>

            {/* Bouton adhésion rapide */}
            <div className="md:col-span-3">
              <Link 
                to="/adhesion" 
                className="block w-full border-2 border-primary text-primary hover:bg-primary hover:text-white py-4 text-center font-black text-xs uppercase tracking-[0.2em] transition-all"
              >
                Devenir membre →
              </Link>
            </div>
          </div>

          {/* Copyright */}
          <div className="mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-[9px] font-black text-gray-600 uppercase tracking-[0.4em]">
             <p>© {new Date().getFullYear()} The Moroccan Network — Tous droits réservés</p>
             <p className="text-gray-700 italic font-medium">L'excellence en mouvement</p>
          </div>
        </div>
      </footer>

    </div>
  );
};