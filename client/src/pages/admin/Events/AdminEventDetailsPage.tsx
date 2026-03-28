import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAxios } from '../../../hooks/useAxios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, DollarSign, Download, Search, Mail, 
  UserCheck, ChevronLeft, MoreHorizontal, History 
} from 'lucide-react';

export const AdminEventDetailsPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { request, loading } = useAxios();
  const [data, setData] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await request('GET', `/api/admin/events/${id}/tickets`);
        setData(res);
      } catch (err) { console.error(err); }
    };
    fetchData();
  }, [id]);

  const filteredParticipants = data?.participants.filter((p: any) => 
    `${p.firstName} ${p.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading && !data) return (
    <div className="h-screen flex flex-col items-center justify-center bg-gray-50 gap-4">
      <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Certification des accès...</p>
    </div>
  );

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-7xl mx-auto space-y-10 pb-20">
      
      {/* NAVIGATION & HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-dark/5 pb-10">
        <div className="space-y-4">
          <button onClick={() => navigate('/admin/events')} className="flex items-center gap-2 text-gray-400 hover:text-primary transition-all text-[10px] font-black uppercase tracking-widest group">
            <ChevronLeft className="group-hover:-translate-x-1 transition-transform" /> Retour à l'agenda
          </button>
          <h1 className="text-6xl font-black text-dark tracking-tighter uppercase italic leading-[0.8]">
            Logistique<span className="text-primary">.</span>
          </h1>
          <p className="text-primary font-black uppercase tracking-[0.3em] text-xs italic">{data?.eventTitle}</p>
        </div>
        
        <button className="bg-dark text-white px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 hover:bg-primary transition-all shadow-xl">
          <Download size={16} /> Exporter la liste
        </button>
      </div>

      {/* STATS BENTO (Stripe Style) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Ventes', value: data?.ticketsSold, total: data?.capacity, icon: <Users />, color: 'text-blue-500' },
          { label: 'Recette brute', value: `${data?.totalRevenue}€`, icon: <DollarSign />, color: 'text-green-500' },
          { label: 'Taux de présence', value: `${Math.round((data?.ticketsSold / data?.capacity) * 100)}%`, icon: <UserCheck />, color: 'text-primary' },
        ].map((stat, i) => (
          <div key={i} className="bg-white border border-gray-100 p-8 rounded-xl shadow-sm relative overflow-hidden group hover:border-primary transition-colors">
            <div className="relative z-10 flex justify-between items-start">
              <div>
                <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-2 italic">{stat.label}</p>
                <h3 className="text-4xl font-black text-dark tracking-tighter leading-none">
                    {stat.value} <span className="text-xs text-gray-300">{stat.total && `/ ${stat.total}`}</span>
                </h3>
              </div>
              <div className={`p-4 bg-gray-50 rounded-2xl ${stat.color} group-hover:bg-primary group-hover:text-white transition-all`}>{stat.icon}</div>
            </div>
          </div>
        ))}
      </div>

      {/* PARTICIPANTS TABLE (Linear Style) */}
      <div className="bg-white border border-gray-100 rounded-[3rem] shadow-xl overflow-hidden">
        <div className="p-8 border-b border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-dark rounded-xl text-white"><History size={20}/></div>
                <h2 className="text-xl font-black text-dark uppercase italic tracking-tighter">Entrées validées</h2>
            </div>
            <div className="relative w-full md:w-80">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input 
                    type="text" placeholder="Rechercher un membre..."
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 font-bold text-xs uppercase"
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50/50 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
              <tr>
                <th className="px-8 py-5">Identité</th>
                <th className="px-8 py-5">Accréditation</th>
                <th className="px-8 py-5 text-right">Transaction</th>
                <th className="px-8 py-5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              <AnimatePresence mode='popLayout'>
                {filteredParticipants?.map((p: any) => (
                  <motion.tr 
                    layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    key={p.id} className="hover:bg-primary-light/10 transition-colors group"
                  >
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-dark text-primary flex items-center justify-center font-black text-[10px] border border-white/10">
                          {p.firstName[0]}{p.lastName[0]}
                        </div>
                        <div>
                          <p className="text-dark font-black uppercase tracking-tight text-sm italic">{p.firstName} {p.lastName}</p>
                          <p className="text-gray-400 text-[10px] font-bold uppercase">{p.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className="bg-gray-100 text-gray-500 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest">
                        {p.category}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <span className="text-dark font-black text-lg tracking-tighter">{p.amount} €</span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <button className="p-2 text-gray-300 hover:text-dark transition-colors"><MoreHorizontal size={18} /></button>
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