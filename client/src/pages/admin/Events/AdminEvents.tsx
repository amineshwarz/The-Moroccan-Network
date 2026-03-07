import React, { useEffect, useState } from 'react';
import { useAxios } from '../../../hooks/useAxios';
import { 
  Plus, 
  Trash2, 
  Calendar as CalendarIcon, 
  MapPin, 
  Euro, 
  Save, 
  X,
  ChevronRight,
  Eye,
  EyeOff
} from 'lucide-react';

// Structure d'un prix pour le formulaire
interface PriceRow {
  category: string;
  amount: number;
}

export const AdminEvents: React.FC = () => {
  const { request, loading, error } = useAxios();
  const [events, setEvents] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // --- ÉTATS DU FORMULAIRE ---
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [capacity, setCapacity] = useState(0);
  const [isPublished, setIsPublished] = useState(false);
  const [prices, setPrices] = useState<PriceRow[]>([
    { category: 'PUBLIC', amount: 0 } // Un prix par défaut
  ]);

  // Chargement initial des événements
  const fetchEvents = async () => {
    try {
      const data = await request('GET', '/api/events/');
      setEvents(data);
    } catch (err) { console.error(err); }
  };

  useEffect(() => { fetchEvents(); }, []);

  // --- LOGIQUE DES PRIX DYNAMIQUES ---
  
  // Ajouter une nouvelle ligne de tarif
  const addPriceRow = () => {
    setPrices([...prices, { category: '', amount: 0 }]);
  };

  // Supprimer une ligne de tarif
  const removePriceRow = (index: number) => {
    setPrices(prices.filter((_, i) => i !== index));
  };

  // Mettre à jour une valeur dans le tableau des prix
  const updatePriceRow = (index: number, field: keyof PriceRow, value: string | number) => {
    const newPrices = [...prices];
    newPrices[index] = { ...newPrices[index], [field]: value };
    setPrices(newPrices);
  };

  // --- SOUMISSION ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      title,
      description,
      date,
      location,
      capacity,
      isPublished,
      prices
    };
    console.log("Données envoyées à Symfony :", payload);
    try {
      await request('POST', '/api/events/create', payload);
      setIsModalOpen(false);
      resetForm();
      fetchEvents(); // Recharger la liste
    } catch (err) { console.error(err); }
  };

  const resetForm = () => {
    setTitle(''); setDescription(''); setDate('');
    setLocation(''); setCapacity(0); setIsPublished(false);
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

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex justify-between items-center bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100">
        <div>
          <h1 className="text-2xl font-bold text-dark italic">Gestion des <span className="text-primary uppercase">Événements</span></h1>
          <p className="text-gray-400 text-sm">Créez et gérez vos activités et tarifs.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-primary text-white p-4 rounded-2xl hover:bg-dark transition-all shadow-lg shadow-primary/20 flex items-center gap-2 font-bold"
        >
          <Plus size={20} />
          <span>Nouvel Event</span>
        </button>
      </div>

      {/* LISTE DES EVENTS */}
      <div className="grid grid-cols-1 gap-4">
        {events.map((event) => (
          <div key={event.id} className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 flex items-center justify-between hover:shadow-md transition-shadow">
            <div className="flex items-center gap-6">
               <div className="bg-primary-light text-primary p-4 rounded-2xl">
                  <CalendarIcon size={24} />
               </div>
               <div>
                  <h3 className="font-bold text-dark text-lg">{event.title}</h3>
                  <div className="flex gap-4 text-sm text-gray-400 mt-1">
                    <span className="flex items-center gap-1"><MapPin size={14}/> {event.location}</span>
                    <span className="flex items-center gap-1"><Euro size={14}/> {event.prices?.length} tarifs</span>
                  </div>
               </div>
            </div>
            <div className="flex items-center gap-3">
               {event.isPublished ? <Eye size={18} className="text-green-500" /> : <EyeOff size={18} className="text-gray-300" />}
               <button onClick={() => handleDelete(event.id)} className="p-3 text-gray-400 hover:text-primary transition-colors">
                  <Trash2 size={20} />
               </button>
               <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-gray-300">
                  <ChevronRight size={20} />
               </div>
            </div>
          </div>
        ))}
      </div>

      {/* --- MODAL DE CRÉATION (S'affiche si isModalOpen est vrai) --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-[2.5rem] shadow-2xl animate-in zoom-in duration-200">
            
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="flex justify-between items-center border-b pb-4">
                <h2 className="text-xl font-bold text-dark">Nouvel Événement</h2>
                <button type="button" onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-primary"><X /></button>
              </div>

              {/* Champs de base */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-gray-400 ml-2">Titre</label>
                  <input required className="w-full p-3 bg-gray-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-primary" 
                         value={title} onChange={e => setTitle(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-gray-400 ml-2">Date et Heure</label>
                  <input type="datetime-local" required className="w-full p-3 bg-gray-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-primary" 
                         value={date} onChange={e => setDate(e.target.value)} />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-gray-400 ml-2">Description</label>
                <textarea required className="w-full p-3 bg-gray-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-primary h-24" 
                          value={description} onChange={e => setDescription(e.target.value)} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <input placeholder="Lieu" className="p-3 bg-gray-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-primary" 
                        value={location} onChange={e => setLocation(e.target.value)} />
                 <input type="number" placeholder="Capacité" className="p-3 bg-gray-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-primary" 
                        value={capacity} onChange={e => setCapacity(parseInt(e.target.value))} />
              </div>

              {/* --- SECTION TARIFS DYNAMIQUES --- */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-bold text-dark">Grille Tarifaire</h3>
                  <button type="button" onClick={addPriceRow} className="text-xs bg-primary-light text-primary px-3 py-1 rounded-full font-bold hover:bg-primary hover:text-white transition">
                    + Ajouter un tarif
                  </button>
                </div>
                
                {prices.map((price, index) => (
                  <div key={index} className="flex gap-3 animate-in slide-in-from-left-2 duration-300">
                    <input 
                      placeholder="Catégorie (ex: ADHERENT)" 
                      className="flex-1 p-2 text-sm bg-gray-50 border-b-2 border-transparent focus:border-primary outline-none"
                      value={price.category}
                      onChange={e => updatePriceRow(index, 'category', e.target.value.toUpperCase())}
                    />
                    <input 
                      type="number" 
                      placeholder="Prix €" 
                      className="w-24 p-2 text-sm bg-gray-50 border-b-2 border-transparent focus:border-primary outline-none"
                      value={price.amount}
                      onChange={e => updatePriceRow(index, 'amount', parseFloat(e.target.value))}
                    />
                    {prices.length > 1 && (
                      <button type="button" onClick={() => removePriceRow(index)} className="text-gray-300 hover:text-primary">
                        <Trash2 size={18} />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-2 pt-4">
                 <input type="checkbox" id="pub" checked={isPublished} onChange={e => setIsPublished(e.target.checked)} className="accent-primary w-5 h-5" />
                 <label htmlFor="pub" className="text-sm font-bold text-dark italic">Publier immédiatement sur le site</label>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-dark text-white py-4 rounded-2xl font-bold text-lg hover:bg-primary transition-all shadow-xl flex items-center justify-center gap-3"
              >
                <Save /> {loading ? 'Enregistrement...' : 'Enregistrer l\'événement'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};