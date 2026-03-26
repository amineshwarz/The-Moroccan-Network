import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Target, Users, Globe, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const AboutPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-white min-h-screen">
      {/* --- SECTION HERO : L'HISTOIRE --- */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.span 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="text-primary font-black uppercase tracking-[0.4em] text-xs block mb-8"
          >
            Qui sommes-nous
          </motion.span>
          <motion.h1 
            initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
            className="text-6xl md:text-8xl font-black text-dark tracking-tighter leading-[0.85] uppercase italic"
          >
            Bâtir un pont entre <br />
            <span className="text-primary">nos ambitions.</span>
          </motion.h1>
          
          <motion.div 
            initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-20"
          >
            <p className="text-2xl text-dark font-medium leading-tight">
              The Moroccan Network est né d'une volonté simple : fédérer les talents et les énergies de la communauté pour créer un impact réel.
            </p>
            <p className="text-gray-500 leading-relaxed">
              Nous croyons en la force du collectif. Notre association accompagne les porteurs de projets, organise des rencontres inspirantes et soutient les initiatives qui font rayonner notre culture et nos valeurs.
            </p>
          </motion.div>
        </div>
      </section>

      {/* --- SECTION VALEURS (Bento Grid Style) --- */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: "Réseautage", desc: "Connecter les professionnels et les étudiants pour créer des opportunités.", icon: <Users className="text-primary" size={32}/> },
              { title: "Impact", desc: "Chaque action que nous menons est pensée pour apporter une valeur concrète.", icon: <Target className="text-primary" size={32}/> },
              { title: "Rayonnement", desc: "Promouvoir l'excellence marocaine partout où nous sommes présents.", icon: <Globe className="text-primary" size={32}/> }
            ].map((val, i) => (
              <motion.div 
                key={i} whileHover={{ y: -10 }}
                className="bg-white p-10 rounded-[3rem] shadow-xl border border-gray-100"
              >
                <div className="mb-6">{val.icon}</div>
                <h3 className="text-2xl font-black text-dark uppercase italic mb-4 tracking-tighter">{val.title}</h3>
                <p className="text-gray-500 font-medium">{val.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- SECTION L'ÉQUIPE (Humanisation) --- */}
      <section className="py-32 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-20 items-center">
            <div className="flex-1 space-y-6">
                <h2 className="text-5xl font-black text-dark tracking-tighter uppercase italic">
                    Un bureau <br /><span className="text-primary text-6xl">engagé.</span>
                </h2>
                <p className="text-gray-500 text-lg font-medium">
                    The Moroccan Network est piloté par une équipe de bénévoles passionnés, issus de divers horizons professionnels, unis par un objectif commun.
                </p>
                <button 
                    onClick={() => navigate('/adhesion')}
                    className="flex items-center gap-4 text-dark font-black uppercase tracking-widest text-sm group"
                >
                    Rejoindre l'équipe <ArrowRight className="text-primary group-hover:translate-x-2 transition-transform" />
                </button>
            </div>
            <div className="flex-1 grid grid-cols-2 gap-4">
                {/* Carrés design pour l'équipe */}
                <div className="aspect-square bg-dark  flex items-center justify-center p-8">
                    <p className="text-white font-black text-center text-sm uppercase tracking-widest">Président</p>
                </div>
                <div className="aspect-square bg-primary-light  flex items-center justify-center p-8">
                    <p className="text-primary font-black text-center text-sm uppercase tracking-widest">Secrétariat</p>
                </div>
                <div className="aspect-square bg-gray-100  flex items-center justify-center p-8">
                    <p className="text-gray-400 font-black text-center text-sm uppercase tracking-widest">Trésorerie</p>
                </div>
                <div className="aspect-square bg-primary flex items-center justify-center p-8">
                    <p className="text-white font-black text-center text-sm uppercase tracking-widest">Événementiel</p>
                </div>
            </div>
        </div>
      </section>
    </div>
  );
};