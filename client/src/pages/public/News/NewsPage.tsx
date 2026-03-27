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
      const data = await request('GET', '/api/news');
      setArticles(data);
    };
    fetchNews();
  }, []);

  if (loading && articles.length === 0) return (
    <div className="h-screen flex items-center justify-center bg-white">
      <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );

  const featured = articles[0];
  const others = articles.slice(1);

  return (
    <div className="bg-white min-h-screen">
      {/* --- HEADER ÉDITORIAL --- */}
      <section className="pt-32 pb-16 px-4 border-b bg-dark text-white border-gray-100">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-2xl">
            <span className="text-primary font-bold tracking-[0.3em] text-[10px] uppercase block mb-4">
              The Moroccan Network Journal
            </span>
            <h1 className="text-6xl md:text-8xl font-black  tracking-tighter uppercase italic leading-[0.8]">
              Presse<span className="text-primary">.</span>
            </h1>
          </div>
          <div className="text-gray-400 font-medium text-sm italic">
            Les dernières actualités du réseau et de la communauté.
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* --- ARTICLE À LA UNE (FORMAT HORIZONTAL) --- */}
        {featured && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            onClick={() => navigate(`/actualites/${featured.slug}`)}
            className="group cursor-pointer grid grid-cols-1 lg:grid-cols-12 gap-0 border border-gray-200 hover:border-primary transition-colors duration-500"
          >
            <div className="lg:col-span-8 overflow-hidden h-400px md:h-500px">
              <img 
                src={featured.image ? `http://localhost:8000${featured.image}` : '/placeholder.jpg'} 
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-105"
                alt=""
              />
            </div>
            <div className="lg:col-span-4 p-8 md:p-12 flex flex-col justify-center bg-white">
              <div className="flex items-center gap-3 text-[10px] font-bold text-primary uppercase tracking-widest mb-6">
                <span className="bg-primary text-white px-2 py-0.5">Dernière Une</span>
                <span>{featured.createdAt}</span>
              </div>
              <h2 className="text-4xl font-black text-dark uppercase tracking-tighter leading-tight mb-6 italic">
                {featured.title}
              </h2>
              <p className="text-gray-500 font-medium line-clamp-4 mb-8 leading-relaxed">
                {featured.content}
              </p>
              <div className="flex items-center gap-2 text-dark font-black uppercase text-xs tracking-widest border-b-2 border-primary w-fit pb-1 group-hover:gap-4 transition-all">
                Lire l'article <ArrowRight size={14} />
              </div>
            </div>
          </motion.div>
        )}

        {/* --- LISTE DES AUTRES ARTICLES (FORMAT ÉPURÉ) --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-20 mt-32">
          {others.map((art) => (
            <motion.div 
              key={art.id}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              onClick={() => navigate(`/actualites/${art.slug}`)}
              className="group cursor-pointer border-t border-gray-100 pt-8"
            >
              <div className="flex flex-col gap-6">
                <div className="aspect-video overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-700">
                   <img 
                    src={art.image ? `http://localhost:8000${art.image}` : '/placeholder.jpg'} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                    alt="" 
                   />
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    <span>{art.createdAt}</span>
                    <Share2 size={14} className="hover:text-primary transition-colors" />
                  </div>
                  <h3 className="text-3xl font-black text-dark uppercase tracking-tighter leading-none group-hover:text-primary transition-colors italic">
                    {art.title}
                  </h3>
                  <p className="text-gray-500 text-sm font-medium line-clamp-2 leading-relaxed">
                    {art.content}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};