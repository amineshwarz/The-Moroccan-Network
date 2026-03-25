import React, { useEffect, useState } from 'react';
import { useAxios } from '../../../hooks/useAxios';
import { 
  Calendar, 
  MapPin, 
  Tag, 
  ArrowRight, 
  Info,
  X,
  User,
  Mail,
  CreditCard
} from 'lucide-react';

export const EventsPage: React.FC = () => {
  const [events, setEvents] = useState<any[]>([]);
  const { request, loading, error } = useAxios();

  // --- ÉTATS POUR LA RÉSERVATION ---
  // Stocke l'événement sélectionné pour la modal (null = modal fermée)
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null);
  
  // Données du formulaire de réservation
  const [bookingForm, setBookingForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    category: '',
    amount: 0
  });

  const fetchEvents = async () => {
    try {
      const data = await request('GET', '/api/events');
      setEvents(data);
    } catch (err) {
      console.error("Erreur chargement events", err);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // Soumission du formulaire vers HelloAsso
  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // On appelle la route Symfony : /api/payment/event/{id}/ticket
      const response = await request('POST', `/api/payment/event/${selectedEvent.id}/ticket`, {
        ...bookingForm,
        amount: bookingForm.amount * 100 // Conversion Euros -> Centimes pour le backend
      });

      if (response.redirectUrl) {
        window.location.href = response.redirectUrl; // Redirection vers HelloAsso
      }
    } catch (err) {
      alert("Une erreur est survenue lors de la préparation du paiement.");
    }
  };

  if (loading && events.length === 0) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>
  );

  return (
    <div className="py-20 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4">
        
        <header className="mb-16 text-center">
          <h1 className="text-5xl font-black text-dark mb-4 tracking-tighter uppercase">
            Nos <span className="text-primary italic">Événements</span>
          </h1>
          <p className="text-gray-500 max-w-2xl mx-auto font-medium">
            Participez à la vie de la communauté. Réservez vos places en ligne en quelques clics.
          </p>
        </header>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
          {events.map((event) => (
            <div key={event.id} className="bg-white rounded-[3rem] overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 border border-gray-100 flex flex-col h-full group">
              
              {/* Image de l'événement */}
              <div className="h-64 relative overflow-hidden">
                <img 
                  src={event.image ? `http://localhost:8000${event.image}` : '/placeholder-event.jpg'} 
                  alt={event.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
                />
                <div className="absolute top-6 left-6 bg-dark/80 backdrop-blur-md text-white px-4 py-2 rounded-2xl text-xs font-black tracking-widest uppercase border border-white/20">
                   {new Date(event.date).toLocaleDateString('fr-FR', { month: 'short', day: 'numeric' })}
                </div>
              </div>

              {/* Contenu de la Card */}
              <div className="p-8 flex-1 flex flex-col">
                <div className="flex items-center gap-2 text-primary font-bold text-sm mb-4">
                  <MapPin size={16} />
                  {event.location}
                </div>

                <h2 className="text-2xl font-black text-dark mb-4 leading-tight">
                  {event.title}
                </h2>

                <p className="text-gray-500 text-sm mb-8 line-clamp-3 leading-relaxed">
                  {event.description}
                </p>

                {/* --- GRILLE TARIFAIRE --- */}
                <div className="bg-gray-50 rounded-3xl p-6 mb-8 border border-gray-100">
                  <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <Tag size={12} className="text-primary" /> Tarifs disponibles
                  </h3>
                  <div className="space-y-3">
                    {event.prices && event.prices.length > 0 ? (
                      event.prices
                      .filter((p: any) => p.category !== 'STAFF') 
                      .map((p: any, idx: number) => (
                        <div key={idx} className="flex justify-between items-center">
                          <span className="text-xs font-bold text-dark uppercase">{p.category}</span>
                          <span className="text-sm font-black text-primary">
                            {p.amount === 0 ? 'GRATUIT' : `${p.amount} €`}
                          </span>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-gray-400 italic">Aucun tarif défini</p>
                    )}
                  </div>
                </div>

                {/* Bouton d'action qui ouvre la modal */}
                <button 
                  onClick={() => setSelectedEvent(event)}
                  className="mt-auto w-full bg-dark text-white py-4 font-black flex items-center justify-center gap-3 hover:bg-primary transition-all shadow-lg group"
                >
                  RÉSERVER MA PLACE
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* --- MODAL DE RÉSERVATION (S'affiche si un event est sélectionné) --- */}
        {selectedEvent && (
          <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-dark/80 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white w-full max-w-md rounded-[3rem] shadow-2xl p-8 md:p-10 relative animate-in zoom-in duration-300 overflow-y-auto max-h-[95vh]">
              
              {/* Bouton fermer */}
              <button 
                onClick={() => setSelectedEvent(null)} 
                className="absolute top-6 right-6 p-2 bg-gray-100 rounded-full text-gray-400 hover:text-primary transition-colors"
              >
                <X size={20} />
              </button>
              
              <h2 className="text-2xl font-black text-dark mb-1 tracking-tighter">RÉSERVATION</h2>
              <p className="text-primary font-bold mb-8 italic text-sm">{selectedEvent.title}</p>

              <form onSubmit={handleBookingSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-400 ml-2 uppercase">Prénom</label>
                    <input 
                      required className="w-full p-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-primary font-bold text-dark text-sm" 
                      onChange={e => setBookingForm({...bookingForm, firstName: e.target.value})}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-400 ml-2 uppercase">Nom</label>
                    <input 
                      required className="w-full p-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-primary font-bold text-dark text-sm" 
                      onChange={e => setBookingForm({...bookingForm, lastName: e.target.value})}
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 ml-2 uppercase">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-4 text-gray-300" size={18} />
                    <input 
                      type="email" required className="w-full pl-12 p-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-primary font-bold text-dark text-sm" 
                      onChange={e => setBookingForm({...bookingForm, email: e.target.value})}
                    />
                  </div>
                </div>

                {/* SÉLECTION DU TARIF */}
                <div className="space-y-3 pt-2">
                  <label className="text-[10px] font-black text-gray-400 ml-2 uppercase tracking-widest">Choisir votre tarif</label>
                  <div className="space-y-2">
                    {selectedEvent.prices
                      .filter((p: any) => p.category !== 'STAFF') // Sécurité : pas de tarif staff ici
                      .map((p: any, i: number) => (
                        <label 
                          key={i} 
                          className={`flex justify-between items-center p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                            bookingForm.category === p.category ? 'border-primary bg-primary-light/10' : 'border-gray-100 hover:border-primary-light'
                          }`}
                        >
                          <input 
                            type="radio" name="event_price" required className="hidden"
                            onChange={() => setBookingForm({...bookingForm, category: p.category, amount: p.amount})} 
                          />
                          <span className="font-bold text-dark text-xs uppercase">{p.category}</span>
                          <span className="font-black text-primary">{p.amount === 0 ? 'GRATUIT' : `${p.amount} €`}</span>
                        </label>
                    ))}
                  </div>
                </div>

                {/* Bouton de paiement */}
                <button 
                  type="submit" 
                  disabled={loading || !bookingForm.category} 
                  className="w-full mt-4 bg-dark text-white py-5 font-black text-lg hover:bg-primary transition-all shadow-xl disabled:bg-gray-200 flex items-center justify-center gap-3 shadow-primary/20"
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-white"></div>
                  ) : (
                    <>
                      <span>PAYER {bookingForm.amount} €</span>
                      <CreditCard size={20} />
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* ... (Message si 0 events) ... */}
      </div>
    </div>
  );
};