import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAxios } from '../../../hooks/useAxios';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, Share2, Twitter, Facebook, Linkedin } from 'lucide-react';

export const NewsDetailPage: React.FC = () => {
  const { slug } = useParams(); // On récupère le slug depuis l'URL
  const navigate = useNavigate();
  const { request, loading, error } = useAxios();
  const [article, setArticle] = useState<any>(null);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const data = await request('GET', `/api/news/post/${slug}`);
        setArticle(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchArticle();
  }, [slug]);

  if (loading) return <div className="h-screen flex items-center justify-center">
    <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
  </div>;

  if (error || !article) return (
    <div className="h-screen flex flex-col items-center justify-center gap-4">
      <h1 className="text-2xl font-black uppercase italic">Article introuvable</h1>
      <Link to="/actualites" className="text-primary font-bold hover:underline">Retour aux actualités</Link>
    </div>
  );

  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      className="bg-white min-h-screen pb-20"
    >
      {/* --- BARRE DE NAVIGATION ARTICLE --- */}
      <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <button 
            onClick={() => navigate('/actualites')}
            className="flex items-center gap-2 text-sm font-black text-dark hover:text-primary transition-colors uppercase tracking-widest"
          >
            <ArrowLeft size={16} /> Retour
          </button>
          <div className="flex gap-4 text-gray-400">
            <Share2 size={18} className="hover:text-primary cursor-pointer transition-colors" />
          </div>
        </div>
      </nav>

      {/* --- CONTENU DE L'ARTICLE --- */}
      <article className="max-w-4xl mx-auto px-4 mt-12">
        
        <header className="mb-12 space-y-6">
          <motion.div 
            initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
            className="flex items-center gap-3 text-xs font-black text-primary uppercase tracking-[0.2em]"
          >
            <span className="bg-primary-light px-3 py-1 rounded-full">Actualité</span>
            <span className="text-gray-400 flex items-center gap-1">
                <Calendar size={14} /> {article.createdAt}
            </span>
          </motion.div>

          <motion.h1 
            initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-black text-dark tracking-tighter leading-[0.9] uppercase italic"
          >
            {article.title}
          </motion.h1>
        </header>

        {/* Image de couverture large */}
        <motion.div 
           initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.2 }}
           className="w-full h-300px md:h-500px rounded-[3rem] overflow-hidden mb-12 shadow-2xl border border-gray-100"
        >
          <img 
            src={article.image ? `http://localhost:8000${article.image}` : '/placeholder.jpg'} 
            className="w-full h-full object-cover"
            alt={article.title}
          />
        </motion.div>

        {/* Corps du texte - Style Medium / Editorial */}
        <div className="max-w-2xl mx-auto">
          <div className="prose prose-lg prose-red text-gray-700 leading-relaxed font-medium">
            {/* On utilise split par saut de ligne pour créer des paragraphes propres */}
            {article.content.split('\n').map((para: string, index: number) => (
              para && <p key={index} className="mb-6 first-letter:text-5xl first-letter:font-black first-letter:text-primary first-letter:mr-3 first-letter:float-left">
                {para}
              </p>
            ))}
          </div>

          {/* Footer de l'article : Tags ou Partage */}
          <div className="mt-16 pt-10 border-t border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
               <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Partager cet article</p>
               <div className="flex gap-4">
                  <button className="p-3 bg-gray-50 rounded-2xl text-dark hover:bg-primary hover:text-white transition-all"><Facebook size={20}/></button>
                  <button className="p-3 bg-gray-50 rounded-2xl text-dark hover:bg-primary hover:text-white transition-all"><Twitter size={20}/></button>
                  <button className="p-3 bg-gray-50 rounded-2xl text-dark hover:bg-primary hover:text-white transition-all"><Linkedin size={20}/></button>
               </div>
            </div>
            <div className="bg-dark p-8  text-white flex-1 max-w-sm">
                <p className="text-primary font-black text-xs uppercase mb-2">The Moroccan Network</p>
                <p className="text-sm text-gray-400 font-medium">Vous aimez nos actions ? Rejoignez-nous pour ne rien manquer.</p>
                <Link to="/adhesion" className="inline-block mt-4 text-white font-bold border-b-2 border-primary pb-1 hover:text-primary transition-colors">Devenir membre →</Link>
            </div>
          </div>
        </div>

      </article>
    </motion.div>
  );
};