import React, { useState } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { Menu, X, Home, Calendar, Mail, Newspaper, HeartHandshake } from 'lucide-react';

export const PublicLayout: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { label: 'Accueil', path: '/', icon: <Home size={18} /> },
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
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold text-lg">M</div>
              <span className="text-xl font-bold text-dark">Moroccan 4 Life</span>
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
             <span className="text-xl font-bold text-primary">Moroccan 4 Life</span>
             <p className="text-gray-400 text-sm mt-4">Fédérer et partager ensemble.</p>
          </div>
          {/* ... Autres colonnes du footer ... */}
        </div>
      </footer>
    </div>
  );
};