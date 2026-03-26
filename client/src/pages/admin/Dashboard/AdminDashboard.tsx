import React, { useEffect, useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useAxios } from '../../../hooks/useAxios';
import { motion, Variants } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  TrendingUp, Users, Ticket, DollarSign, 
  ArrowUpRight, Star, Activity, RefreshCw, ChevronRight, Zap
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const { request } = useAxios();
  const [stats, setStats] = useState<any>(null);
  const navigate = useNavigate();

  const fetchStats = async () => {
    try {
      const data = await request('GET', '/api/admin/stats');
      setStats(data);
    } catch (err) {
      console.error("Erreur stats:", err);
    }
  };

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 60000);
    return () => clearInterval(interval);
  }, []);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.08 } }
  };

  const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 260, damping: 20 } }
  };

  return (
    <div className="space-y-10 pb-20">
      {/* --- HEADER --- */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div className="space-y-1">
          <motion.h1 
            initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
            className="text-6xl font-black text-dark tracking-tighter uppercase italic"
          >
            Aperçu <span className="text-primary italic">Global</span>
          </motion.h1>
          <p className="text-gray-400 font-medium flex items-center gap-2 tracking-wide uppercase text-xs">
            Directeur : <span className="text-dark font-black uppercase">{user?.firstName} {user?.lastName}</span>
          </p>
        </div>
        
        <div className="flex items-center gap-4 bg-white p-2 pr-6 rounded-full shadow-sm border border-gray-100">
            <div className="w-10 h-10 bg-primary/10 text-primary rounded-full flex items-center justify-center">
                <Zap size={20} fill="currentColor" />
            </div>
            <div className="text-left">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Mise à jour</p>
                <p className="text-xs font-bold text-green-500 flex items-center gap-1">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" /> Live Automatique
                </p>
            </div>
        </div>
      </header>

      {/* --- GRILLE BENTO --- */}
      <motion.div variants={containerVariants} initial="hidden" animate="show" className="grid grid-cols-1 md:grid-cols-12 gap-8">
        
        {/* CARTE 1 : CHIFFRE D'AFFAIRES (Cliquable vers Billetterie) */}
        <motion.div 
          variants={itemVariants} 
          onClick={() => navigate('/admin/ticketing')}
          className="md:col-span-12 lg:col-span-8 bg-dark rounded-2xl p-12 text-white relative overflow-hidden shadow-2xl border border-white/5 cursor-pointer group"
        >
          <div className="relative z-10 flex flex-col h-full">
            <div className="flex justify-between items-start mb-12">
               <div>
                  <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.3em] mb-2">Total Récolté (Cumulé)</p>
                  <h2 className="text-7xl font-black tracking-tighter italic">{stats?.totals?.global || 0}€</h2>
               </div>
               <div className="p-5 bg-white/10 rounded-2rem backdrop-blur-md group-hover:bg-primary transition-colors">
                 <DollarSign className="text-primary group-hover:text-white" size={40} />
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 border-t border-white/10 pt-10 mt-auto">
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <p className="text-gray-500 font-bold text-[10px] uppercase tracking-widest">Part Adhésions</p>
                        <div className="flex items-center text-green-400 text-xs font-black bg-green-400/10 px-3 py-1 rounded-full">
                            <TrendingUp size={14} className="mr-1"/> +{stats?.growth?.membership || 0}%
                        </div>
                    </div>
                    <p className="text-4xl font-black text-white tracking-tight">{stats?.totals?.membership || 0}€</p>
                    <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                        <motion.div initial={{ width: 0 }} animate={{ width: stats?.totals?.global ? `${(stats.totals.membership / stats.totals.global) * 100}%` : 0 }} className="h-full bg-white/40" />
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <p className="text-gray-500 font-bold text-[10px] uppercase tracking-widest">Part Billetterie</p>
                        <div className="flex items-center text-primary text-xs font-black bg-primary/10 px-3 py-1 rounded-full">
                            <TrendingUp size={14} className="mr-1"/> +{stats?.growth?.ticketing || 0}%
                        </div>
                    </div>
                    <p className="text-4xl font-black text-white tracking-tight">{stats?.totals?.ticketing || 0}€</p>
                    <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                        <motion.div initial={{ width: 0 }} animate={{ width: stats?.totals?.global ? `${(stats.totals.ticketing / stats.totals.global) * 100}%` : 0 }} className="h-full bg-primary" />
                    </div>
                </div>
            </div>
          </div>
          <div className="absolute top-[-20%] right-[-10%] w-500px h-500px bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
        </motion.div>

        {/* CARTE 2 : ADHÉRENTS (Cliquable vers Adhérents) */}
        <motion.div 
          variants={itemVariants} 
          onClick={() => navigate('/admin/adherents')}
          className="md:col-span-12 lg:col-span-4 bg-white border border-gray-100 p-12 flex flex-col justify-between shadow-xl group hover:border-primary transition-all duration-500 cursor-pointer"
        >
          <div className="flex justify-between items-start">
            <div className="p-5 bg-primary-light text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-500 rounded-2xl">
                <Users size={32}/>
            </div>
            <div className="p-3 bg-gray-50 rounded-full text-gray-300 group-hover:text-primary"><ArrowUpRight size={24} /></div>
          </div>
          <div>
            <h3 className="text-7xl font-black text-dark tracking-tighter">{stats?.activeMembers || 0}</h3>
            <p className="text-gray-400 font-bold uppercase text-[10px] tracking-[0.3em] mt-6">Membres Actifs</p>
          </div>
        </motion.div>

        {/* CARTE 3 : PROCHAIN EVENT (Cliquable vers les tickets de l'event) */}
        <motion.div 
          variants={itemVariants} 
          onClick={() => stats?.eventHealth?.id ? navigate(`/admin/events/${stats.eventHealth.id}/tickets`) : navigate('/admin/events')}
          className="md:col-span-12 lg:col-span-7 bg-white border border-gray-100 p-12 shadow-xl relative overflow-hidden cursor-pointer group hover:border-primary transition-colors"
        >
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-8 text-gray-400 group-hover:text-primary transition-colors">
                <Activity size={16} />
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em]">Prochain Événement</h3>
            </div>
            <p className="text-3xl font-black text-dark uppercase italic tracking-tighter mb-10 max-w-md">{stats?.eventHealth?.title || "Aucun événement prévu"}</p>
            <div className="space-y-6">
                <div className="flex justify-between items-end">
                    <div>
                        <p className="text-gray-400 text-[10px] font-black uppercase">Vendus</p>
                        <p className="text-3xl font-black text-dark">{stats?.eventHealth?.sold || 0}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-sm font-black text-primary italic">
                            {stats?.eventHealth?.sold && stats?.eventHealth?.capacity ? Math.round((stats.eventHealth.sold / stats.eventHealth.capacity) * 100) : 0}%
                        </p>
                    </div>
                </div>
                <div className="w-full bg-gray-50 h-5 rounded-2xl overflow-hidden border border-gray-100 p-1">
                    <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: stats?.eventHealth?.capacity ? `${(stats.eventHealth.sold / stats.eventHealth.capacity) * 100}%` : 0 }}
                        className="h-full bg-primary rounded-xl"
                    />
                </div>
            </div>
          </div>
        </motion.div>

        {/* CARTE 4 : RÉSUMÉ BILLETS */}
        <motion.div 
          variants={itemVariants} 
          onClick={() => navigate('/admin/ticketing')}
          className="md:col-span-12 lg:col-span-5 bg-primary-light/40 border border-primary/10 p-12 flex flex-col justify-between relative overflow-hidden group cursor-pointer"
        >
           <div className="p-5 bg-white w-fit shadow-lg rounded-2xl"><Ticket className="text-primary" size={28} /></div>
           <div className="mt-12">
              <h3 className="text-6xl font-black text-dark tracking-tighter">{stats?.totalTickets || 0}</h3>
              <p className="text-primary font-black uppercase text-[10px] tracking-[0.3em] mt-6">Billets délivrés</p>
           </div>
           <ChevronRight className="absolute bottom-12 right-12 text-primary opacity-20 group-hover:translate-x-2 transition-all" size={40} />
        </motion.div>

      </motion.div>
    </div>
  );
};