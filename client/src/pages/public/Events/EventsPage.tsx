// src/pages/public/Events/EventsPage.tsx
import React, { useEffect, useState } from 'react';
import { useAxios } from '../../../hooks/useAxios';
import { motion } from 'framer-motion';
import { Calendar, MapPin, ArrowRight, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const EventsPage: React.FC = () => {
  const [events, setEvents] = useState<any[]>([]);
  const { request, loading } = useAxios();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await request('GET', '/api/events');
        setEvents(data);
      } catch (err) {
        console.error("Erreur chargement events", err);
      }
    };
    fetchEvents();
  }, []);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-10 h-10 border-4 border-primary border-t-transparent animate-spin"></div>
    </div>
  );

  return (
    <div className="bg-white min-h-screen">
      {/* --- HERO SECTION --- */}
      <section className="bg-dark text-white pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          <span className="text-primary font-bold tracking-[0.4em] text-xs uppercase block mb-4">Agenda Officiel</span>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase italic">
            Événements<span className="text-primary">.</span>
          </h1>
          <p className="mt-6 text-gray-400 max-w-xl font-medium text-lg">
            Participez à nos rencontres professionnelles, culturelles et solidaires.
          </p>
        </div>
      </section>

      {/* --- GRILLE D'ÉVÉNEMENTS (STYLE CARRÉ/INSTITUTIONNEL) --- */}
      <div className="max-w-7xl mx-auto px-4 py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {events.map((event) => (
            <motion.div 
              key={event.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="group cursor-pointer border border-gray-100 bg-white hover:border-primary transition-all duration-300"
              onClick={() => navigate(`/evenements/${event.id}`)} // On redirige vers la page détail
            >
              {/* Image sans arrondis pour le côté institutionnel */}
              <div className="h-64 overflow-hidden relative grayscale group-hover:grayscale-0 transition-all duration-700">
                <img 
                  src={event.image ? `http://localhost:8000${event.image}` : '/placeholder-event.jpg'} 
                  alt={event.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute bottom-0 left-0 bg-primary text-white px-4 py-2 font-black text-xs uppercase">
                    {new Date(event.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                </div>
              </div>

              <div className="p-8">
                <div className="flex items-center gap-2 text-gray-400 font-bold text-[10px] uppercase tracking-widest mb-4">
                  <MapPin size={12} className="text-primary" />
                  {event.location}
                </div>

                <h2 className="text-2xl font-black text-dark mb-4 leading-tight uppercase tracking-tighter group-hover:text-primary transition-colors">
                  {event.title}
                </h2>

                <p className="text-gray-500 text-sm mb-8 line-clamp-2 font-medium">
                  {event.description}
                </p>

                <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                   <span className="text-[10px] font-black text-dark uppercase tracking-widest">Voir les détails</span>
                   <ArrowRight size={18} className="text-primary group-hover:translate-x-2 transition-transform" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {events.length === 0 && (
            <div className="text-center py-20 border-2 border-dashed border-gray-100">
                <Info size={40} className="mx-auto text-gray-200 mb-4" />
                <p className="text-gray-400 font-bold uppercase tracking-widest">Aucun événement prévu pour le moment</p>
            </div>
        )}
      </div>
    </div>
  );
};