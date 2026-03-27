import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAxios } from '../../../hooks/useAxios';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, Share2, Twitter, Facebook, Linkedin } from 'lucide-react';

export const NewsDetailPage: React.FC = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { request, loading, error } = useAxios();
  const [article, setArticle] = useState<any>(null);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const data = await request('GET', `/api/news/post/${slug}`);
        setArticle(data);
      } catch (err) { console.error(err); }
    };
    fetchArticle();
  }, [slug]);

  if (loading) return <div className="h-screen flex items-center justify-center bg-white"><div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div>;

  if (error || !article) return (
    <div className="h-screen flex flex-col items-center justify-center bg-white gap-6">
      <h1 className="text-4xl font-black uppercase italic tracking-tighter text-dark">Article introuvable.</h1>
      <Link to="/actualites" className="bg-dark text-white px-8 py-3 font-bold uppercase text-xs tracking-widest">Retour</Link>
    </div>
  );

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white min-h-screen">
      {/* NAVIGATION FLOTTANTE ÉPURÉE */}
      <nav className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <button 
            onClick={() => navigate('/actualites')}
            className="flex items-center gap-2 text-[10px] font-black text-dark hover:text-primary transition-colors uppercase tracking-widest"
          >
            <ArrowLeft size={14} /> Retour à la presse
          </button>
          <div className="flex gap-4">
            <Share2 size={16} className="text-gray-400 hover:text-primary cursor-pointer" />
          </div>
        </div>
      </nav>

      <article className="max-w-4xl mx-auto px-4 mt-20 pb-32">
        <header className="mb-16">
          <div className="flex items-center gap-3 text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-8">
            <span className="border-b-2 border-primary">Actualité Officielle</span>
            <span className="text-gray-300">/</span>
            <span className="text-gray-400">{article.createdAt}</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-black text-dark tracking-tighter leading-[0.9] uppercase italic mb-12">
            {article.title}
          </h1>

          <div className="w-full h-350px md:h-550px overflow-hidden grayscale">
             <img 
               src={article.image ? `http://localhost:8000${article.image}` : '/placeholder.jpg'} 
               className="w-full h-full object-cover"
               alt=""
             />
          </div>
        </header>

        <div className="max-w-2xl mx-auto">
          {/* LOGIQUE DE LECTURE : LETTRINE (DROP CAP) STYLE INSTITUTIONNEL */}
          <div className="text-gray-700 leading-relaxed font-medium text-lg">
            {article.content.split('\n').map((para: string, index: number) => (
              para && (
                <p key={index} className={`mb-8 ${index === 0 ? 'first-letter:text-7xl first-letter:font-black first-letter:text-primary first-letter:mr-3 first-letter:float-left first-letter:leading-none' : ''}`}>
                  {para}
                </p>
              )
            ))}
          </div>

          {/* FOOTER ARTICLE SANS ARRONDIS */}
          <div className="mt-24 pt-12 border-t border-gray-100 flex flex-col md:flex-row justify-between gap-12">
            <div className="space-y-4">
               <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em]">Partager</p>
               <div className="flex gap-2">
                  <button className="p-4 border border-gray-100 text-dark hover:bg-primary hover:text-white transition-all"><Facebook size={18}/></button>
                  <button className="p-4 border border-gray-100 text-dark hover:bg-primary hover:text-white transition-all"><Twitter size={18}/></button>
                  <button className="p-4 border border-gray-100 text-dark hover:bg-primary hover:text-white transition-all"><Linkedin size={18}/></button>
               </div>
            </div>
            <div className="bg-dark p-10 text-white flex-1 max-w-sm flex flex-col justify-between">
                <div>
                  <p className="text-primary font-black text-xs uppercase tracking-widest mb-4 italic">Newsletter</p>
                  <p className="text-xl font-bold tracking-tight">Ne manquez aucun écho du réseau.</p>
                </div>
                <Link to="/adhesion" className="mt-8 bg-primary text-white py-4 text-center font-black text-xs uppercase tracking-[0.2em] hover:bg-white hover:text-dark transition-all">
                  Devenir membre
                </Link>
            </div>
          </div>
        </div>
      </article>
    </motion.div>
  );
};