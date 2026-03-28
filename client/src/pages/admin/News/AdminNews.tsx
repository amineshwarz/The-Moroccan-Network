import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAxios } from '../../../hooks/useAxios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, Newspaper, Edit3, Trash2, Calendar, 
  ChevronRight, LayoutGrid, List, Eye, EyeOff 
} from 'lucide-react';

export const AdminNews: React.FC = () => {
  const navigate = useNavigate();
  const { request, loading } = useAxios();
  const [articles, setArticles] = useState<any[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const fetchArticles = async () => {
    try {
      const data = await request('GET', '/api/news');
      setArticles(data);
    } catch (err) {}
  };

  useEffect(() => { fetchArticles(); }, []);

  const handleDelete = async (id: number) => {
    if (window.confirm("Supprimer cet article définitivement ?")) {
      try {
        await request('DELETE', `/api/news/${id}`);
        setArticles(prev => prev.filter(art => art.id !== id));
      } catch (err) {
        alert("Erreur lors de la suppression");
      }
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-10 pb-20">
      
      {/* --- HEADER AVEC TOGGLE --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-dark/5 pb-10">
        <div>
          <h1 className="text-6xl font-black text-dark tracking-tighter uppercase italic leading-none">
            Presse<span className="text-primary">.</span>
          </h1>
          <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px] mt-2 flex items-center gap-2">
            <Newspaper size={14} className="text-primary"/> Gestion éditoriale du réseau
          </p>
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto">
          {/* SWITCHER DESIGN */}
          <div className="bg-gray-100 p-1 rounded-2xl flex items-center shadow-inner border border-dark/5">
            <button 
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-xl transition-all duration-300 ${viewMode === 'grid' ? 'bg-white text-primary shadow-md' : 'text-gray-400 hover:text-dark'}`}
            >
              <LayoutGrid size={20} />
            </button>
            <button 
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-xl transition-all duration-300 ${viewMode === 'list' ? 'bg-white text-primary shadow-md' : 'text-gray-400 hover:text-dark'}`}
            >
              <List size={20} />
            </button>
          </div>

          <motion.button 
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/admin/news/new')} // Redirection vers l'éditeur (nouveau)
            className="flex-1 md:flex-none bg-dark text-white px-8 py-4 rounded-2xl font-black shadow-2xl flex items-center justify-center gap-3 hover:bg-primary transition-all uppercase tracking-tighter text-sm"
          >
            <Plus size={20} /> Rédiger
          </motion.button>
        </div>
      </div>

      {/* --- GRILLE / LISTE DYNAMIQUE --- */}
      <motion.div 
        
        className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'}`}
      >
        <AnimatePresence mode='popLayout'>
          {articles.map((art) => (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              key={art.id} 
              className={`bg-white border border-gray-100 overflow-hidden transition-all duration-500 shadow-sm ${
                viewMode === 'grid' ? 'rounded-xl flex flex-col hover:shadow-2xl' : 'rounded-xl flex flex-row items-center p-4 hover:shadow-lg'
              }`}
            >
              {/* IMAGE */}
              <div className={`relative overflow-hidden bg-gray-50 shrink-0 ${
                viewMode === 'grid' ? 'h-64 w-full' : 'h-24 w-24 md:h-32 md:w-32 rounded-2xl'
              }`}>
                {art.image ? (
                  <img src={`http://localhost:8000${art.image}`} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-200"><Newspaper size={viewMode === 'grid' ? 64 : 32} /></div>
                )}
                
                <div className={`absolute top-4 ${viewMode === 'grid' ? 'left-4' : 'left-2'}`}>
                  <div className="bg-white/90 backdrop-blur-md p-1.5 rounded-lg border border-white/20 shadow-sm">
                    {art.isPublished ? <Eye size={14} className="text-green-500" /> : <EyeOff size={14} className="text-gray-300" />}
                  </div>
                </div>
              </div>

              {/* CONTENU */}
              <div className={`flex flex-col flex-1 ${viewMode === 'grid' ? 'p-8' : 'px-6 py-2'}`}>
                {viewMode === 'grid' && (
                  <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">
                    <Calendar size={12} className="text-primary"/> {art.createdAt}
                  </div>
                )}
                
                <div className="flex justify-between items-start gap-4">
                  <h3 className={`font-black text-dark leading-tight uppercase tracking-tighter group-hover:text-primary transition-colors ${
                    viewMode === 'grid' ? 'text-2xl mb-4 italic line-clamp-2' : 'text-lg line-clamp-1'
                  }`}>
                    {art.title}
                  </h3>
                  {viewMode === 'list' && <span className="hidden sm:block text-[10px] font-bold text-gray-300 uppercase">{art.createdAt}</span>}
                </div>
                
                {viewMode === 'grid' && (
                  <p className="text-gray-500 text-sm leading-relaxed line-clamp-3 mb-8 flex-1 font-medium">
                    {art.content}
                  </p>
                )}

                <div className={`flex justify-between items-center ${viewMode === 'grid' ? 'pt-6 border-t border-gray-50' : ''}`}>
                  <button 
                    onClick={() => navigate(`/admin/news/edit/${art.id}`)} // Vers l'éditeur (modif)
                    className="flex items-center gap-2 text-dark font-black text-[10px] uppercase tracking-widest hover:text-primary transition-colors"
                  >
                    {viewMode === 'grid' ? "Éditer l'article" : "Éditer"} <ChevronRight size={14}/>
                  </button>
                  
                  <button 
                    onClick={() => handleDelete(art.id)}
                    className="p-2.5 text-gray-300 hover:text-primary hover:bg-red-50 rounded-xl transition-all"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};