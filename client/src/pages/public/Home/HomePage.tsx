import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useAxios } from '../../../hooks/useAxios';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  Users, 
  Globe, 
  Target, 
  Calendar, 
  Newspaper,
  ChevronRight
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const { request } = useAxios();
  const [latestNews, setLatestNews] = useState<any[]>([]);
  const [nextEvent, setNextEvent] = useState<any>(null);

  useEffect(() => {
    // On récupère les données pour rendre la page vivante
    const fetchData = async () => {
      try {
        const news = await request('GET', '/api/news');
        setLatestNews(news.slice(0, 3)); // Uniquement les 3 derniers
        const events = await request('GET', '/api/events');
        setNextEvent(events[0]); // Le plus proche
      } catch (e) { console.error(e); }
    };
    fetchData();
  }, []);

  return (
    <div className="bg-white min-h-screen">
      
      {/* --- HERO SECTION : IMPACT IMMÉDIAT --- */}
      <section className="relative bg-dark text-white pt-32 pb-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <motion.div 
            initial={{ opacity: 0, x: -20 }} 
            animate={{ opacity: 1, x: 0 }}
            className="max-w-3xl"
          >
            <span className="text-primary font-bold tracking-[0.3em] text-sm uppercase">Le Réseau de l'Excellence</span>
            <h1 className="text-5xl md:text-7xl font-black mt-6 mb-8 leading-[1.1] tracking-tighter">
              Fédérer les talents, <br />
              <span className="text-primary italic">bâtir l'avenir.</span>
            </h1>
            <p className="text-xl text-gray-300 mb-10 leading-relaxed font-medium">
              The Moroccan Network est la plateforme de référence dédiée à la synergie des compétences et au rayonnement de notre communauté.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/adhesion" className="bg-primary hover:bg-red-700 text-white px-8 py-4 font-bold transition flex items-center gap-2 group">
                REJOINDRE LE RÉSEAU <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/evenements" className="border border-white/30 hover:bg-white/10 text-white px-8 py-4 font-bold transition">
                DÉCOUVRIR NOS ACTIONS
              </Link>
            </div>
          </motion.div>
        </div>
        {/* Décor architectural subtil en fond */}
        <div className="absolute right-0 bottom-0 w-1/3 h-full bg-primary/5 -skew-x-12deg] translate-x-20" />
      </section>

      {/* --- SECTION VISION (3 COLONNES) --- */}
      <section className="py-24 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            <div className="space-y-4">
              <div className="w-12 h-1 bg-primary mb-6"></div>
              <h3 className="text-xl font-black uppercase tracking-tighter">Engagement</h3>
              <p className="text-gray-500 leading-relaxed font-medium">
                Nous agissons concrètement pour soutenir les initiatives à fort impact social et culturel.
              </p>
            </div>
            <div className="space-y-4">
              <div className="w-12 h-1 bg-primary mb-6"></div>
              <h3 className="text-xl font-black uppercase tracking-tighter">Réseautage</h3>
              <p className="text-gray-500 leading-relaxed font-medium">
                Un espace unique pour connecter les professionnels, les étudiants et les mentors.
              </p>
            </div>
            <div className="space-y-4">
              <div className="w-12 h-1 bg-primary mb-6"></div>
              <h3 className="text-xl font-black uppercase tracking-tighter">Rayonnement</h3>
              <p className="text-gray-500 leading-relaxed font-medium">
                Promouvoir l'excellence marocaine à travers des événements et des contenus de qualité.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* --- PROCHAIN ÉVÉNEMENT (FOCUS) --- */}
      {nextEvent && (
        <section className="py-24 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex flex-col lg:flex-row items-stretch bg-white border border-gray-200 shadow-sm overflow-hidden">
              <div className="lg:w-1/2 h-400px">
                <img 
                  src={nextEvent.image ? `http://localhost:8000${nextEvent.image}` : '/placeholder.jpg'} 
                  className="w-full h-full object-cover" 
                  alt={nextEvent.title}
                />
              </div>
              <div className="lg:w-1/2 p-12 flex flex-col justify-center">
                <span className="text-primary font-bold text-xs uppercase tracking-widest flex items-center gap-2 mb-4">
                  <Calendar size={14} /> Événement à venir
                </span>
                <h2 className="text-4xl font-black text-dark uppercase italic tracking-tighter mb-6">
                  {nextEvent.title}
                </h2>
                <p className="text-gray-500 mb-8 font-medium line-clamp-3">
                  {nextEvent.description}
                </p>
                <Link to="/evenements" className="text-dark font-black uppercase text-sm border-b-2 border-primary w-fit pb-1 hover:text-primary transition-colors">
                  Réserver ma place →
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* --- DERNIÈRES ACTUALITÉS --- */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-4xl font-black text-dark uppercase tracking-tighter italic">Actualités</h2>
              <p className="text-gray-400 font-medium">Les derniers échos du réseau.</p>
            </div>
            <Link to="/actualites" className="hidden md:flex items-center gap-2 text-primary font-bold hover:gap-3 transition-all">
              VOIR TOUT <ChevronRight size={20} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {latestNews.map((art) => (
              <Link to={`/actualites/${art.slug}`} key={art.id} className="group">
                <div className="aspect-video bg-gray-100 mb-6 overflow-hidden">
                  <img 
                    src={art.image ? `http://localhost:8000${art.image}` : '/placeholder.jpg'} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                    alt={art.title}
                  />
                </div>
                <h3 className="text-xl font-bold text-dark group-hover:text-primary transition-colors leading-tight mb-2 uppercase">
                  {art.title}
                </h3>
                <p className="text-gray-400 text-sm font-bold">{art.createdAt}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* --- FOOTER CTA --- */}
      <section className="bg-primary py-20 text-center">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-black text-white uppercase italic tracking-tighter mb-8">
            Devenez acteur du changement.
          </h2>
          <Link to="/adhesion" className="inline-block bg-dark text-white px-10 py-5 font-bold hover:bg-black transition-all">
            ADHERER À L'ASSOCIATION
          </Link>
        </div>
      </section>
    </div>
  );
};