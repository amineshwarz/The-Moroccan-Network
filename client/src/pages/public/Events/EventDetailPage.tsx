// src/pages/public/Events/EventDetailPage.tsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAxios } from '../../../hooks/useAxios';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Mail, CreditCard, ChevronLeft, Check } from 'lucide-react';

export const EventDetailPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { request, loading } = useAxios();
  const [event, setEvent] = useState<any>(null);
  
  const [bookingForm, setBookingForm] = useState({
    firstName: '', lastName: '', email: '', category: '', amount: 0
  });

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const data = await request('GET', `/api/events`); 
        // En prod, utilise une route /api/events/{id} spécifique
        const current = data.find((e: any) => e.id.toString() === id);
        setEvent(current);
      } catch (err) { console.error(err); }
    };
    fetchEvent();
  }, [id]);

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await request('POST', `/api/payment/event/${id}/ticket`, {
        ...bookingForm,
        amount: bookingForm.amount * 100 
      });
      if (response.redirectUrl) window.location.href = response.redirectUrl;
    } catch (err) { alert("Erreur lors de la préparation du paiement."); }
  };

  if (!event) return null;

  return (
    <div className="bg-white min-h-screen pb-24">
      {/* Navigation retour */}
      <div className="max-w-7xl mx-auto px-4 pt-32">
        <button 
          onClick={() => navigate('/evenements')}
          className="flex items-center gap-2 text-gray-400 text-xs font-black uppercase tracking-widest hover:text-primary transition-colors"
        >
          <ChevronLeft size={16} /> Retour à l'agenda
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-12 grid grid-cols-1 lg:grid-cols-12 gap-16">
        
        {/* --- COLONNE GAUCHE : INFOS (7 colonnes) --- */}
        <div className="lg:col-span-7 space-y-12">
          <header className="space-y-6">
            <h1 className="text-5xl md:text-7xl font-black text-dark uppercase tracking-tighter italic leading-none">
              {event.title}
            </h1>
            <div className="flex flex-wrap gap-8 py-6 border-y border-gray-100">
               <div className="flex items-center gap-3">
                  <div className="p-3 bg-primary-light text-primary"><Calendar size={20}/></div>
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Date</p>
                    <p className="font-bold text-dark">{new Date(event.date).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
                  </div>
               </div>
               <div className="flex items-center gap-3">
                  <div className="p-3 bg-primary-light text-primary"><MapPin size={20}/></div>
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Lieu</p>
                    <p className="font-bold text-dark">{event.location}</p>
                  </div>
               </div>
            </div>
          </header>

          <div className="overflow-hidden shadow-2xl">
             <img 
               src={event.image ? `http://localhost:8000${event.image}` : '/placeholder.jpg'} 
               className="w-full h-400px object-cover grayscale hover:grayscale-0 transition-all duration-1000"
               alt=""
             />
          </div>

          <div className="prose prose-lg max-w-none">
             <p className="text-gray-500 font-medium leading-relaxed whitespace-pre-line">
                {event.description}
             </p>
          </div>
        </div>

        {/* --- COLONNE DROITE : RÉSERVATION (5 colonnes) --- */}
        <div className="lg:col-span-5">
          <div className="sticky top-32 bg-dark p-10 text-white shadow-2xl">
            <h2 className="text-3xl font-black uppercase tracking-tighter italic mb-8">Réserver</h2>
            
            <form onSubmit={handleBookingSubmit} className="space-y-6">
              <div className="space-y-4">
                <input 
                  required placeholder="PRÉNOM"
                  className="w-full p-4 bg-white/5 border-b border-white/20 focus:border-primary outline-none font-bold text-white placeholder:text-gray-600 transition-all"
                  onChange={e => setBookingForm({...bookingForm, firstName: e.target.value})}
                />
                <input 
                  required placeholder="NOM"
                  className="w-full p-4 bg-white/5 border-b border-white/20 focus:border-primary outline-none font-bold text-white placeholder:text-gray-600 transition-all"
                  onChange={e => setBookingForm({...bookingForm, lastName: e.target.value})}
                />
                <input 
                  type="email" required placeholder="ADRESSE EMAIL"
                  className="w-full p-4 bg-white/5 border-b border-white/20 focus:border-primary outline-none font-bold text-white placeholder:text-gray-600 transition-all"
                  onChange={e => setBookingForm({...bookingForm, email: e.target.value})}
                />
              </div>

              {/* CHOIX DU TARIF */}
              <div className="space-y-4 pt-6">
                <p className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">Sélectionnez votre tarif</p>
                <div className="space-y-2">
                  {event.prices.filter((p:any) => p.category !== 'STAFF').map((p: any, i: number) => (
                    <label 
                      key={i} 
                      className={`flex justify-between items-center p-4 border cursor-pointer transition-all ${
                        bookingForm.category === p.category ? 'border-primary bg-primary/10 text-primary' : 'border-white/10 text-gray-400 hover:border-white/30'
                      }`}
                    >
                      <input 
                        type="radio" name="price" className="hidden" 
                        onChange={() => setBookingForm({...bookingForm, category: p.category, amount: p.amount})} 
                      />
                      <span className="font-black text-xs uppercase tracking-widest">{p.category}</span>
                      <span className="font-black text-lg">{p.amount}€</span>
                    </label>
                  ))}
                </div>
              </div>

              <button 
                type="submit" 
                disabled={loading || !bookingForm.category}
                className="w-full py-5 bg-primary text-white font-black text-lg hover:bg-white hover:text-dark transition-all flex items-center justify-center gap-3 disabled:bg-gray-800"
              >
                {loading ? "TRAITEMENT..." : "CONFIRMER LA PLACE"}
                <CreditCard size={20} />
              </button>
              
              <p className="text-[9px] text-center text-gray-500 uppercase tracking-widest leading-relaxed">
                Le paiement sera effectué de manière sécurisée via HelloAsso. <br />Vous recevrez votre billet par email immédiatement après.
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};