import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAxios } from '../../../hooks/useAxios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, MapPin, Mail, CreditCard, ChevronLeft, 
  ShieldCheck, Lock, Loader2, AlertCircle 
} from 'lucide-react';

export const EventDetailPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { request, loading } = useAxios();
  const [event, setEvent] = useState<any>(null);

  // --- ÉTATS DE VÉRIFICATION ---
  const [verifyingEmail, setVerifyingEmail] = useState(false);
  const [memberInfo, setMemberInfo] = useState<{isMember: boolean, type: string, firstName?: string} | null>(null);
  
  const [bookingForm, setBookingForm] = useState({
    firstName: '', lastName: '', email: '', category: '', amount: 0
  });

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const data = await request('GET', `/api/events`); 
        const current = data.find((e: any) => e.id.toString() === id);
        setEvent(current);
      } catch (err) { console.error(err); }
    };
    fetchEvent();
  }, [id]);

  // FONCTION DE VÉRIFICATION D'ADHÉSION
  const checkMembership = async (email: string) => {
    if (!email.includes('@') || email.length < 5) return;
    
    setVerifyingEmail(true);
    setMemberInfo(null); // Reset
    try {
      const data = await request('GET', `/api/membership/check/${email}`);
      setMemberInfo(data);
      // Optionnel : On pré-remplit le prénom si trouvé
      if (data.firstName) setBookingForm(prev => ({...prev, firstName: data.firstName}));
    } catch (err) {
      setMemberInfo({ isMember: false, type: '' });
    } finally {
      setVerifyingEmail(false);
    }
  };

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
          className="flex items-center gap-2 text-gray-400 text-[10px] font-black uppercase tracking-widest hover:text-primary transition-colors"
        >
          <ChevronLeft size={14} /> Retour à l'agenda
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-12 grid grid-cols-1 lg:grid-cols-12 gap-16">
        
        {/* --- COLONNE GAUCHE : DÉTAILS --- */}
        <div className="lg:col-span-7 space-y-12">
          <header className="space-y-6">
            <h1 className="text-5xl md:text-7xl font-black text-dark uppercase italic tracking-tighter leading-none">
              {event.title}
            </h1>
            <div className="flex flex-wrap gap-8 py-8 border-y border-gray-100">
               <div className="flex items-center gap-4">
                  <div className="p-3 bg-primary text-white"><Calendar size={20}/></div>
                  <div>
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Date de l'événement</p>
                    <p className="font-bold text-dark uppercase">{new Date(event.date).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
                  </div>
               </div>
               <div className="flex items-center gap-4">
                  <div className="p-3 bg-primary text-white"><MapPin size={20}/></div>
                  <div>
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Lieu de rendez-vous</p>
                    <p className="font-bold text-dark uppercase">{event.location}</p>
                  </div>
               </div>
            </div>
          </header>

          <div className="grayscale hover:grayscale-0 transition-all duration-1000 shadow-2xl border border-gray-100">
             <img 
               src={event.image ? `http://localhost:8000${event.image}` : '/placeholder.jpg'} 
               className="w-full h-[450px] object-cover"
               alt=""
             />
          </div>

          <div className="max-w-2xl">
             <p className="text-gray-500 font-medium text-lg leading-relaxed whitespace-pre-line">
                {event.description}
             </p>
          </div>
        </div>

        {/* --- COLONNE DROITE : RÉSERVATION --- */}
        <div className="lg:col-span-5">
          <div className="sticky top-32 bg-dark p-10 text-white shadow-2xl border-t-[12px] border-primary">
            <div className="mb-10">
                <h2 className="text-3xl font-black uppercase tracking-tighter italic">Billeterie Officielle<span className="text-primary">.</span></h2>
                <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mt-2">The Moroccan Network Service</p>
            </div>
            
            <form onSubmit={handleBookingSubmit} className="space-y-8">
              {/* INPUTS D'IDENTITÉ */}
              <div className="space-y-6">
                <div className="relative group">
                  <input 
                    type="email" required placeholder="VOTRE EMAIL D'ADHÉRENT"
                    className="w-full p-4 bg-white/5 border-b-2 border-white/10 focus:border-primary outline-none font-bold text-white transition-all uppercase text-xs tracking-widest"
                    onBlur={(e) => checkMembership(e.target.value)}
                    onChange={e => setBookingForm({...bookingForm, email: e.target.value})}
                  />
                  {/* Petit indicateur de chargement pendant la vérif */}
                  {verifyingEmail && <div className="absolute right-4 top-4"><Loader2 className="animate-spin text-primary" size={18}/></div>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <input 
                    required placeholder="PRÉNOM"
                    value={bookingForm.firstName}
                    className="w-full p-4 bg-white/5 border-b-2 border-white/10 focus:border-primary outline-none font-bold text-white text-xs"
                    onChange={e => setBookingForm({...bookingForm, firstName: e.target.value})}
                  />
                  <input 
                    required placeholder="NOM"
                    className="w-full p-4 bg-white/5 border-b-2 border-white/10 focus:border-primary outline-none font-bold text-white text-xs"
                    onChange={e => setBookingForm({...bookingForm, lastName: e.target.value})}
                  />
                </div>
              </div>

              {/* MESSAGES D'ÉTAT MEMBRE */}
              <AnimatePresence>
                {memberInfo && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                    className={`p-4 text-[10px] font-black uppercase tracking-widest border ${
                        memberInfo.isMember ? 'bg-green-500/10 border-green-500 text-green-500' : 'bg-primary/10 border-primary text-primary'
                    }`}
                  >
                    {memberInfo.isMember 
                        ? `Statut Membre ${memberInfo.type} Confirmé. Tarifs débloqués.` 
                        : "Email non reconnu. Tarifs Adhérents indisponibles."}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* CHOIX DU TARIF AVEC LOGIQUE DE FILTRAGE */}
              <div className="space-y-4">
                <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em]">Tarifs éligibles</p>
                <div className="space-y-2">
                  {event.prices.filter((p:any) => p.category !== 'STAFF').map((p: any, i: number) => {
                    
                    const isAdherentTariff = p.category.includes('ADHERENT');
                    const isMatch = memberInfo?.isMember && p.category.includes(memberInfo.type);
                    const isLocked = isAdherentTariff && !isMatch;

                    return (
                      <label 
                        key={i} 
                        className={`flex justify-between items-center p-5 border transition-all duration-500 ${
                          isLocked 
                          ? 'opacity-20 grayscale cursor-not-allowed border-white/5' 
                          : 'cursor-pointer hover:border-primary bg-white/5'
                        } ${bookingForm.category === p.category ? 'border-primary bg-primary/20' : 'border-white/10'}`}
                      >
                        <input 
                          type="radio" name="price" className="hidden" 
                          disabled={isLocked}
                          onChange={() => setBookingForm({...bookingForm, category: p.category, amount: p.amount})} 
                        />
                        <div className="flex flex-col">
                          <span className="font-black text-[10px] uppercase tracking-widest">{p.category}</span>
                          {isLocked && <span className="text-[7px] text-primary font-bold mt-1">RÉSERVÉ AUX MEMBRES {p.category.includes('STUDENT') ? 'ÉTUDIANTS' : ''}</span>}
                        </div>
                        <span className="font-black text-xl tracking-tighter">{p.amount}€</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* MESSAGE POUR NON-ADHÉRENTS ÉTUDIANTS */}
              {!memberInfo?.isMember && (
                <div className="flex gap-3 p-4 bg-white/5 border border-white/10 italic text-[10px] text-gray-400">
                  <AlertCircle size={16} className="shrink-0" />
                  <p>Vous êtes étudiant ? <Link to="/adhesion" className="text-primary font-bold underline">Adhérez pour 30€</Link> et économisez sur tous vos billets.</p>
                </div>
              )}

              <button 
                type="submit" 
                disabled={loading || !bookingForm.category}
                className="w-full py-6 bg-primary text-white font-black text-xs tracking-[0.3em] hover:bg-white hover:text-dark transition-all flex items-center justify-center gap-3 disabled:opacity-20"
              >
                {loading ? "TRAITEMENT..." : `PAYER ${bookingForm.amount}€`}
                <CreditCard size={18} />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};