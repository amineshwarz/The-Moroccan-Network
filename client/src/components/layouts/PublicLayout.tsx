import React, { useState } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { Menu, X, Home, Calendar, Mail, Newspaper, HeartHandshake, Network } from 'lucide-react';

export const PublicLayout: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { label: 'Accueil', path: '/', icon: <Home size={18} /> },
    { label: 'A propos de nous', path: '/apropos', icon: <Network size={18} /> },
    { label: 'Adhérer', path: '/adhesion', icon: <HeartHandshake size={18} /> },
    { label: 'Événements', path: '/evenements', icon: <Calendar size={18} /> },
    { label: 'Actualités', path: '/actualites', icon: <Newspaper size={18} /> },
    { label: 'Contact', path: '/contact', icon: <Mail size={18} /> },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
             {/* LOGO & NOM DU SITE */}
             <Link to="/" className="flex items-center space-x-3 group">
              {/* REMPLACE /logo.png PAR TON VRAI FICHIER */}
              <img src="/logo.png" alt="Logo" className="w-12 h-12 md:w-40 md:h-20 object-contain" 
                   onError={(e) => (e.currentTarget.style.display = 'none')} /> 
              
              {/* <div className="flex flex-col">
                <span className="text-xl font-black text-dark leading-none group-hover:text-primary transition-colors">
                  THE MOROCCAN
                </span>
                <span className="text-sm font-bold text-primary tracking-[0.2em]">
                  NETWORK
                </span>
              </div> */}
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center space-x-1 text-sm font-medium transition-colors ${
                    location.pathname === link.path ? 'text-primary' : 'text-gray-500 hover:text-dark'
                  }`}
                >
                  {link.icon}
                  <span>{link.label}</span>
                </Link>
              ))}
              <Link to="/admin" className="text-sm font-medium text-gray-400 hover:text-primary ml-4 border-l pl-4">
                Espace Admin
              </Link>
            </nav>

            {/* Mobile Menu Button */}
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden text-gray-500">
              {isMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-b border-gray-100 py-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsMenuOpen(false)}
                className="block px-4 py-3 text-base font-medium text-gray-700 hover:bg-primary-light hover:text-primary"
              >
                <div className="flex items-center space-x-3">
                  {link.icon}
                  <span>{link.label}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </header>

      {/* Contenu Dynamique */}
      <main className="grow">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-dark text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
             <span className="text-xl font-bold text-primary">THE MOROCCAN NETWORK</span>
             <p className="text-gray-400 text-sm mt-4">Fédérer et partager ensemble.</p>
          </div>
          {/* ... Autres colonnes du footer ... */}
        </div>
      </footer>
    </div>
  );
};