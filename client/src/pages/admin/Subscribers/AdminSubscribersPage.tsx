import React from 'react';
import { Users, DollarSign, Search } from 'lucide-react';

export const AdminSubscribersPage: React.FC = () => {
  // Ici on garde tes anciennes lignes de test
  const rows = [1, 2, 3, 4, 5];

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-dark">Gestion des <span className="text-primary">Adhérents</span></h1>

      {/* Les stats rapides que tu avais */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border-l-4 border-primary shadow-sm">
          <p className="text-gray-500 font-medium text-sm">Total Adhérents HelloAsso</p>
          <p className="text-3xl font-bold text-dark mt-2">124</p>
        </div>
        {/* ... Autres stats ... */}
      </div>

      {/* Le tableau des membres que tu avais */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-50 flex justify-between items-center">
          <h2 className="text-lg font-bold text-dark">Liste des paiements validés</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input type="text" placeholder="Rechercher..." className="pl-9 pr-4 py-1 border rounded-full text-sm outline-none focus:ring-1 focus:ring-primary" />
          </div>
        </div>
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-bold">
            <tr>
              <th className="px-6 py-4">Nom / Email</th>
              <th className="px-6 py-4">Statut HelloAsso</th>
              <th className="px-6 py-4">Date de paiement</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {rows.map((i) => (
              <tr key={i} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-bold text-dark">Adhérent Test {i}</td>
                <td className="px-6 py-4">
                  <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-[10px] font-bold uppercase">Active</span>
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