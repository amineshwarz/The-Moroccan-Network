import React from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { LayoutDashboard, Calendar, Ticket, LogOut } from 'lucide-react';

export const AdminLayout: React.FC = () => {
  const location = useLocation();

  const adminLinks = [
    { label: 'Tableau de bord', path: '/admin/dashboard', icon: <LayoutDashboard size={20} /> },
    { label: 'Événements', path: '/admin/events', icon: <Calendar size={20} /> },
    { label: 'Billetterie', path: '/admin/ticketing', icon: <Ticket size={20} /> },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-dark text-white hidden md:flex flex-col">
        <div className="p-6 border-b border-white/10">
          <span className="text-xl font-bold text-primary">Admin Panel</span>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          {adminLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                location.pathname === link.path
                  ? 'bg-primary text-white'
                  : 'text-gray-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              {link.icon}
              <span>{link.label}</span>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10">
          <Link to="/" className="flex items-center space-x-3 px-4 py-3 text-primary hover:bg-white/5 rounded-lg transition-colors">
            <LogOut size={20} />
            <span>Quitter l'admin</span>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-auto p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};