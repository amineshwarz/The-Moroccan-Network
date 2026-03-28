import React, { useEffect, useState } from 'react';
import { useAxios } from '../../../hooks/useAxios';
import { 
  Users, CheckCircle, Clock, GraduationCap, Search, 
  RefreshCw, Download, Mail, MoreHorizontal, 
  Euro, ChevronRight, Filter, AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const AdminSubscribersPage: React.FC = () => {
  const [subscribers, setSubscribers] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'ACTIVE' | 'PENDING'>('ALL');
  const [visibleCount, setVisibleCount] = useState(20); // Pour la pagination
  
  const { request, loading } = useAxios();

  const loadAdherents = async () => {
    try {
      const data = await request('GET', '/api/admin/subscribers');
      setSubscribers(data);
    } catch (err) { console.error(err); }
  };

  useEffect(() => { loadAdherents(); }, []);

  // --- LOGIQUE DE FILTRAGE ---
  const filteredSubscribers = subscribers.filter(s => {
    const fullName = `${s.firstName} ${s.lastName}`.toLowerCase();
    const matchesSearch = fullName.includes(searchTerm.toLowerCase()) || s.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'ALL' || s.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // On ne prend que les X premiers pour la performance
  const displayedSubscribers = filteredSubscribers.slice(0, visibleCount);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 md:space-y-10 pb-20">
      
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-dark/5 pb-8">
        <div>
          <h1 className="text-4xl md:text-6xl font-black text-dark tracking-tighter uppercase italic leading-none">
            Membres<span className="text-primary">.</span>
          </h1>
          <p className="text-gray-400 font-bold uppercase tracking-widest text-[9px] md:text-[10px] mt-2 flex items-center gap-2">
            <Users size={14} className="text-primary"/> Registre des adhésions réseau
          </p>
        </div>

        <div className="flex gap-2 w-full md:w-auto">
          <button className="flex-1 md:flex-none bg-white border border-dark text-dark px-4 py-3 font-black text-[9px] uppercase tracking-widest hover:bg-gray-50 transition-all flex items-center justify-center gap-2">
            <Download size={14} /> Export
          </button>
          <button className="flex-1 md:flex-none bg-dark text-white px-4 py-3 font-black text-[9px] uppercase tracking-widest hover:bg-primary transition-all flex items-center justify-center gap-2">
            <Mail size={14} /> Email
          </button>
        </div>
      </div>

      {/* --- STATS BENTO (Responsive Grid) --- */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-dark p-6 text-white border-l-4 border-primary">
              <p className="text-primary font-black text-[9px] uppercase tracking-widest mb-1 italic">Trésorerie</p>
              <h2 className="text-2xl font-black tracking-tighter">
                {subscribers.filter(s => s.status === 'ACTIVE').reduce((acc, curr) => acc + curr.amount, 0)}€
              </h2>
          </div>
          <div className="bg-white border border-gray-200 p-6">
              <p className="text-gray-400 font-black text-[9px] uppercase tracking-widest mb-1">Membres Actifs</p>
              <h3 className="text-2xl font-black text-dark tracking-tighter">{subscribers.filter(s => s.status === 'ACTIVE').length}</h3>
          </div>
          <div className="bg-primary-light/30 border border-primary/10 p-6">
              <p className="text-primary font-black text-[9px] uppercase tracking-widest mb-1">En attente</p>
              <h3 className="text-2xl font-black text-dark tracking-tighter">{subscribers.filter(s => s.status === 'PENDING').length}</h3>
          </div>
      </div>

      {/* --- SEARCH & FILTERS --- */}
      <div className="flex flex-col gap-4">
        <div className="relative w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text"
            placeholder="RECHERCHER UN NOM OU EMAIL..."
            className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 outline-none focus:border-primary font-bold text-xs uppercase tracking-widest transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex bg-gray-100 p-1 border border-dark/5 self-start overflow-x-auto max-w-full">
          {['ALL', 'ACTIVE', 'PENDING'].map((s) => (
            <button
              key={s}
              onClick={() => {setFilterStatus(s as any); setVisibleCount(20);}}
              className={`px-4 py-2 text-[9px] font-black uppercase tracking-widest whitespace-nowrap transition-all ${filterStatus === s ? 'bg-dark text-white' : 'text-gray-400 hover:text-dark'}`}
            >
              {s === 'ALL' ? 'Tous' : s === 'ACTIVE' ? 'Validés' : 'Attente'}
            </button>
          ))}
        </div>
      </div>

      {/* --- LISTE DES ADHÉRENTS --- */}
      
      {/* 1. VUE MOBILE (CARDS) - visible sous 1024px (lg) */}
      <div className="lg:hidden space-y-3">
        {displayedSubscribers.map((s) => (
          <div key={s.id} className="bg-white border border-gray-100 p-5 flex justify-between items-center group relative overflow-hidden">
             <div className="flex items-center gap-4 relative z-10">
                <div className={`w-10 h-10 flex items-center justify-center font-black text-[10px] border ${s.status === 'ACTIVE' ? 'bg-dark text-primary border-primary' : 'bg-gray-50 text-gray-300'}`}>
                  {s.firstName[0]}{s.lastName[0]}
                </div>
                <div>
                   <p className="font-black text-dark uppercase italic text-sm leading-tight">{s.firstName} {s.lastName}</p>
                   <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">{s.email}</p>
                   <div className="flex items-center gap-2 mt-1">
                      <span className={`text-[8px] font-black uppercase px-2 py-0.5 border ${s.type === 'STUDENT' ? 'text-blue-500 border-blue-100' : 'text-gray-400 border-gray-100'}`}>
                        {s.type}
                      </span>
                      <span className={`w-1.5 h-1.5 rounded-full ${s.status === 'ACTIVE' ? 'bg-green-500 animate-pulse' : 'bg-primary'}`} />
                   </div>
                </div>
             </div>
             <div className="text-right relative z-10">
                <p className="font-black text-dark text-base tracking-tighter">{s.amount}€</p>
                <button className="text-gray-300 mt-1"><ChevronRight size={16}/></button>
             </div>
          </div>
        ))}
      </div>

      {/* 2. VUE DESKTOP (TABLEAU) - visible au dessus de 1024px */}
      <div className="hidden lg:block bg-white border border-gray-100 shadow-2xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-dark text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
            <tr>
              <th className="px-8 py-5">Adhérent</th>
              <th className="px-8 py-5">Catégorie</th>
              <th className="px-8 py-5">Statut Paiement</th>
              <th className="px-8 py-5 text-right">Contribution</th>
              <th className="px-8 py-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {displayedSubscribers.map((s) => (
              <tr key={s.id} className="hover:bg-primary-light/5 transition-colors group">
                <td className="px-8 py-6">
                  <div className="flex flex-col">
                    <span className="font-black text-dark uppercase tracking-tighter text-base italic leading-none">{s.firstName} {s.lastName}</span>
                    <span className="text-[10px] text-gray-400 font-bold tracking-widest uppercase mt-1">{s.email}</span>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 border ${s.type === 'STUDENT' ? 'text-blue-600 border-blue-100 bg-blue-50/30' : 'text-gray-400 border-gray-100'}`}>
                    {s.type === 'STUDENT' ? 'Étudiant' : 'Standard'}
                  </span>
                </td>
                <td className="px-8 py-6">
                  <div className="flex items-center gap-2">
                    <div className={`w-1.5 h-1.5 rounded-full ${s.status === 'ACTIVE' ? 'bg-green-500 animate-pulse' : 'bg-primary'}`} />
                    <span className="text-[9px] font-black text-dark uppercase tracking-widest">{s.status === 'ACTIVE' ? 'Validé' : 'En attente'}</span>
                  </div>
                </td>
                <td className="px-8 py-6 text-right font-black text-dark text-lg tracking-tighter">
                  {s.amount}€
                </td>
                <td className="px-8 py-6 text-right">
                  <button className="p-2 text-gray-300 hover:text-dark transition-colors">
                    <MoreHorizontal size={20} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* --- PAGINATION / LOAD MORE --- */}
      {filteredSubscribers.length > visibleCount && (
        <div className="flex justify-center pt-6">
          <button 
            onClick={() => setVisibleCount(prev => prev + 20)}
            className="px-10 py-4 bg-gray-50 border border-gray-200 text-dark font-black text-[10px] uppercase tracking-[0.3em] hover:bg-dark hover:text-white transition-all shadow-sm"
          >
            Afficher les suivants ({filteredSubscribers.length - visibleCount} restants)
          </button>
        </div>
      )}

      {/* --- EMPTY STATE --- */}
      {!loading && filteredSubscribers.length === 0 && (
        <div className="py-20 text-center border-2 border-dashed border-gray-100">
           <AlertCircle className="mx-auto text-gray-200 mb-4" size={40} />
           <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Aucun résultat pour cette recherche</p>
        </div>
      )}

    </motion.div>
  );
};