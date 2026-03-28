import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAxios } from '../../../hooks/useAxios';
import { motion } from 'framer-motion';
import { Save, ChevronLeft, Upload, Eye, EyeOff, Loader2, Image as ImageIcon } from 'lucide-react';

export const AdminNewsEditor: React.FC = () => {
  const { id } = useParams(); // Récupère l'ID si on est en mode modification
  const navigate = useNavigate();
  const { request, loading } = useAxios();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isPublished, setIsPublished] = useState(true);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Charger l'article s'il s'agit d'une modification
  useEffect(() => {
    if (id) {
      const fetchArticle = async () => {
        const data = await request('GET', '/api/news');
        const art = data.find((a: any) => a.id.toString() === id);
        if (art) {
          setTitle(art.title);
          setContent(art.content);
          setIsPublished(art.isPublished);
          setImagePreview(art.image ? `http://localhost:8000${art.image}` : null);
        }
      };
      fetchArticle();
    }
  }, [id]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setImageFile(e.target.files[0]);
      setImagePreview(URL.createObjectURL(e.target.files[0]));
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
      const url = id ? `/api/news/${id}/update` : '/api/news/create';
      await request('POST', url, formData);
      navigate('/admin/news'); // Retour à la liste après succès
    } catch (err) {}
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-5xl mx-auto pb-20">
      
      {/* BARRE D'ACTIONS FIXE EN HAUT */}
      <div className="flex justify-between items-center mb-12 border-b border-dark/5 pb-8">
        <button onClick={() => navigate('/admin/news')} className="flex items-center gap-2 text-gray-400 hover:text-dark font-black text-[10px] uppercase tracking-widest transition-all">
          <ChevronLeft size={16} /> Retour à la liste
        </button>
        
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 cursor-pointer group">
            <input 
              type="checkbox" checked={isPublished} onChange={e => setIsPublished(e.target.checked)}
              className="w-5 h-5 accent-primary" 
            />
            <span className="text-[10px] font-black uppercase tracking-widest text-dark group-hover:text-primary transition-colors">
              {isPublished ? 'En ligne' : 'Brouillon'}
            </span>
          </div>
          <button 
            onClick={handleSubmit} disabled={loading}
            className="bg-dark text-white px-10 py-4 rounded-xl font-black text-xs tracking-[0.2em] hover:bg-primary transition-all shadow-xl flex items-center gap-2 disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
            {id ? 'ENREGISTRER' : 'PUBLIER'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* COLONNE GAUCHE : TEXTE (8/12) */}
        <div className="lg:col-span-8 space-y-8">
          <textarea 
            placeholder="Titre de l'article..."
            className="w-full bg-transparent text-5xl font-black text-dark placeholder:text-gray-100 outline-none resize-none h-auto italic uppercase tracking-tighter"
            value={title} onChange={e => setTitle(e.target.value)}
            rows={2}
          />
          
          <div className="w-24 h-2 bg-primary mb-12" />

          <textarea 
            placeholder="Commencez à rédiger votre histoire ici..."
            className="w-full bg-transparent text-xl font-medium text-gray-600 placeholder:text-gray-100 outline-none resize-none min-h-500px leading-relaxed"
            value={content} onChange={e => setContent(e.target.value)}
          />
        </div>

        {/* COLONNE DROITE : MÉDIAS (4/12) */}
        <div className="lg:col-span-4">
          <div className="sticky top-10 space-y-6">
            <label className="text-[10px] font-black uppercase text-dark tracking-[0.3em] block mb-4">Image de couverture</label>
            <div className="relative group aspect-square bg-gray-50 border-2 border-dashed border-gray-200 overflow-hidden flex items-center justify-center hover:border-primary transition-all">
              {imagePreview ? (
                <>
                  <img src={imagePreview} className="w-full h-full object-cover" alt="Preview" />
                  <div className="absolute inset-0 bg-dark/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white font-bold text-xs uppercase tracking-widest">
                    Changer l'image
                  </div>
                </>
              ) : (
                <div className="text-center space-y-2 opacity-20">
                  <Upload className="mx-auto" size={40} />
                  <p className="text-[10px] font-black uppercase">Fichier JPG/PNG</p>
                </div>
              )}
              <input type="file" accept="image/*" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer" />
            </div>
            
            <div className="p-8 bg-gray-50 rounded-none border-l-4 border-primary">
              <h4 className="text-[10px] font-black uppercase tracking-widest mb-4">Conseils</h4>
              <ul className="text-xs text-gray-500 space-y-3 font-medium italic">
                <li>• Utilisez un titre percutant.</li>
                <li>• Structurez vos paragraphes.</li>
                <li>• L'image doit faire au moins 1200px de large.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};