import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAxios } from '../../../hooks/useAxios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, Users, DollarSign, Download, 
  Search, Mail, UserCheck, ChevronLeft, MoreHorizontal 
} from 'lucide-react';

export const AdminEventDetailsPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { request, loading } = useAxios();
  const [data, setData] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const res = await request('GET', `/api/admin/events/${id}/tickets`);
      setData(res);
    };
    fetchData();
  }, [id]);

  // Filtrage des participants en temps réel
  const filteredParticipants = data?.participants.filter((p: any) => 
    `${p.firstName} ${p.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading && !data) return (
    <div className="h-screen flex items-center justify-center bg-dark">
      <motion.div 
        animate={{ rotate: 360 }} 
        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
        className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full"
      />
    </div>
  );

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-7xl mx-auto space-y-8 pb-20"
    >
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <button 
          onClick={() => navigate('/admin/events')}
          className="flex items-center gap-2 text-gray-400 hover:text-primary transition-colors font-medium group w-fit"
        >
          <ChevronLeft className="group-hover:-translate-x-1 transition-transform" />
          Retour aux événements
        </button>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 bg-white/5 hover:bg-white/10 text-white px-4 py-2 rounded-xl border border-white/10 transition-all text-sm font-semibold">
            <Download size={18} /> Exporter CSV
          </button>
        </div>
      </div>

      <header>
        <h1 className="text-4xl font-black text-amber-950 tracking-tight uppercase italic ">
          {data?.eventTitle}
        </h1>
        <p className="text-gray-500 font-medium">Liste nominative des participants certifiée.</p>
      </header>

      {/* --- STATS CARDS (Stripe Style) --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Participants', value: data?.ticketsSold, total: data?.capacity, icon: <Users />, color: 'text-blue-400' },
          { label: 'Revenu Total', value: `${data?.totalRevenue}€`, icon: <DollarSign />, color: 'text-green-400' },
          { label: 'Taux de remplissage', value: `${Math.round((data?.ticketsSold / data?.capacity) * 100)}%`, icon: <UserCheck />, color: 'text-primary' },
        ].map((stat, i) => (
          <div key={i} className="bg-dark border border-white/5 p-6 shadow-2xl relative overflow-hidden group">
            <div className="relative z-10 flex justify-between items-start">
              <div>
                <p className="text-gray-500 text-xs font-black uppercase tracking-widest mb-1">{stat.label}</p>
                <h3 className="text-3xl font-bold text-white">{stat.value} {stat.total && <span className="text-sm text-gray-600">/ {stat.total}</span>}</h3>
              </div>
              <div className={`p-3 bg-white/5 rounded-2xl ${stat.color}`}>{stat.icon}</div>
            </div>
            <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-white/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors" />
          </div>
        ))}
      </div>

      {/* --- LIST SECTION --- */}
      <div className="bg-dark/50 backdrop-blur-xl border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-white/5 flex flex-col md:flex-row justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
            <input 
              type="text" 
              placeholder="Rechercher un nom ou un email..."
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-white outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5 text-[10px] uppercase tracking-[0.2em] font-black text-gray-400">
                <th className="px-8 py-5">Participant</th>
                <th className="px-8 py-5">Catégorie</th>
                <th className="px-8 py-5">Prix Payé</th>
                <th className="px-8 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              <AnimatePresence>
                {filteredParticipants?.map((p: any) => (
                  <motion.tr 
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    key={p.id} 
                    className="hover:bg-white/2 transition-colors group"
                  >
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-linear-to-tr from-primary to-red-400 flex items-center justify-center text-white font-black text-xs">
                          {p.firstName[0]}{p.lastName[0]}
                        </div>
                        <div>
                          <p className="text-white font-bold tracking-tight">{p.firstName} {p.lastName}</p>
                          <p className="text-gray-500 text-xs flex items-center gap-1"><Mail size={12}/> {p.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className="bg-white/5 text-gray-300 px-3 py-1 rounded-lg text-[10px] font-black uppercase border border-white/10">
                        {p.category}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <span className="text-white font-black text-sm">{p.amount} €</span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <button className="p-2 text-gray-600 hover:text-white transition-colors">
                        <MoreHorizontal size={20} />
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
};