import React, { useEffect, useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useAxios } from '../../../hooks/useAxios';
import { motion, Variants } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  TrendingUp, Users, Ticket, DollarSign, 
  ArrowUpRight, Activity, Zap, ChevronRight
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const { request } = useAxios();
  const [stats, setStats] = useState<any>(null);
  const navigate = useNavigate();

  // Fonction pour charger les statistiques réelles depuis le contrôleur Symfony
  const fetchStats = async () => {
    try {
      const data = await request('GET', '/api/admin/stats');
      setStats(data);
    } catch (err) {
      console.error("Erreur chargement statistiques:", err);
    }
  };

  useEffect(() => {
    fetchStats();
    // Rafraîchissement automatique toutes les minutes pour l'aspect "Live"
    const interval = setInterval(fetchStats, 60000);
    return () => clearInterval(interval);
  }, []);

  // Configuration des animations (Entrée en cascade)
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants: Variants = {
    hidden: { y: 15, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <div className="space-y-10 pb-20">
      
      {/* --- HEADER DE LA TOUR DE CONTRÔLE --- */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-dark/5 pb-10">
        <div className="space-y-1">
          <motion.h1 
            initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
            className="text-6xl font-black text-dark tracking-tighter uppercase italic leading-none"
          >
            Aperçu <span className="text-primary">Global.</span>
          </motion.h1>
          <p className="text-gray-400 font-bold uppercase tracking-[0.3em] text-[10px] flex items-center gap-2">
            Terminal de direction — <span className="text-dark">{user?.firstName} {user?.lastName}</span>
          </p>
        </div>
        
        {/* Indicateur de statut système */}
        <div className="flex items-center gap-4 bg-white border border-gray-100 p-2 pr-6 rounded-full shadow-sm">
            <div className="w-10 h-10 bg-primary/10 text-primary rounded-full flex items-center justify-center">
                <Zap size={20} fill="currentColor" />
            </div>
            <div className="text-left leading-tight">
                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Flux Réseau</p>
                <p className="text-xs font-bold text-green-500 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" /> Live Automatique
                </p>
            </div>
        </div>
      </header>

      {/* --- GRILLE BENTO (CARTES CLIQUABLES) --- */}
      <motion.div 
        variants={containerVariants} initial="hidden" animate="show"
        className="grid grid-cols-1 md:grid-cols-12 gap-8"
      >
        
        {/* CARTE 1 : TRÉSORERIE DÉTAILLÉE (Cliquable vers Finance/Ticketing) */}
        <motion.div 
          variants={itemVariants} 
          onClick={() => navigate('/admin/ticketing')}
          className="md:col-span-12 lg:col-span-8 bg-dark p-12 text-white relative overflow-hidden shadow-2xl border border-white/5 cursor-pointer group rounded-2xl"
        >
          <div className="relative z-10 flex flex-col h-full">
            <div className="flex justify-between items-start mb-12">
               <div>
                  <p className="text-primary font-black uppercase tracking-[0.4em] text-[10px] mb-2 italic">Volume de Transactions</p>
                  <h2 className="text-7xl font-black tracking-tighter italic leading-none">
                    {stats?.totals?.global || 0}€
                  </h2>
               </div>
               <div className="p-5 bg-white/5 border border-white/10 rounded-2xl group-hover:bg-primary group-hover:border-primary transition-all duration-500">
                 <DollarSign className="text-primary group-hover:text-white" size={40} />
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 border-t border-white/10 pt-10 mt-auto">
                {/* Part Adhésion */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <p className="text-gray-500 font-bold text-[10px] uppercase tracking-widest">Membres Annuels</p>
                        <div className="flex items-center text-green-400 text-[10px] font-black bg-green-400/10 px-2 py-0.5 border border-green-400/20">
                           <TrendingUp size={12} className="mr-1"/> +{stats?.growth?.membership || 0}%
                        </div>
                    </div>
                    <p className="text-4xl font-black text-white tracking-tight leading-none">{stats?.totals?.membership || 0}€</p>
                    <div className="w-full bg-white/5 h-1.5 rounded-none overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }} 
                          animate={{ width: stats?.totals?.global ? `${(stats.totals.membership / stats.totals.global) * 100}%` : 0 }} 
                          className="h-full bg-white/30" 
                        />
                    </div>
                </div>

                {/* Part Billetterie */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <p className="text-gray-500 font-bold text-[10px] uppercase tracking-widest">Billetterie Events</p>
                        <div className="flex items-center text-primary text-[10px] font-black bg-primary/10 px-2 py-0.5 border border-primary/20">
                           <TrendingUp size={12} className="mr-1"/> +{stats?.growth?.ticketing || 0}%
                        </div>
                    </div>
                    <p className="text-4xl font-black text-white tracking-tight leading-none">{stats?.totals?.ticketing || 0}€</p>
                    <div className="w-full bg-white/5 h-1.5 rounded-none overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }} 
                          animate={{ width: stats?.totals?.global ? `${(stats.totals.ticketing / stats.totals.global) * 100}%` : 0 }} 
                          className="h-full bg-primary shadow-[0_0_15px_rgba(255,51,0,0.4)]" 
                        />
                    </div>
                </div>
            </div>
          </div>
          {/* Décor Glass discret */}
          <div className="absolute top-[-20%] right-[-10%] w-96 h-96 bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
        </motion.div>

        {/* CARTE 2 : MEMBRES (Cliquable vers Adhérents) */}
        <motion.div 
          variants={itemVariants} 
          onClick={() => navigate('/admin/adherents')}
          className="md:col-span-12 lg:col-span-4 bg-white border border-gray-100 p-12 flex flex-col justify-between shadow-xl group hover:border-dark transition-all duration-500 cursor-pointer rounded-2xl"
        >
          <div className="flex justify-between items-start">
            <div className="p-5 bg-gray-50 text-dark border border-gray-100 group-hover:bg-dark group-hover:text-white transition-all duration-500 rounded-2xl">
                <Users size={32}/>
            </div>
            <ArrowUpRight className="text-gray-300 group-hover:text-primary transition-colors" size={24} />
          </div>
          <div>
            <h3 className="text-8xl font-black text-dark tracking-tighter leading-none">{stats?.activeMembers || 0}</h3>
            <p className="text-gray-400 font-bold uppercase text-[10px] tracking-[0.3em] mt-6 italic">Adhérents Actifs</p>
          </div>
        </motion.div>

        {/* CARTE 3 : PROCHAIN ÉVÉNEMENT (Cliquable vers les participants) */}
        <motion.div 
          variants={itemVariants} 
          onClick={() => stats?.eventHealth?.id ? navigate(`/admin/events/${stats.eventHealth.id}/tickets`) : navigate('/admin/events')}
          className="md:col-span-12 lg:col-span-7 bg-white border border-gray-100 p-12 shadow-xl relative overflow-hidden cursor-pointer group hover:border-primary transition-all rounded-2xl"
        >
          <div className="relative z-10 flex flex-col h-full">
            <div className="flex items-center gap-3 mb-8">
                <div className="p-2 bg-primary/10 text-primary rounded-lg"><Activity size={16} /></div>
                <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Prochain Événement Officiel</h3>
            </div>
            
            <p className="text-4xl font-black text-dark uppercase italic tracking-tighter mb-12 leading-none group-hover:text-primary transition-colors">
                {stats?.eventHealth?.title || "Aucun événement planifié"}
            </p>
            
            <div className="space-y-6 mt-auto">
                <div className="flex justify-between items-end border-b border-gray-50 pb-4">
                    <div className="space-y-1">
                        <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest">Billets Vendus</p>
                        <p className="text-4xl font-black text-dark">{stats?.eventHealth?.sold || 0}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-primary font-black text-2xl tracking-tighter">
                            {stats?.eventHealth?.sold && stats?.eventHealth?.capacity 
                                ? Math.round((stats.eventHealth.sold / stats.eventHealth.capacity) * 100) 
                                : 0}%
                        </p>
                    </div>
                </div>
                {/* Barre de remplissage angulaire */}
                <div className="w-full bg-gray-100 h-3 rounded-none overflow-hidden border border-gray-200">
                    <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: stats?.eventHealth?.capacity ? `${(stats.eventHealth.sold / stats.eventHealth.capacity) * 100}%` : 0 }}
                        className="h-full bg-primary shadow-lg"
                    />
                </div>
            </div>
          </div>
        </motion.div>

        {/* CARTE 4 : RÉSUMÉ BILLETS (Cliquable vers Finance) */}
        <motion.div 
          variants={itemVariants} 
          onClick={() => navigate('/admin/ticketing')}
          className="md:col-span-12 lg:col-span-5 bg-primary-light/30 border border-primary/10 p-12 flex flex-col justify-between relative overflow-hidden group cursor-pointer rounded-2xl"
        >
           <div className="p-5 bg-white border border-primary/5 w-fit shadow-lg rounded-2xl group-hover:bg-primary transition-all duration-500">
             <Ticket className="text-primary group-hover:text-white" size={28} />
           </div>
           <div className="mt-12">
              <h3 className="text-7xl font-black text-dark tracking-tighter leading-none">{stats?.totalTickets || 0}</h3>
              <p className="text-primary font-black uppercase text-[10px] tracking-[0.3em] mt-6 italic">Total Billets délivrés</p>
           </div>
           <ChevronRight className="absolute bottom-12 right-12 text-primary opacity-20 group-hover:translate-x-2 transition-all" size={40} />
        </motion.div>

      </motion.div>
    </div>
  );
};