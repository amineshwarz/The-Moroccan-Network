import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAxios } from '../../../hooks/useAxios';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { 
  Plus, Trash2, Calendar as CalendarIcon, MapPin, 
  Euro, Save, X, Eye, EyeOff, Edit3, Image as ImageIcon, 
  Upload, Loader2, ChevronRight, Users, Info, LayoutGrid, List
} from 'lucide-react';

interface PriceRow {
  category: string;
  amount: number;
}

export const AdminEvents: React.FC = () => {
  const navigate = useNavigate();
  const { request, loading } = useAxios();
  const [events, setEvents] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEventId, setEditingEventId] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // --- ÉTATS DU FORMULAIRE ---
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [capacity, setCapacity] = useState(0);
  const [isPublished, setIsPublished] = useState(false);
  const [prices, setPrices] = useState<PriceRow[]>([{ category: 'PUBLIC', amount: 0 }]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const CATEGORIES = [
    { id: 'PUBLIC', label: 'Public (Standard)' },
    { id: 'PUBLIC_STUDENT', label: 'Public (Étudiant)' },
    { id: 'ADHERENT', label: 'Adhérent (Normal)' },
    { id: 'ADHERENT_STUDENT', label: 'Adhérent (Étudiant)' },
    { id: 'STAFF', label: 'Staff / Bureau' },
    { id: 'GUEST', label: 'Guest' },
  ];

  const fetchEvents = async () => {
    try {
      const data = await request('GET', '/api/events');
      setEvents(data);
    } catch (err) { console.error(err); }
  };

  useEffect(() => { fetchEvents(); }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const resetForm = () => {
    setEditingEventId(null);
    setTitle(''); setDescription(''); setDate('');
    setLocation(''); setCapacity(0); setIsPublished(false);
    setPrices([{ category: 'PUBLIC', amount: 0 }]);
    setImageFile(null);
    setImagePreview(null);
  };

  const handleEdit = (e: React.MouseEvent, event: any) => {
    e.stopPropagation();
    setEditingEventId(event.id);
    setTitle(event.title);
    setDescription(event.description);
    setDate(event.date.substring(0, 16)); 
    setLocation(event.location || '');
    setCapacity(event.capacity);
    setIsPublished(event.isPublished);
    setPrices(event.prices || [{ category: 'PUBLIC', amount: 0 }]);
    setImagePreview(event.image ? `http://localhost:8000${event.image}` : null);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('date', date);
    formData.append('location', location);
    formData.append('capacity', capacity.toString());
    formData.append('isPublished', isPublished ? '1' : '0');
    if (imageFile) formData.append('image', imageFile);
    formData.append('prices', JSON.stringify(prices));

    try {
      const url = editingEventId ? `/api/events/${editingEventId}/update` : '/api/events/create';
      await request('POST', url, formData);
      setIsModalOpen(false);
      resetForm();
      fetchEvents();
    } catch (err) { console.error(err); }
  };

  const handleDelete = async (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    if (window.confirm("Supprimer cet événement ?")) {
      try {
        await request('DELETE', `/api/events/${id}`);
        setEvents(prev => prev.filter(ev => ev.id !== id));
      } catch (err) { console.error(err); }
    }
  };

  // --- LOGIQUE PRIX ---
  const addPriceRow = () => setPrices([...prices, { category: '', amount: 0 }]);
  const removePriceRow = (index: number) => setPrices(prices.filter((_, i) => i !== index));
  const updatePriceRow = (index: number, field: keyof PriceRow, value: string | number) => {
    const newPrices = [...prices];
    newPrices[index] = { ...newPrices[index], [field]: value };
    setPrices(newPrices);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-10 pb-20">
      
      {/* HEADER AVEC TOGGLE DESIGN */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-dark/5 pb-10">
        <div>
          <h1 className="text-6xl font-black text-dark tracking-tighter uppercase italic">
            Agenda<span className="text-primary">.</span>
          </h1>
          <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px] mt-2 flex items-center gap-2">
            <CalendarIcon size={14} className="text-primary"/> Planification des activités
          </p>
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto">
          {/* SWITCH GRID/LIST */}
          <div className="bg-gray-100 p-1 rounded-2xl flex items-center shadow-inner border border-dark/5">
            <button onClick={() => setViewMode('grid')} className={`p-2 rounded-xl transition-all ${viewMode === 'grid' ? 'bg-white text-primary shadow-md' : 'text-gray-400 hover:text-dark'}`}><LayoutGrid size={20} /></button>
            <button onClick={() => setViewMode('list')} className={`p-2 rounded-xl transition-all ${viewMode === 'list' ? 'bg-white text-primary shadow-md' : 'text-gray-400 hover:text-dark'}`}><List size={20} /></button>
          </div>

          <motion.button 
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            onClick={() => { resetForm(); setIsModalOpen(true); }}
            className="flex-1 md:flex-none bg-dark text-white px-8 py-4 rounded-2xl font-black shadow-2xl flex items-center justify-center gap-3 hover:bg-primary transition-all uppercase tracking-tighter text-sm"
          >
            <Plus size={20} /> Nouveau
          </motion.button>
        </div>
      </div>

      {/* LISTE DYNAMIQUE */}
      <motion.div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'}`}>
        <AnimatePresence mode='wait'>
          {events.map((event) => (
            <motion.div
              layout
              key={event.id}
              initial={{ opacity: 0,  }}
              animate={{ opacity: 1,  }}
              exit={{ opacity: 0, }}
              onClick={() => navigate(`/admin/events/${event.id}/tickets`)}
              className={`group cursor-pointer bg-white border border-gray-100 overflow-hidden transition-all duration-500 shadow-sm ${
                viewMode === 'grid' ? 'rounded-xl flex flex-col hover:shadow-2xl' : 'rounded-xl flex flex-row items-center p-4 hover:shadow-lg'
              }`}
            >
              {/* IMAGE CONTAINER */}
              <div className={`relative overflow-hidden bg-gray-50 shrink-0 ${viewMode === 'grid' ? 'h-56 w-full' : 'h-24 w-24 md:h-32 md:w-32 rounded-xl'}`}>
                {event.image ? (
                  <img src={`http://localhost:8000${event.image}`} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-200"><ImageIcon size={viewMode === 'grid' ? 48 : 24} /></div>
                )}
                <div className={`absolute top-4 ${viewMode === 'grid' ? 'right-4' : 'left-2'}`}>
                  <div className="bg-white/90 backdrop-blur-md p-1.5 rounded-lg border border-white/20 shadow-sm">
                    {event.isPublished ? <Eye size={14} className="text-green-500" /> : <EyeOff size={14} className="text-gray-300" />}
                  </div>
                </div>
              </div>

              {/* CONTENT AREA */}
              <div className={`flex flex-col flex-1 ${viewMode === 'grid' ? 'p-8' : 'px-6 py-2'}`}>
                <div className="flex justify-between items-start gap-4">
                  <h3 className={`font-black text-dark leading-tight uppercase tracking-tighter group-hover:text-primary transition-colors ${viewMode === 'grid' ? 'text-2xl mb-4 italic line-clamp-2' : 'text-lg line-clamp-1'}`}>
                    {event.title}
                  </h3>
                  {viewMode === 'list' && (
                    <div className="hidden sm:flex items-center gap-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                       <span>{new Date(event.date).toLocaleDateString()}</span>
                       <span className="flex items-center gap-1 text-primary"><MapPin size={12} /> {event.location}</span>
                    </div>
                  )}
                </div>

                {viewMode === 'grid' && (
                  <div className="space-y-3 mb-8 flex-1">
                    <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest flex items-center gap-2"><CalendarIcon size={12} className="text-primary"/> {new Date(event.date).toLocaleDateString()}</p>
                    <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest flex items-center gap-2"><MapPin size={12} className="text-primary"/> {event.location}</p>
                    <p className="text-gray-500 text-sm line-clamp-2 font-medium leading-relaxed">{event.description}</p>
                  </div>
                )}

                <div className={`flex justify-between items-center ${viewMode === 'grid' ? 'pt-6 border-t border-gray-50' : ''}`}>
                  <div className="flex gap-2">
                    <button onClick={(e) => handleEdit(e, event)} className="p-2.5 bg-gray-50 rounded-xl hover:bg-dark hover:text-white transition-all"><Edit3 size={18} /></button>
                    <button onClick={(e) => handleDelete(e, event.id)} className="p-2.5 bg-gray-50 rounded-xl hover:bg-primary hover:text-white transition-all"><Trash2 size={18} /></button>
                  </div>
                  <div className="bg-gray-50 px-3 py-1.5 rounded-full text-[9px] font-black text-dark uppercase tracking-widest border border-dark/5 flex items-center gap-2">
                    <Users size={12} className="text-primary"/> {event.capacity} PLACES
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* --- MODAL GLASSMORPHISM --- */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-dark/60 backdrop-blur-md" />
            <motion.div 
              initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative bg-white/90 backdrop-blur-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-[3rem] shadow-2xl border border-white"
            >
              <form onSubmit={handleSubmit} className="p-10 space-y-8">
                <div className="flex justify-between items-center border-b border-dark/5 pb-6">
                  <h2 className="text-2xl font-black text-dark italic uppercase tracking-tighter">
                    {editingEventId ? 'Modifier l\'event' : 'Nouvel Event'}
                  </h2>
                  <button type="button" onClick={() => setIsModalOpen(false)} className="p-2 bg-dark/5 rounded-full text-gray-400 hover:text-primary transition-colors"><X /></button>
                </div>

                {/* IMAGE UPLOAD */}
                <div className="space-y-3">
                  <label className="text-[11px] font-black uppercase text-gray-400 tracking-widest ml-2">Visuel de l'événement</label>
                  <div className="relative group h-56 bg-dark/5 rounded-[2.5rem] border-2 border-dashed border-dark/10 overflow-hidden flex items-center justify-center hover:border-primary transition-all cursor-pointer">
                    {imagePreview ? (
                      <>
                        <img src={imagePreview} className="w-full h-full object-cover" alt="" />
                        <div className="absolute inset-0 bg-dark/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white font-bold gap-2"><Upload /> Remplacer</div>
                      </>
                    ) : (
                      <div className="text-center space-y-2 opacity-40"><Upload className="mx-auto" size={40} /><p className="text-xs font-black uppercase tracking-tighter">Cliquez pour uploader</p></div>
                    )}
                    <input type="file" accept="image/*" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <input required className="w-full p-4 bg-dark/5 border-none rounded-2xl outline-none focus:ring-2 focus:ring-primary font-bold text-dark" value={title} onChange={e => setTitle(e.target.value)} placeholder="Titre de l'event" />
                  <input type="datetime-local" required className="w-full p-4 bg-dark/5 border-none rounded-2xl outline-none focus:ring-2 focus:ring-primary font-bold text-dark" value={date} onChange={e => setDate(e.target.value)} />
                </div>

                <textarea required className="w-full p-4 bg-dark/5 border-none rounded-2xl outline-none focus:ring-2 focus:ring-primary h-32 font-medium text-dark" value={description} onChange={e => setDescription(e.target.value)} placeholder="Description détaillée..." />

                <div className="grid grid-cols-2 gap-6">
                  <input required className="w-full p-4 bg-dark/5 border-none rounded-2xl outline-none focus:ring-2 focus:ring-primary font-bold text-dark" value={location} onChange={e => setLocation(e.target.value)} placeholder="Lieu (ex: Lyon)" />
                  <input type="number" required className="w-full p-4 bg-dark/5 border-none rounded-2xl outline-none focus:ring-2 focus:ring-primary font-bold text-dark" value={capacity} onChange={e => setCapacity(parseInt(e.target.value))} placeholder="Capacité (ex: 100)" />
                </div>

                {/* GRILLE TARIFAIRE */}
                <div className="space-y-4 pt-6 border-t border-dark/5">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-black text-dark italic tracking-tighter uppercase">Tarification</h3>
                    <button type="button" onClick={addPriceRow} className="text-[10px] font-black bg-primary-light text-primary px-4 py-2 rounded-full uppercase tracking-widest hover:bg-primary hover:text-white transition-all">+ Ajouter un prix</button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {prices.map((p, index) => (
                      <div key={index} className="flex gap-2 items-center bg-dark/5 p-3 rounded-2xl border border-white/50">
                        <select 
                          required
                          className="flex-1 bg-transparent p-1 text-[10px] font-black outline-none uppercase text-dark cursor-pointer"
                          value={p.category}
                          onChange={e => updatePriceRow(index, 'category', e.target.value)}
                        >
                          <option value="" disabled>Catégorie</option>
                          {CATEGORIES.map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.label}</option>
                          ))}
                        </select>
                        
                        <div className="flex items-center gap-1 bg-white/80 px-3 py-1 rounded-xl">
                          <input 
                            type="number" className="w-10 bg-transparent text-xs font-black text-primary outline-none"
                            value={p.amount} onChange={e => updatePriceRow(index, 'amount', parseFloat(e.target.value))}
                          />
                          <Euro size={12} className="text-gray-400" />
                        </div>
                        
                        <button type="button" onClick={() => removePriceRow(index)} className="text-gray-300 hover:text-primary">
                            <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* SUBMIT */}
                <div className="flex items-center justify-between pt-8 border-t border-dark/5">
                  <div className="flex items-center gap-3">
                    <input type="checkbox" id="pub" checked={isPublished} onChange={e => setIsPublished(e.target.checked)} className="w-6 h-6 accent-primary rounded-xl cursor-pointer" />
                    <label htmlFor="pub" className="text-xs font-black text-dark uppercase tracking-tighter cursor-pointer">Mettre en ligne</label>
                  </div>
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" disabled={loading} className="bg-dark text-white px-10 py-5 font-black text-lg hover:bg-primary transition-all shadow-2xl flex items-center justify-center gap-3 disabled:opacity-50">
                    {loading ? <Loader2 className="animate-spin" /> : <Save size={22} />}
                    <span>{editingEventId ? 'ENREGISTRER' : 'CRÉER L\'EVENT'}</span>
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};