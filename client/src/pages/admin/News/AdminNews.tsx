import React, { useEffect, useState } from 'react';
import { useAxios } from '../../../hooks/useAxios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, Newspaper, Edit3, Trash2, Save, X, Upload, 
  Eye, EyeOff, Loader2, Calendar, ChevronRight, AlertCircle
} from 'lucide-react';

interface Article {
  id: number;
  title: string;
  content: string;
  image: string | null;
  createdAt: string;
  isPublished: boolean;
}

export const AdminNews: React.FC = () => {
  const { request, loading, error } = useAxios();
  const [articles, setArticles] = useState<Article[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingArticleId, setEditingArticleId] = useState<number | null>(null);
  
  // États du formulaire
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isPublished, setIsPublished] = useState(true);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const fetchArticles = async () => {
    try {
      const data = await request('GET', '/api/news');
      setArticles(data);
    } catch (err) {}
  };

  useEffect(() => { fetchArticles(); }, []);

  // --- ACTIONS ---

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleEdit = (art: Article) => {
    setEditingArticleId(art.id);
    setTitle(art.title);
    setContent(art.content);
    setIsPublished(art.isPublished);
    setImagePreview(art.image ? `http://localhost:8000${art.image}` : null);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cet article définitivement ?")) {
      try {
        await request('DELETE', `/api/news/${id}`);
        // Mise à jour locale immédiate (Optimistic UI)
        setArticles(prev => prev.filter(art => art.id !== id));
      } catch (err) {
        alert("Erreur lors de la suppression");
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    formData.append('isPublished', isPublished ? '1' : '0');
    if (imageFile) formData.append('image', imageFile);

    try {
      const url = editingArticleId ? `/api/news/${editingArticleId}/update` : '/api/news/create';
      await request('POST', url, formData);
      setIsModalOpen(false);
      resetForm();
      fetchArticles();
    } catch (err) {}
  };

  const resetForm = () => {
    setEditingArticleId(null);
    setTitle(''); setContent(''); setIsPublished(true);
    setImageFile(null); setImagePreview(null);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-10 pb-20">
      
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-dark/5 pb-10">
        <div>
          <h1 className="text-6xl font-black text-dark tracking-tighter uppercase italic">
            Press <span className="text-primary">Room</span>
          </h1>
          <p className="text-gray-400 font-bold uppercase tracking-widest text-xs mt-2 flex items-center gap-2">
            <Newspaper size={14} className="text-primary"/> Gestion du contenu éditorial
          </p>
        </div>
        <motion.button 
          whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
          onClick={() => { resetForm(); setIsModalOpen(true); }}
          className="bg-dark text-white px-8 py-4  font-black shadow-2xl flex items-center gap-3 hover:bg-primary transition-all uppercase tracking-tighter"
        >
          <Plus size={22} /> Rédiger une news
        </motion.button>
      </div>

      {/* --- ARTICLES GRID --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        <AnimatePresence mode='popLayout'>
          {articles.map((art) => (
            <motion.div 
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
              key={art.id} 
              className="bg-white rounded-[2.5rem] border border-gray-100 flex flex-col overflow-hidden group hover:shadow-2xl transition-all duration-500"
            >
              {/* Image Container */}
              <div className="h-64 relative overflow-hidden bg-gray-50">
                {art.image ? (
                  <img src={`http://localhost:8000${art.image}`} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-200"><Newspaper size={64} /></div>
                )}
                
                {/* Status Badge Over Image */}
                <div className="absolute top-5 left-5">
                  <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest backdrop-blur-md border ${
                    art.isPublished ? 'bg-green-500/20 text-green-600 border-green-500/30' : 'bg-orange-500/20 text-orange-600 border-orange-500/30'
                  }`}>
                    {art.isPublished ? '• Live' : '• Brouillon'}
                  </span>
                </div>

                {/* Quick Action Overlay (Delete only) */}
                <button 
                  onClick={() => handleDelete(art.id)}
                  className="absolute top-5 right-5 p-3 bg-white/90 backdrop-blur-md rounded-2xl text-gray-400 hover:text-primary opacity-0 group-hover:opacity-100 transition-all shadow-xl"
                >
                  <Trash2 size={18} />
                </button>
              </div>

              {/* Content Area */}
              <div className="p-8 flex flex-col flex-1">
                <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">
                  <Calendar size={12} className="text-primary"/> {art.createdAt}
                </div>
                
                <h3 className="text-2xl font-black text-dark leading-tight mb-4 line-clamp-2 italic group-hover:text-primary transition-colors uppercase tracking-tighter">
                  {art.title}
                </h3>
                
                <p className="text-gray-500 text-sm leading-relaxed line-clamp-3 mb-8 flex-1">
                  {art.content}
                </p>

                <div className="pt-6 border-t border-gray-50 flex justify-between items-center">
                  <button 
                    onClick={() => handleEdit(art)}
                    className="flex items-center gap-2 text-dark font-black text-xs uppercase tracking-widest hover:text-primary transition-colors"
                  >
                    Modifier <ChevronRight size={14}/>
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {articles.length === 0 && !loading && (
        <div className="py-20 text-center bg-gray-50 rounded-[3rem] border-2 border-dashed border-dark/5">
          <AlertCircle className="mx-auto text-gray-300 mb-4" size={48} />
          <p className="text-gray-400 font-bold uppercase tracking-widest">Aucun article publié pour le moment</p>
        </div>
      )}

      {/* --- MODAL FORMULAIRE (Glassmorphism) --- */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-dark/60 backdrop-blur-md" />
            
            <motion.div 
              initial={{ scale: 0.9, y: 20, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }} exit={{ scale: 0.9, y: 20, opacity: 0 }}
              className="relative bg-white/90 backdrop-blur-xl w-full max-w-4xl rounded-[3rem] shadow-2xl overflow-hidden border border-white"
            >
              <form onSubmit={handleSubmit} className="flex flex-col h-[90vh]">
                {/* Header Modal Fixed */}
                <div className="p-8 border-b border-dark/5 flex justify-between items-center bg-white/50">
                    <h2 className="text-2xl font-black text-dark uppercase italic tracking-tighter">Édition de l'actualité</h2>
                    <button type="button" onClick={() => setIsModalOpen(false)} className="p-2 bg-dark/5 rounded-full text-gray-400 hover:text-primary transition-colors"><X /></button>
                </div>

                {/* Scrollable Content */}
                <div className="p-10 space-y-8 overflow-y-auto flex-1">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                    {/* Upload de l'image (1/3) */}
                    <div className="md:col-span-1 space-y-4">
                      <label className="text-[11px] font-black uppercase text-gray-400 tracking-widest ml-2">Image de couverture</label>
                      <div className="relative group h-64 bg-dark/5  border-2 border-dashed border-dark/10 overflow-hidden flex items-center justify-center hover:border-primary transition-all">
                        {imagePreview ? (
                          <>
                            <img src={imagePreview} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-dark/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white font-bold"><Upload size={20}/></div>
                          </>
                        ) : (
                          <div className="text-center opacity-30"><Upload className="mx-auto mb-2" /><p className="text-[10px] font-black uppercase">Format 16/9 recommandé</p></div>
                        )}
                        <input type="file" accept="image/*" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                      </div>
                    </div>

                    {/* Textes (2/3) */}
                    <div className="md:col-span-2 space-y-6">
                      <div className="space-y-2">
                        <label className="text-[11px] font-black uppercase text-gray-400 tracking-widest ml-2">Titre accrocheur</label>
                        <input 
                          className="w-full p-4 bg-dark/5 border-none rounded-2xl outline-none focus:ring-2 focus:ring-primary font-bold text-xl text-dark transition-all" 
                          placeholder="Titre de la news" value={title} onChange={e => setTitle(e.target.value)} required
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[11px] font-black uppercase text-gray-400 tracking-widest ml-2">Contenu de l'article</label>
                        <textarea 
                          className="w-full p-4 bg-dark/5 border-none rounded-2xl outline-none focus:ring-2 focus:ring-primary h-64 resize-none font-medium leading-relaxed transition-all" 
                          placeholder="Racontez votre histoire ici..." value={content} onChange={e => setContent(e.target.value)} required
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer Modal Fixed */}
                <div className="p-8 border-t border-dark/5 bg-white/50 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <input type="checkbox" checked={isPublished} onChange={e => setIsPublished(e.target.checked)} className="w-6 h-6 accent-primary rounded-xl" />
                        <label className="text-xs font-black text-dark uppercase tracking-tighter">Publier immédiatement</label>
                    </div>
                    <button type="submit" disabled={loading} className="bg-dark text-white px-12 py-5  font-black hover:bg-primary transition-all shadow-xl flex items-center gap-3">
                        {loading ? <Loader2 className="animate-spin"/> : <Save size={22}/>} 
                        <span>{editingArticleId ? 'METTRE À JOUR' : 'PUBLIER L\'ARTICLE'}</span>
                    </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};