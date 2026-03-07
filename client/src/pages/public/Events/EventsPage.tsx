import React, { useEffect, useState } from 'react';
import { useAxios } from '../../../hooks/useAxios';
import { Calendar, MapPin, Users, ArrowRight } from 'lucide-react';

export const EventsPage: React.FC = () => {
  const [events, setEvents] = useState<any[]>([]);
  const { request, loading } = useAxios();

  useEffect(() => {
    const fetchEvents = async () => {
      // On appelle l'API publique (qui ne renvoie que les événements isPublished: true)
      const data = await request('GET', '/api/events');
      setEvents(data);
    };
    fetchEvents();
  }, []);

  if (loading) return <div className="p-20 text-center text-primary font-bold">Chargement des événements...</div>;

  return (
    <div className="py-16 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4">
        
        <header className="mb-12">
          <h1 className="text-4xl font-black text-dark mb-2 uppercase tracking-tighter">
            Prochains <span className="text-primary">Événements</span>
          </h1>
          <p className="text-gray-500">Découvrez et participez aux activités de The Moroccan Network.</p>
        </header>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event) => (
            <div key={event.id} className="bg-white  overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 group">
              
              {/* Image de l'événement */}
              <div className="h-56 relative overflow-hidden">
                <img 
                  src={event.image ? `http://localhost:8000${event.image}` : '/placeholder-event.jpg'} 
                  // alt={event.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                />
                
              </div>

              <div className="p-8">
                <div className="flex items-center gap-2 text-primary font-bold text-sm mb-3">
                <div className=" bg-primary text-white px-4 py-1 rounded-full text-xs font-bold shadow-lg">
                  {event.prices[0]?.amount || 0} €
                </div>
                  <Calendar size={16} />
                  {new Date(event.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })}
                </div>

                <h2 className="text-xl font-bold text-dark mb-3 group-hover:text-primary transition-colors">
                  {event.title}
                </h2>

                <div className="space-y-2 mb-6">
                  <p className="text-gray-400 text-sm flex items-center gap-2">
                    <MapPin size={14} /> {event.location}
                  </p>
                  <p className="text-gray-500 text-sm line-clamp-2">
                    {event.description}
                  </p>
                </div>

                <button className="w-full bg-dark text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-primary transition-all group">
                  Réserver ma place
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

