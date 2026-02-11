import React from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { Menu, X, Users, Calendar, Ticket, LayoutDashboard, LogOut, Home, Info, Mail, Newspaper, HeartHandshake } from 'lucide-react';

// --- PUBLIC LAYOUT ---

export const PublicLayout: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
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
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold text-lg">A</div>
              <span className="text-xl font-bold text-gray-900">AssoConnect</span>
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
              <Link to="/admin" className="text-sm font-medium text-gray-400 hover:text-gray-600 ml-4 border-l pl-4">
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
                className="block px-4 py-3 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-primary"
              >
                <div className="flex items-center space-x-3">
                  {link.icon}
                  <span>{link.label}</span>
                </div>
              </Link>
            ))}
             <Link
                to="/admin"
                onClick={() => setIsMenuOpen(false)}
                className="block px-4 py-3 text-base font-medium text-gray-400 hover:bg-gray-50"
              >
                Connexion Admin
              </Link>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="grow">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-dark text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
               <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold text-lg">A</div>
               <span className="text-xl font-bold">AssoConnect</span>
            </div>
            <p className="text-gray-400 text-sm">
              Fédérer, agir et partager ensemble pour un monde plus solidaire.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Navigation</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><Link to="/" className="hover:text-primary transition-colors">Accueil</Link></li>
              <li><Link to="/adhesion" className="hover:text-primary transition-colors">Adhérer</Link></li>
              <li><Link to="/evenements" className="hover:text-primary transition-colors">Événements</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Légal</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><Link to="#" className="hover:text-primary transition-colors">Mentions légales</Link></li>
              <li><Link to="#" className="hover:text-primary transition-colors">Politique de confidentialité</Link></li>
              <li><Link to="#" className="hover:text-primary transition-colors">Statuts de l'association</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Contact</h3>
            <p className="text-gray-400 text-sm">
              10 Rue de la République<br/>
              69001 Lyon<br/>
              contact@assoconnect.org
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

// --- ADMIN LAYOUT ---

export const AdminLayout: React.FC = () => {
  const location = useLocation();

  const adminLinks = [
    { label: 'Tableau de bord', path: '/admin/dashboard', icon: <LayoutDashboard size={20} /> },
    { label: 'Gestion Événements', path: '/admin/events', icon: <Calendar size={20} /> },
    { label: 'Billetterie', path: '/admin/ticketing', icon: <Ticket size={20} /> },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-dark text-white hidden md:flex flex-col">
        <div className="p-6 border-b border-gray-800">
          <span className="text-xl font-bold">Admin Panel</span>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          {adminLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                location.pathname === link.path
                  ? 'bg-primary text-white'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }`}
            >
              {link.icon}
              <span>{link.label}</span>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-800">
          <Link to="/" className="flex items-center space-x-3 px-4 py-3 text-red-400 hover:bg-gray-800 rounded-lg transition-colors">
            <LogOut size={20} />
            <span>Déconnexion</span>
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Header for Admin */}
        <header className="md:hidden bg-dark text-white p-4 flex justify-between items-center">
             <span className="font-bold">Admin Panel</span>
             <Link to="/" className="text-sm bg-gray-800 px-3 py-1 rounded">Quitter</Link>
        </header>

        <main className="flex-1 overflow-auto p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};