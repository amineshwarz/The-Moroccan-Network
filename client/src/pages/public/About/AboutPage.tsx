import React from 'react';
import { motion } from 'framer-motion';
import { Target, Users, Globe, ArrowRight, Award, Zap,Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const AboutPage: React.FC = () => {
  const navigate = useNavigate();

  // Animation pour les éléments de liste (stagger effect)
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="bg-white min-h-screen">
      
      {/* --- HERO SECTION : L'IDENTITÉ --- 
          Utilisation du fond Dark (Black Bean) pour la cohérence avec les autres pages
      */}
      <section className="bg-dark text-white pt-32 pb-24 px-4 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.span 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }}
            className="text-primary font-bold tracking-[0.4em] text-[10px] uppercase block mb-6"
          >
            Manifeste du Réseau
          </motion.span>
          
          <motion.h1 
            initial={{ y: 30, opacity: 0 }} 
            animate={{ y: 0, opacity: 1 }}
            className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.8] uppercase italic"
          >
            L'excellence <br />
            <span className="text-primary">en mouvement.</span>
          </motion.h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mt-20 border-t border-white/10 pt-12">
            <motion.p 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
              className="text-2xl text-white font-medium leading-tight tracking-tight"
            >
              The Moroccan Network est né d'une ambition claire : bâtir une plateforme d'influence et d'entraide pour la communauté marocaine à travers le monde.
            </motion.p>
            <motion.p 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
              className="text-gray-400 leading-relaxed font-medium italic"
            >
              Nous ne sommes pas seulement une association, nous sommes un écosystème de réussite. En fédérant les experts, les entrepreneurs et les étudiants, nous créons les synergies nécessaires pour relever les défis de demain.
            </motion.p>
          </div>
        </div>
        {/* Décor architectural de fond */}
        <div className="absolute right-0 bottom-0 w-1/3 h-full bg-primary/5 -skew-x-12 translate-x-24" />
      </section>

      {/* --- SECTION VALEURS : LES PILIERS --- 
          Design angulaire (bords droits) et contrasté
      */}
      <section className="py-24 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-0" // Gap 0 pour coller les bordures
          >
            {[
              { 
                title: "Synergie", 
                desc: "Connecter les talents pour multiplier les opportunités d'affaires et de carrière.", 
                icon: <Users size={28}/> 
              },
              { 
                title: "Inspiration", 
                desc: "Partager les parcours d'excellence pour motiver les nouvelles générations.", 
                icon: <Zap size={28}/> 
              },
              { 
                title: "Impact", 
                desc: "Agir concrètement sur le terrain social et économique par des projets structurants.", 
                icon: <Target size={28}/> 
              }
            ].map((val, i) => (
              <motion.div 
                key={i}
                variants={itemVariants}
                className="group p-12 border border-gray-100 hover:border-primary transition-all duration-500 bg-white"
              >
                <div className="text-primary mb-8 group-hover:scale-110 transition-transform duration-500">
                    {val.icon}
                </div>
                <h3 className="text-2xl font-black text-dark uppercase tracking-tighter mb-4 italic">
                    {val.title}
                </h3>
                <p className="text-gray-500 font-medium text-sm leading-relaxed">
                    {val.desc}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* --- SECTION L'ÉQUIPE : LE BUREAU --- 
          Approche "Grayscale" (noir et blanc) qui passe en couleur au survol
      */}
      <section className="py-32 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            
            <div className="space-y-8">
                <div>
                  <span className="text-primary font-black uppercase tracking-[0.3em] text-[10px]">Gouvernance</span>
                  <h2 className="text-5xl md:text-6xl font-black text-dark tracking-tighter uppercase italic mt-4">
                    Le bureau <br /><span className="text-primary">exécutif.</span>
                  </h2>
                </div>
                
                <p className="text-gray-600 text-lg font-medium leading-snug">
                  Notre structure est gérée par des professionnels bénévoles garantissant une transparence totale et une vision à long terme.
                </p>

                <div className="flex flex-col gap-4 pt-4">
                  <div className="flex items-center gap-3 text-dark font-black text-xs uppercase tracking-widest">
                    <Award className="text-primary" size={18} /> Engagement certifié 2026
                  </div>
                  <div className="flex items-center gap-3 text-dark font-black text-xs uppercase tracking-widest">
                    <Shield size={18} className="text-primary" /> Gouvernance transparente
                  </div>
                </div>

                <motion.button 
                    whileHover={{ x: 10 }}
                    onClick={() => navigate('/adhesion')}
                    className="flex items-center gap-4 text-dark font-black uppercase tracking-widest text-xs border-b-2 border-primary pb-2 group"
                >
                    Devenir membre actif <ArrowRight size={16} className="text-primary" />
                </motion.button>
            </div>

            {/* Grille des rôles (Angular Design) */}
            <div className="grid grid-cols-2 gap-4">
                {[
                  { label: "Présidence", bg: "bg-dark text-white" },
                  { label: "Secrétariat", bg: "bg-primary text-white" },
                  { label: "Trésorerie", bg: "bg-primary-light text-primary" },
                  { label: "Événementiel", bg: "bg-gray-200 text-gray-400" }
                ].map((role, index) => (
                  <motion.div 
                    key={index}
                    whileHover={{ scale: 1.02 }}
                    className={`aspect-square ${role.bg} flex flex-col items-center justify-center p-8 transition-all duration-500 cursor-default grayscale hover:grayscale-0`}
                  >
                    <div className="w-8 h-1 bg-current mb-4 opacity-30"></div>
                    <p className="font-black text-center text-xs uppercase tracking-[0.2em]">
                        {role.label}
                    </p>
                  </motion.div>
                ))}
            </div>
        </div>
      </section>

      {/* --- FOOTER CTA (Design Carré) --- */}
      <section className="bg-dark text-white py-24 text-center px-4 relative overflow-hidden">
        <div className="max-w-4xl mx-auto relative z-10">
          <h2 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter mb-10">
            Faites partie de <br/><span className="text-primary">l'histoire du réseau.</span>
          </h2>
          <button 
            onClick={() => navigate('/adhesion')}
            className="inline-block bg-primary text-white px-12 py-5 font-black text-xs uppercase tracking-[0.3em] hover:bg-white hover:text-dark transition-all duration-300"
          >
            Adhérer maintenant
          </button>
        </div>
        <div className="absolute left-0 top-0 w-full h-full bg-primary/5 pointer-events-none" />
      </section>

    </div>
  );
};