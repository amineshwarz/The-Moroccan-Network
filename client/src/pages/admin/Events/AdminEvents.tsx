import React, { useEffect, useState } from 'react';
import { useAxios } from '../../../hooks/useAxios';
import { 
  Plus, Trash2, Calendar as CalendarIcon, MapPin, 
  Euro, Save, X, ChevronRight, Eye, EyeOff, Edit3, Image as ImageIcon
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
  const [location, setLocation] = useState(''); // État pour le Lieu
  const [image, setImage] = useState('');       // État pour l'URL de l'image
  const [capacity, setCapacity] = useState(0);
  const [isPublished, setIsPublished] = useState(false);
  const [prices, setPrices] = useState<PriceRow[]>([{ category: 'PUBLIC', amount: 0 }]);

  const fetchEvents = async () => {
    try {
      const data = await request('GET', '/api/events/');
      setEvents(data);
    } catch (err) { console.error(err); }
  };

  useEffect(() => { fetchEvents(); }, []);

  // --- LOGIQUE DE PRÉ-REMPLISSAGE POUR MODIFICATION ---
  const handleEdit = (event: any) => {
    setEditingEventId(event.id);
    setTitle(event.title);
    setDescription(event.description);
    setDate(event.date.substring(0, 16)); 
    setLocation(event.location || ''); // On remplit le lieu
    setImage(event.image || '');       // On remplit l'image
    setCapacity(event.capacity);
    setIsPublished(event.isPublished);
    setPrices(event.prices || [{ category: 'PUBLIC', amount: 0 }]);
    setIsModalOpen(true);
  };

  // --- SOUMISSION ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { 
        title, 
        description, 
        date, 
        location, // Envoyé au backend
        image,    // Envoyé au backend
        capacity, 
        isPublished, 
        prices 
    };

    try {
      if (editingEventId) {
        await request('PATCH', `/api/events/${editingEventId}/update`, payload);
      } else {
        await request('POST', '/api/events/create', payload);
      }
      setIsModalOpen(false);
      resetForm();
      fetchEvents();
    } catch (err) { console.error(err); }
  };

  const resetForm = () => {
    setEditingEventId(null);
    setTitle(''); setDescription(''); setDate('');
    setLocation(''); setImage(''); // On vide les nouveaux champs
    setCapacity(0); setIsPublished(false);
    setPrices([{ category: 'PUBLIC', amount: 0 }]);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Supprimer cet événement ?")) {
      try {
        await request('DELETE', `/api/events/${id}`);
        fetchEvents();
      } catch (err) { console.error(err); }
    }
  };

  // Helpers pour les prix
  const addPriceRow = () => setPrices([...prices, { category: '', amount: 0 }]);
  const removePriceRow = (index: number) => setPrices(prices.filter((_, i) => i !== index));
  const updatePriceRow = (index: number, field: keyof PriceRow, value: string | number) => {
    const newPrices = [...prices];
    newPrices[index] = { ...newPrices[index], [field]: value };
    setPrices(newPrices);
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex justify-between items-center bg-white p-6  shadow-sm border border-gray-100">
        <div>
          <h1 className="text-2xl font-bold text-dark italic">Gestion des <span className="text-primary uppercase">Événements</span></h1>
          <p className="text-gray-400 text-sm">Organisez les activités de The Moroccan Network.</p>
        </div>
        <button 
          onClick={() => { resetForm(); setIsModalOpen(true); }}
          className="bg-primary text-white p-4 rounded-2xl hover:bg-dark transition-all shadow-lg flex items-center gap-2 font-bold"
        >
          <Plus size={20} />
          <span>Nouvel Event</span>
        </button>
      </div>

      {/* LISTE DES EVENTS */}
      <div className="grid grid-cols-1 gap-4">
        {events.map((event) => (
          <div key={event.id} className="bg-white p-6  shadow-sm border border-gray-100 flex items-center justify-between hover:shadow-md transition-all">
            <div className="flex items-center gap-6">
               {/* Affichage de la miniature de l'image si elle existe */}
               <div className="w-16 h-16 rounded-2xl overflow-hidden bg-gray-100 shrink-0 border border-gray-100">
                  {event.image ? (
                      <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
                  ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-300">
                          <ImageIcon size={24} />
                      </div>
                  )}
               </div>
               <div>
                  <h3 className="font-bold text-dark text-lg">{event.title}</h3>
                  <div className="flex gap-4 text-sm text-gray-400 mt-1">
                    <span className="flex items-center gap-1"><MapPin size={14}/> {event.location}</span>
                    <span className="flex items-center gap-1 font-bold text-primary italic underline decoration-primary-light">
                        {event.prices?.length} catégories de prix
                    </span>
                  </div>
               </div>
            </div>
            
            <div className="flex items-center gap-2">
               <button onClick={() => handleEdit(event)} className="p-3 text-gray-400 hover:text-dark hover:bg-gray-100 rounded-xl transition-all">
                  <Edit3 size={20} />
               </button>
               <button onClick={() => handleDelete(event.id)} className="p-3 text-gray-400 hover:text-primary hover:bg-red-50 rounded-xl transition-all">
                  <Trash2 size={20} />
               </button>
            </div>
          </div>
        ))}
      </div>

      {/* --- MODAL (CREATE / UPDATE) --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto  shadow-2xl animate-in zoom-in duration-200">
            
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="flex justify-between items-center border-b pb-4">
                <h2 className="text-xl font-bold text-dark">
                  {editingEventId ? 'Modifier l\'événement' : 'Nouvel Événement'}
                </h2>
                <button type="button" onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-primary"><X /></button>
              </div>

              {/* Champs de base */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase text-gray-400 ml-2">Titre</label>
                  <input required className="w-full p-3 bg-gray-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-primary" 
                         value={title} onChange={e => setTitle(e.target.value)} placeholder="Nom de l'event" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase text-gray-400 ml-2">Date et Heure</label>
                  <input type="datetime-local" required className="w-full p-3 bg-gray-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-primary" 
                         value={date} onChange={e => setDate(e.target.value)} />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-gray-400 ml-2">Description</label>
                <textarea required className="w-full p-3 bg-gray-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-primary h-24" 
                          value={description} onChange={e => setDescription(e.target.value)} placeholder="Détails de l'événement..." />
              </div>

              {/* NOUVEAUX CHAMPS : LIEU ET IMAGE */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase text-gray-400 ml-2">Lieu / Ville</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 text-gray-400" size={18} />
                    <input required className="w-full pl-10 p-3 bg-gray-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-primary" 
                           value={location} onChange={e => setLocation(e.target.value)} placeholder="Ex: Lyon" />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase text-gray-400 ml-2">URL de l'image</label>
                  <div className="relative">
                    <ImageIcon className="absolute left-3 top-3 text-gray-400" size={18} />
                    <input className="w-full pl-10 p-3 bg-gray-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-primary" 
                           value={image} onChange={e => setImage(e.target.value)} placeholder="https://..." />
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-gray-400 ml-2">Capacité Max</label>
                <input type="number" required className="w-full p-3 bg-gray-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-primary" 
                       value={capacity} onChange={e => setCapacity(parseInt(e.target.value))} placeholder="Nombre de places" />
              </div>

              {/* Section Tarifs */}
              <div className="space-y-4 pt-4 border-t border-gray-50">
                <div className="flex justify-between items-center">
                  <h3 className="font-bold text-dark italic">Grille Tarifaire</h3>
                  <button type="button" onClick={addPriceRow} className="text-xs bg-primary-light text-primary px-3 py-1 rounded-full font-bold hover:bg-primary hover:text-white transition">
                    + Ajouter un tarif
                  </button>
                </div>
                
                {prices.map((price, index) => (
                  <div key={index} className="flex gap-3 items-center bg-gray-50 p-2 rounded-xl">
                    <input 
                      placeholder="Catégorie (ex: STAFF)" 
                      className="flex-1 bg-transparent p-2 text-sm outline-none border-b border-gray-200 focus:border-primary uppercase"
                      value={price.category}
                      onChange={e => updatePriceRow(index, 'category', e.target.value)}
                    />
                    <div className="flex items-center gap-1 bg-white px-3 py-1 rounded-lg border border-gray-200">
                      <input 
                        type="number" 
                        placeholder="0" 
                        className="w-16 bg-transparent text-sm outline-none text-right font-bold"
                        value={price.amount}
                        onChange={e => updatePriceRow(index, 'amount', parseFloat(e.target.value))}
                      />
                      <span className="text-gray-400 font-bold">€</span>
                    </div>
                    <button type="button" onClick={() => removePriceRow(index)} className="text-gray-300 hover:text-primary p-2">
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
              </div>

              {/* Footer Modal */}
              <div className="flex items-center justify-between pt-6">
                <div className="flex items-center gap-2">
                    <input type="checkbox" id="pub" checked={isPublished} onChange={e => setIsPublished(e.target.checked)} className="accent-primary w-5 h-5" />
                    <label htmlFor="pub" className="text-sm font-bold text-dark italic">Publier l'événement</label>
                </div>

                <button 
                    type="submit" 
                    disabled={loading}
                    className="bg-dark text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-primary transition-all shadow-xl flex items-center justify-center gap-3 disabled:bg-gray-300"
                >
                    <Save /> {loading ? 'Enregistrement...' : editingEventId ? 'Mettre à jour' : 'Créer l\'événement'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};