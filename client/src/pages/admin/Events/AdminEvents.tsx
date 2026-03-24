import React, { useEffect, useState } from 'react';
import { useAxios } from '../../../hooks/useAxios';
import { useAuth } from '../../../context/AuthContext';
import { 
  Plus, Trash2, Calendar as CalendarIcon, MapPin, 
  Euro, Save, X, Eye, EyeOff, Edit3, Image as ImageIcon, Upload, Loader2 
} from 'lucide-react';

interface PriceRow {
  category: string;
  amount: number;
}

export const AdminEvents: React.FC = () => {
  const { request, loading, error } = useAxios();
  const [events, setEvents] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEventId, setEditingEventId] = useState<number | null>(null);

  // --- ÉTATS DU FORMULAIRE ---
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [capacity, setCapacity] = useState(0);
  const [isPublished, setIsPublished] = useState(false);
  const [prices, setPrices] = useState<PriceRow[]>([{ category: 'PUBLIC', amount: 0 }]);
  
  // --- ÉTATS POUR L'IMAGE (UPLOAD) ---
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const fetchEvents = async () => {
    try {
      const data = await request('GET', '/api/events');
      setEvents(data);
    } catch (err) { console.error(err); }
  };

  useEffect(() => { fetchEvents(); }, []);

  // Gestion du choix de l'image
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      // Créer une URL temporaire pour afficher l'image dans le formulaire
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleEdit = (event: any) => {
    setEditingEventId(event.id);
    setTitle(event.title);
    setDescription(event.description);
    setDate(event.date.substring(0, 16)); 
    setLocation(event.location || '');
    setCapacity(event.capacity);
    setIsPublished(event.isPublished);
    setPrices(event.prices || [{ category: 'PUBLIC', amount: 0 }]);
    
    // Si l'event a déjà une image, on affiche l'URL du serveur
    if (event.image) {
        setImagePreview(`http://localhost:8000${event.image}`);
    } else {
        setImagePreview(null);
    }
    
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    /**
     * TRÈS IMPORTANT : Pour envoyer un fichier, on doit utiliser FormData.
     * On ne peut pas envoyer un fichier binaire dans un JSON classique.
     */
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('date', date);
    formData.append('location', location);
    formData.append('capacity', capacity.toString());
    formData.append('isPublished', isPublished ? '1' : '0');
    
    // On ajoute le fichier image seulement s'il a été modifié/ajouté
    if (imageFile) {
        formData.append('image', imageFile);
    }

    // Le tableau de prix doit être transformé en chaîne JSON pour passer dans le FormData
    formData.append('prices', JSON.stringify(prices));

    try {
      if (editingEventId) {
        await request('POST', `/api/events/${editingEventId}/update`, formData); // Utilise POST même pour update si tu envoies des fichiers (ou gère le spoofing de méthode)
      } else {
        await request('POST', '/api/events/create', formData);
      }
      setIsModalOpen(false);
      resetForm();
      fetchEvents();
    } catch (err) { console.error(err); }
  };

  const resetForm = () => {
    setEditingEventId(null);
    setTitle(''); setDescription(''); setDate('');
    setLocation(''); setCapacity(0); setIsPublished(false);
    setPrices([{ category: 'PUBLIC', amount: 0 }]);
    setImageFile(null);
    setImagePreview(null);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Supprimer cet événement ?")) {
      try {
        await request('DELETE', `/api/events/${id}`);
        fetchEvents();
      } catch (err) { console.error(err); }
    }
  };

  const addPriceRow = () => setPrices([...prices, { category: '', amount: 0 }]);
  const removePriceRow = (index: number) => setPrices(prices.filter((_, i) => i !== index));
  const updatePriceRow = (index: number, field: keyof PriceRow, value: string | number) => {
    const newPrices = [...prices];
    newPrices[index] = { ...newPrices[index], [field]: value };
    setPrices(newPrices);
  };

  return (
    <div className="space-y-6">
      {/* HEADER PAGE */}
      <div className="flex justify-between items-center bg-white p-6 shadow-sm border border-gray-100">
        <div>
          <h1 className="text-2xl font-bold text-dark italic tracking-tighter">
            Gestion des <span className="text-primary uppercase">Événements</span>
          </h1>
          <p className="text-gray-400 text-sm font-medium">Administration de The Moroccan Network</p>
        </div>
        <button 
          onClick={() => { resetForm(); setIsModalOpen(true); }}
          className="bg-primary text-white p-4 rounded-2xl hover:bg-dark transition-all shadow-lg flex items-center gap-2 font-bold"
        >
          <Plus size={20} />
          <span>Nouvel Event</span>
        </button>
      </div>

      {/* LISTE DES ÉVÉNEMENTS */}
      <div className="grid grid-cols-1 gap-4">
        {events.map((event) => (
          <div key={event.id} className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-gray-100 flex items-center justify-between hover:shadow-md transition-all group">
            <div className="flex items-center gap-6">
               {/* Miniature Image */}
               <div className="w-20 h-20  overflow-hidden bg-gray-50 shrink-0 border border-gray-100 shadow-inner">
                  {event.image ? (
                      <img src={`http://localhost:8000${event.image}`} alt={event.title} className="w-full h-full object-cover" />
                  ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-300">
                          <ImageIcon size={28} />
                      </div>
                  )}
               </div>
               <div>
                  <h3 className="font-bold text-dark text-xl tracking-tight">{event.title}</h3>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-400 mt-1 font-medium">
                    <span className="flex items-center gap-1.5"><CalendarIcon size={14} className="text-primary"/> {new Date(event.date).toLocaleDateString()}</span>
                    <span className="flex items-center gap-1.5"><MapPin size={14} className="text-primary"/> {event.location}</span>
                    <span className="bg-primary-light/50 text-primary px-3 py-0.5 rounded-full text-xs font-bold uppercase tracking-widest">
                        {event.prices?.length} Tarifs
                    </span>
                  </div>
               </div>
            </div>
            
            <div className="flex items-center gap-3">
               <button onClick={() => handleEdit(event)} className="p-3 bg-gray-50 text-gray-400 hover:text-dark hover:bg-gray-100 rounded-2xl transition-all">
                  <Edit3 size={20} />
               </button>
               <button onClick={() => handleDelete(event.id)} className="p-3 bg-gray-50 text-gray-400 hover:text-primary hover:bg-red-50 rounded-2xl transition-all">
                  <Trash2 size={20} />
               </button>
            </div>
          </div>
        ))}
      </div>

      {/* --- MODAL DE CRÉATION / MODIFICATION --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark/70 backdrop-blur-md">
          <div className="bg-white w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl animate-in zoom-in duration-300">
            
            <form onSubmit={handleSubmit} className="p-10 space-y-8">
              <div className="flex justify-between items-center border-b border-gray-100 pb-6">
                <h2 className="text-2xl font-black text-dark tracking-tighter">
                  {editingEventId ? 'MODIFIER L\'ÉVÉNEMENT' : 'CRÉER UN ÉVÉNEMENT'}
                </h2>
                <button type="button" onClick={() => setIsModalOpen(false)} className="p-2 bg-gray-100 rounded-full text-gray-400 hover:text-primary transition-colors"><X /></button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Section Image Upload */}
                <div className="space-y-4">
                    <label className="text-[11px] font-black uppercase text-gray-400 tracking-widest">Image d'illustration</label>
                    <div className="relative group cursor-pointer h-48 bg-gray-50  border-2 border-dashed border-gray-200 overflow-hidden flex items-center justify-center hover:border-primary transition-colors">
                        {imagePreview ? (
                            <>
                                <img src={imagePreview} className="w-full h-full object-cover" alt="Preview" />
                                <div className="absolute inset-0 bg-dark/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <Upload className="text-white" size={32} />
                                </div>
                            </>
                        ) : (
                            <div className="text-center space-y-2">
                                <Upload className="mx-auto text-gray-300 group-hover:text-primary" size={32} />
                                <p className="text-xs text-gray-400 font-bold uppercase">Cliquez pour uploader</p>
                            </div>
                        )}
                        <input type="file" accept="image/*" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="space-y-1">
                        <label className="text-[11px] font-black uppercase text-gray-400 tracking-widest">Titre</label>
                        <input required className="w-full p-4 bg-gray-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-primary font-bold text-dark" 
                               value={title} onChange={e => setTitle(e.target.value)} placeholder="Soirée Networking..." />
                    </div>
                    <div className="space-y-1">
                        <label className="text-[11px] font-black uppercase text-gray-400 tracking-widest">Date et Heure</label>
                        <input type="datetime-local" required className="w-full p-4 bg-gray-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-primary font-bold text-dark" 
                               value={date} onChange={e => setDate(e.target.value)} />
                    </div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-black uppercase text-gray-400 tracking-widest">Description de l'événement</label>
                <textarea required className="w-full p-4 bg-gray-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-primary h-32 font-medium text-dark" 
                          value={description} onChange={e => setDescription(e.target.value)} placeholder="Décrivez l'activité..." />
              </div>

              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-1">
                  <label className="text-[11px] font-black uppercase text-gray-400 tracking-widest">Lieu / Ville</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-4 text-primary" size={18} />
                    <input required className="w-full pl-12 p-4 bg-gray-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-primary font-bold text-dark" 
                           value={location} onChange={e => setLocation(e.target.value)} placeholder="Ex: Lyon" />
                  </div>
                </div>
                <div className="space-y-1">
                    <label className="text-[11px] font-black uppercase text-gray-400 tracking-widest">Places disponibles</label>
                    <input type="number" required className="w-full p-4 bg-gray-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-primary font-bold text-dark" 
                           value={capacity} onChange={e => setCapacity(parseInt(e.target.value))} placeholder="100" />
                </div>
              </div>

              {/* SECTION TARIFS */}
              <div className="space-y-4 pt-6 border-t border-gray-50">
                <div className="flex justify-between items-center">
                  <h3 className="font-black text-dark italic tracking-tighter">GRILLE TARIFAIRE</h3>
                  <button type="button" onClick={addPriceRow} className="text-[10px] uppercase tracking-widest bg-primary-light text-primary px-4 py-2 rounded-full font-black hover:bg-primary hover:text-white transition-all">
                    + Ajouter un prix
                  </button>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {prices.map((price, index) => (
                    <div key={index} className="flex gap-2 items-center bg-gray-50 p-3 rounded-2xl border border-gray-100 group">
                        <input 
                        placeholder="CATÉGORIE" 
                        className="flex-1 bg-transparent p-1 text-xs font-black outline-none uppercase placeholder:text-gray-300"
                        value={price.category}
                        onChange={e => updatePriceRow(index, 'category', e.target.value)}
                        />
                        <div className="flex items-center gap-1 bg-white px-3 py-1.5 rounded-xl border border-gray-200">
                            <input 
                                type="number" 
                                className="w-12 bg-transparent text-sm outline-none text-right font-black text-primary"
                                value={price.amount}
                                onChange={e => updatePriceRow(index, 'amount', parseFloat(e.target.value))}
                            />
                            <Euro size={12} className="text-gray-300" />
                        </div>
                        <button type="button" onClick={() => removePriceRow(index)} className="text-gray-300 hover:text-primary transition-colors">
                            <Trash2 size={16} />
                        </button>
                    </div>
                    ))}
                </div>
              </div>

              {/* SUBMIT BUTTON */}
              <div className="flex items-center justify-between pt-8 border-t border-gray-100">
                <div className="flex items-center gap-3">
                    <div className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${isPublished ? 'bg-primary' : 'bg-gray-200'}`}>
                        <input type="checkbox" id="pub" checked={isPublished} onChange={e => setIsPublished(e.target.checked)} className="absolute h-full w-full opacity-0 cursor-pointer z-10" />
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isPublished ? 'translate-x-6' : 'translate-x-1'}`} />
                    </div>
                    <label htmlFor="pub" className="text-sm font-black text-dark uppercase tracking-tighter cursor-pointer">Publier sur le site</label>
                </div>

                <button 
                    type="submit" 
                    disabled={loading}
                    className="bg-dark text-white px-10 py-5  font-black text-lg hover:bg-primary transition-all shadow-2xl flex items-center justify-center gap-3 disabled:bg-gray-400 group"
                >
                    {loading ? <Loader2 className="animate-spin" /> : <Save className="group-hover:scale-110 transition-transform" />}
                    {editingEventId ? 'METTRE À JOUR' : 'CRÉER L\'ÉVÉNEMENT'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};