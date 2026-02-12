import React from 'react';
import { Plus, Edit2, Trash2, Calendar as CalendarIcon, MapPin } from 'lucide-react';

export const AdminEvents: React.FC = () => {
  const rows = [1, 2, 3]; // Simule 3 événements

  return (
    <div className="space-y-6">
      {/* Header avec bouton d'action */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-dark">Gestion des Événements</h1>
        <button className="flex items-center space-x-2 bg-primary text-white px-4 py-2 rounded-lg font-bold hover:bg-dark transition shadow-lg">
          <Plus size={20} />
          <span>Nouvel Événement</span>
        </button>
      </div>

      {/* Liste des événements sous forme de tableau */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-bold">
              <tr>
                <th className="px-6 py-4">Événement</th>
                <th className="px-6 py-4">Date & Lieu</th>
                <th className="px-6 py-4">Remplissage</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {rows.map((i) => (
                <tr key={i} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className={`w-12 h-12 rounded-lg ${i % 2 === 0 ? 'bg-primary' : 'bg-dark'} shrink-0 opacity-20`}></div>
                      <div className="h-4 bg-gray-200 rounded w-32"></div> {/* Titre simulé */}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-2">
                      <div className="flex items-center text-xs text-gray-400">
                        <CalendarIcon size={14} className="mr-1" /> 12/03/2024
                      </div>
                      <div className="flex items-center text-xs text-gray-400">
                        <MapPin size={14} className="mr-1" /> Lyon, France
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="w-full max-w-[150px]">
                      <div className="flex justify-between text-[10px] font-bold mb-1 text-dark">
                        <span>{i * 25}%</span>
                        <span>{i * 25}/100</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full" 
                          style={{ width: `${i * 25}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end space-x-2">
                      <button className="p-2 text-gray-400 hover:text-primary transition"><Edit2 size={18} /></button>
                      <button className="p-2 text-gray-400 hover:text-red-600 transition"><Trash2 size={18} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};