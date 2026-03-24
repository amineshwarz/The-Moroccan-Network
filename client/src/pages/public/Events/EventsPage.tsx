import React, { useEffect, useState } from 'react';
import { useAxios } from '../../../hooks/useAxios';
import { 
  Calendar, 
  MapPin, 
  Tag, 
  ArrowRight, 
  Info 
} from 'lucide-react';

export const EventsPage: React.FC = () => {
  const [events, setEvents] = useState<any[]>([]);
  const { request, loading, error } = useAxios();

  const fetchEvents = async () => {
    try {
      // On appelle l'URL sans le slash à la fin pour éviter les 404
      const data = await request('GET', '/api/events');
      setEvents(data);
    } catch (err) {
      console.error("Erreur chargement events", err);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  if (loading) return (
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
          <p className="text-gray-500 max-w-2xl mx-auto">
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
                      .filter((p: any) => p.category !== 'STAFF',) 
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

                {/* Bouton d'action */}
                <button className="mt-auto w-full bg-dark text-white py-4 rounded-[1.5rem] font-black flex items-center justify-center gap-3 hover:bg-primary transition-all shadow-lg group">
                  RÉSERVER MA PLACE
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {events.length === 0 && (
            <div className="text-center py-20 bg-white rounded-[3rem] border border-dashed border-gray-200">
                <Info size={48} className="mx-auto text-gray-200 mb-4" />
                <p className="text-gray-400 font-bold uppercase tracking-widest">Aucun événement à venir pour le moment</p>
            </div>
        )}
      </div>
    </div>
  );
};