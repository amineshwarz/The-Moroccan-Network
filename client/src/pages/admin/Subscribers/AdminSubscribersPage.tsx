import React, { useEffect, useState } from 'react';
import { useAxios } from '../../../hooks/useAxios';
import { Users, CheckCircle, Clock, GraduationCap, Search, RefreshCw, Euro } from 'lucide-react';

export const AdminSubscribersPage: React.FC = () => {
  const [subscribers, setSubscribers] = useState<any[]>([]);
  const { request, loading, error } = useAxios();

  const loadAdherents = async () => {
    try {
      const data = await request('GET', '/api/admin/subscribers');
      setSubscribers(data);
    } catch (err) {
      console.error("Erreur chargement", err);
    }
  };

  useEffect(() => {
    loadAdherents();
  }, []);

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-dark italic">
            Liste des <span className="text-primary uppercase tracking-tighter">Adhérents</span>
          </h1>
          <p className="text-gray-400 text-sm">Gestion des adhésions HelloAsso</p>
        </div>
        <button 
          onClick={loadAdherents}
          className="p-3 bg-white text-primary rounded-2xl shadow-sm hover:bg-primary hover:text-white transition-all"
        >
          <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      {/* TABLEAU */}
      <div className="bg-white rounded-[2.5rem] shadow-xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-dark text-white text-xs uppercase font-bold tracking-widest">
              <tr>
                <th className="px-6 py-5">Adhérent</th>
                <th className="px-6 py-5">Formule</th>
                <th className="px-6 py-5">Statut</th>
                <th className="px-6 py-5 text-right">Montant</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {subscribers.length === 0 && !loading && (
                <tr>
                  <td colSpan={4} className="p-20 text-center text-gray-400 font-medium">
                    Aucun adhérent trouvé pour le moment.
                  </td>
                </tr>
              )}

              {subscribers.map((s) => (
                <tr key={s.id} className="hover:bg-gray-50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-bold text-dark text-lg capitalize">{s.firstName} {s.lastName}</span>
                      <span className="text-xs text-gray-400">{s.email}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {s.type === 'STUDENT' ? (
                        <span className="flex items-center gap-1.5 bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-[10px] font-black uppercase">
                          <GraduationCap size={14} /> Étudiant
                        </span>
                      ) : (
                        <span className="flex items-center gap-1.5 bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-[10px] font-black uppercase">
                          <Users size={14} /> Standard
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {s.status === 'ACTIVE' ? (
                      <span className="inline-flex items-center gap-1.5 text-green-600 font-bold text-xs">
                        <CheckCircle size={16} /> PAIEMENT VALIDÉ
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-primary font-bold text-xs animate-pulse">
                        <Clock size={16} /> EN ATTENTE
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right font-black text-dark">
                    {s.amount} €
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* STATS RAPIDES (Bas de page) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-primary-light/30 p-6 rounded-[2rem] border border-primary/10">
              <p className="text-primary font-bold text-xs uppercase tracking-widest mb-1">Total Récolté</p>
              <p className="text-2xl font-black text-dark">
                {subscribers.filter(s => s.status === 'ACTIVE').reduce((acc, curr) => acc + curr.amount, 0)} €
              </p>
          </div>
          <div className="bg-dark p-6 rounded-[2rem] text-white">
              <p className="text-primary font-bold text-xs uppercase tracking-widest mb-1">Nombre d'adhérents</p>
              <p className="text-2xl font-black">{subscribers.filter(s => s.status === 'ACTIVE').length}</p>
          </div>
      </div>
    </div>
  );
};