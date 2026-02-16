import React from 'react';
import { Users, DollarSign, Activity, Search } from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const rows = [1, 2, 3, 4, 5]; // Placeholders pour les membres
  const userData = JSON.parse(localStorage.getItem('user') || '{}');

  return (
    <div className="space-y-8">
      
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-dark">
          Tableau de bord de <span className="text-primary">{userData.firstName} {userData.lastName}</span>
        </h1>
        <span className="bg-primary-light text-primary px-3 py-1 rounded-full text-xs font-bold uppercase">
          {userData.roles?.includes('ROLE_ADMIN') ? 'Administrateur' : 'Membre Bureau'}
        </span>
      </div>
      
      {/* Stats rapides */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border-l-4 border-primary shadow-sm">
          <div className="flex justify-between items-start">
            <p className="text-gray-500 font-medium">Adhérents Actifs</p>
            <Users className="text-primary" size={20} />
          </div>
          <p className="text-3xl font-bold text-dark mt-2">124</p>
        </div>
        <div className="bg-white p-6 rounded-xl border-l-4 border-dark shadow-sm">
          <div className="flex justify-between items-start">
            <p className="text-gray-500 font-medium">Recettes (Mois)</p>
            <DollarSign className="text-primary" size={20} />
          </div>
          <p className="text-3xl font-bold text-dark mt-2">1,250€</p>
        </div>
      </div>

      {/* Tableau des membres récents */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-50 flex justify-between items-center">
          <h2 className="text-lg font-bold text-dark">Dernières adhésions</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input type="text" placeholder="Chercher..." className="pl-9 pr-4 py-1 border rounded-full text-sm outline-none focus:ring-1 focus:ring-primary" />
          </div>
        </div>
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-bold">
            <tr>
              <th className="px-6 py-4">Membre</th>
              <th className="px-6 py-4">Statut</th>
              <th className="px-6 py-4">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {rows.map((i) => (
              <tr key={i} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-primary-light text-primary flex items-center justify-center font-bold text-xs">U{i}</div>
                    <div className="text-sm font-bold text-dark">Utilisateur Test {i}</div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${i % 2 === 0 ? 'bg-green-100 text-green-700' : 'bg-primary-light text-primary'}`}>
                    {i % 2 === 0 ? 'Active' : 'Pending'}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">14/02/2024</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};