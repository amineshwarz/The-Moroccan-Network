import React from 'react';
import { useAuth } from '../../../context/AuthContext';
import { LayoutDashboard, Star } from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      {/* Hero Welcome Section */}
      <div className="bg-dark text-white p-12 rounded-4xl shadow-2xl relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4 text-primary">
            <Star fill="currentColor" size={24} />
            <span className="font-bold tracking-widest text-sm uppercase">Espace Gestion</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Heureux de vous revoir, <br />
            <span className="text-primary italic">{user?.firstName} {user?.lastName}</span>
          </h1>
          <p className="text-gray-400 max-w-md">
            Ceci est votre interface privée Moroccan 4 Life. Utilisez le menu à gauche pour naviguer.
          </p>
        </div>
        {/* Cercles de couleurs décoratifs */}
        <div className="absolute top-[-20%] right-[-10%] w-80 h-80 bg-primary rounded-full opacity-10 blur-3xl"></div>
      </div>

      {/* Grille de placeholders colorés */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="h-64 bg-primary-light/30 border-2 border-primary/20 border-dashed rounded-4xl flex flex-col items-center justify-center text-primary">
           <LayoutDashboard size={48} className="mb-4 opacity-20" />
           <p className="font-bold opacity-40 uppercase tracking-tighter">Flux d'activités bientôt disponible</p>
        </div>
        <div className="h-64 bg-white shadow-sm border border-gray-100 rounded-4xl p-8">
           <div className="h-4 bg-gray-100 rounded-full w-1/2 mb-4"></div>
           <div className="h-4 bg-gray-50 rounded-full w-full mb-2"></div>
           <div className="h-4 bg-gray-50 rounded-full w-5/6"></div>
        </div>
      </div>
    </div>
  );
};