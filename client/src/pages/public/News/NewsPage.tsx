import React, { useEffect, useState } from 'react';
import { useAxios } from '../../../hooks/useAxios';
import { motion } from 'framer-motion';
import { Calendar, ArrowRight, Newspaper, Clock, Share2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const NewsPage: React.FC = () => {
  const [articles, setArticles] = useState<any[]>([]);
  const { request, loading } = useAxios();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNews = async () => {
      // Rappel : la route publique Symfony ne renvoie que les articles "isPublished"
      const data = await request('GET', '/api/news');
      setArticles(data);
    };
    fetchNews();
  }, []);

  if (loading && articles.length === 0) {
    return (
      <div className="h-screen flex items-center justify-center bg-white">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-12 h-12 bg-primary/20 rounded-full animate-bounce" />
          <p className="text-dark font-black tracking-tighter uppercase italic">Chargement des news...</p>
        </div>
      </div>
    );
  }

  // On sépare le premier article (le plus récent) des autres
  const featuredArticle = articles[0];
  const otherArticles = articles.slice(1);

  return (
    <div className="bg-white min-h-screen pb-20">
      
      {/* --- HERO SECTION --- */}
      <section className="relative pt-20 pb-16 px-4 border-b border-gray-100">
        <div className="max-w-7xl mx-auto text-center">
          <motion.span 
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="text-primary font-black uppercase tracking-[0.3em] text-xs"
          >
            Le Journal de l'Association
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-6xl md:text-8xl font-black text-dark tracking-tighter uppercase italic mt-4"
          >
            Actualités<span className="text-primary">.</span>
          </motion.h1>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 mt-16 space-y-20">
        
        {/* --- ARTICLE À LA UNE (FEATURED) --- */}
        {featuredArticle && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            // AJOUT : Navigation vers le détail via le slug
            onClick={() => navigate(`/actualites/${featuredArticle.slug}`)}
            className="relative grid grid-cols-1 lg:grid-cols-12 gap-8 items-center group cursor-pointer"
          >
            <div className="lg:col-span-7 overflow-hidden rounded-[3rem] shadow-2xl h-400px md:h-500px">
              <img 
                src={featuredArticle.image ? `http://localhost:8000${featuredArticle.image}` : '/placeholder.jpg'} 
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                alt={featuredArticle.title}
              />
            </div>
            <div className="lg:col-span-5 space-y-6">
              <div className="flex items-center gap-4 text-xs font-black text-gray-400 uppercase tracking-widest">
                <span className="bg-primary text-white px-4 py-1.5 rounded-full shadow-lg shadow-primary/20">Dernière minute</span>
                <span className="flex items-center gap-1"><Clock size={14}/> {featuredArticle.createdAt}</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-dark leading-none tracking-tighter uppercase italic group-hover:text-primary transition-colors">
                {featuredArticle.title}
              </h2>
              <p className="text-gray-500 text-lg leading-relaxed line-clamp-4 font-medium">
                {featuredArticle.content}
              </p>
              <div className="flex items-center gap-3 text-dark font-black uppercase tracking-widest text-sm group-hover:gap-5 transition-all">
                <span>Lire l'histoire</span> 
                <ArrowRight className="text-primary" />
              </div>
            </div>
          </motion.div>
        )}

        {/* --- GRILLE DES AUTRES ARTICLES --- */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {otherArticles.map((art, index) => (
            <motion.article 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              key={art.id}
              // AJOUT : Navigation vers le détail
              onClick={() => navigate(`/actualites/${art.slug}`)}
              className="group cursor-pointer flex flex-col"
            >
              <div className="h-64 rounded-[2.5rem] overflow-hidden mb-6 shadow-lg border border-gray-100">
                <img 
                  src={art.image ? `http://localhost:8000${art.image}` : '/placeholder.jpg'} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  alt={art.title}
                />
              </div>
              <div className="space-y-4 flex-1 flex flex-col">
                <div className="flex justify-between items-center text-[10px] font-black text-gray-400 uppercase tracking-widest">
                   <span className="flex items-center gap-1"><Calendar size={12} className="text-primary"/> {art.createdAt}</span>
                   <Share2 size={14} className="hover:text-primary transition-colors cursor-pointer" onClick={(e) => { e.stopPropagation(); /* Empêche la navigation lors du partage */ }}/>
                </div>
                <h3 className="text-2xl font-black text-dark leading-tight uppercase italic tracking-tighter group-hover:text-primary transition-colors">
                  {art.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed line-clamp-3 font-medium flex-1">
                  {art.content}
                </p>
                <div className="pt-2">
                   <span className="inline-block w-8 h-1 bg-primary group-hover:w-16 transition-all duration-500"></span>
                </div>
              </div>
            </motion.article>
          ))}
        </section>

        {/* --- EMPTY STATE --- */}
        {articles.length === 0 && !loading && (
          <div className="text-center py-20 bg-gray-50 rounded-[4rem] border-4 border-dashed border-gray-100">
            <Newspaper size={60} className="mx-auto text-gray-200 mb-6" />
            <h3 className="text-2xl font-black text-dark uppercase italic">Le bureau prépare du contenu</h3>
            <p className="text-gray-400 font-bold mt-2">Revenez très bientôt pour les premières news !</p>
          </div>
        )}
      </div>
    </div>
  );
};