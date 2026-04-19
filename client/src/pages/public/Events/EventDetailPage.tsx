import React, { useEffect, useState } from 'react';
import { CATEGORY_LABELS } from '../../../constants/categories';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAxios } from '../../../hooks/useAxios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, MapPin, Mail, CreditCard, ChevronLeft, 
  ShieldCheck, Lock, Loader2, AlertCircle, Info, Ticket 
} from 'lucide-react';

export const EventDetailPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { request, loading } = useAxios();
  const [event, setEvent] = useState<any>(null);

  // --- ÉTATS POUR LA VÉRIFICATION DYNAMIQUE ---
  const [verifying, setVerifying] = useState(false);
  // memberInfo sera null au début, puis contiendra la réponse de Symfony
  const [memberInfo, setMemberInfo] = useState<{isMember: boolean, type: string, firstName?: string} | null>(null);
  
  // Données du formulaire de réservation
  const [bookingForm, setBookingForm] = useState({
    firstName: '', lastName: '', email: '', category: '', amount: 0
  });

  // Chargement de l'événement au montage
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

  // FONCTION : Interroger Symfony pour savoir si l'email est adhérent
  const checkMembership = async (email: string) => {
    if (!email.includes('@') || email.length < 5) return;
    
    setVerifying(true);
    try {
      const data = await request('GET', `/api/membership/check/${email}`);
      setMemberInfo(data);
      // Si reconnu, on aide l'utilisateur en pré-remplissant son prénom
      if (data.isMember && data.firstName) {
        setBookingForm(prev => ({...prev, firstName: data.firstName, email: email}));
      }
    } catch (err) {
      // Si 404 ou erreur, on considère qu'il n'est pas membre
      setMemberInfo({ isMember: false, type: '' });
    } finally {
      setVerifying(false);
    }
  };

  // LOGIQUE DE FILTRAGE DES PRIX (Le coeur de ta demande)
  // LOGIQUE DE FILTRAGE DES PRIX CORRIGÉE
  const getFilteredPrices = () => {
    if (!event) return [];
    
    // On retire toujours le tarif STAFF et guest, ils ne sont pas destinés au public
    const basePrices = event.prices.filter((p: any) => p.category.toUpperCase() !== 'STAFF'&& p.category.toUpperCase() !== 'GUEST');

    // 1. État initial : L'utilisateur n'a pas encore saisi son email
    if (memberInfo === null) return basePrices;

    // 2. L'utilisateur est RECONNU comme adhérent
    if (memberInfo.isMember) {
      return basePrices.filter((p: any) => {
        const categoryName = p.category.toUpperCase();
        
        // On ne garde que les tarifs qui contiennent le mot "ADHERENT"
        if (!categoryName.includes('ADHERENT')) return false;

        // FILTRAGE PAR TYPE (ÉTUDIANT OU NORMAL)
        if (memberInfo.type === 'STUDENT') {
          // Si c'est un adhérent étudiant, il voit les tarifs avec le mot "STUDENT" ou "ETUDIANT"
          return categoryName.includes('STUDENT') || categoryName.includes('ETUDIANT');
        } else {
          // Si c'est un adhérent normal, il voit les tarifs ADHERENT qui n'ont PAS le mot étudiant
          return !categoryName.includes('STUDENT') && !categoryName.includes('ETUDIANT');
        }
      });
    }

    // 3. L'utilisateur n'est PAS reconnu (Public)
    // On ne garde que les tarifs qui ne contiennent PAS le mot "ADHERENT"
    return basePrices.filter((p: any) => !p.category.toUpperCase().includes('ADHERENT'));
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
      {/* Navigation Retour (Style Angulaire) */}
      <div className="max-w-7xl mx-auto px-4 pt-32">
        <button 
          onClick={() => navigate('/evenements')}
          className="flex items-center gap-2 text-gray-400 text-[10px] font-black uppercase tracking-widest hover:text-primary transition-all"
        >
          <ChevronLeft size={14} /> Retour à l'agenda
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-12 grid grid-cols-1 lg:grid-cols-12 gap-16">
        
        {/* --- COLONNE GAUCHE : INFOS --- */}
        <div className="lg:col-span-7 space-y-12">
          <header className="space-y-6">
            <h1 className="text-5xl md:text-7xl font-black text-dark uppercase italic tracking-tighter leading-none">
              {event.title}
            </h1>
            <div className="flex flex-wrap gap-8 py-6 border-y border-gray-100">
               <div className="flex items-center gap-3">
                  <div className="p-3 bg-primary text-white"><Calendar size={20}/></div>
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Date</p>
                    <p className="font-bold text-dark uppercase">{new Date(event.date).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
                  </div>
               </div>
               <div className="flex items-center gap-3">
                  <div className="p-3 bg-primary text-white"><MapPin size={20}/></div>
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Lieu</p>
                    <p className="font-bold text-dark uppercase">{event.location}</p>
                  </div>
               </div>
            </div>
          </header>

          <div className="shadow-2xl border border-gray-100 overflow-hidden grayscale hover:grayscale-0 transition-all duration-1000">
             <img 
               src={event.image ? `http://localhost:8000${event.image}` : '/placeholder.jpg'} 
               className="w-full h-450px object-cover" alt=""
             />
          </div>

          <div className="prose prose-lg max-w-none border-l-4 border-dark pl-8">
             <p className="text-gray-500 font-medium leading-relaxed whitespace-pre-line">
                {event.description}
             </p>
          </div>
        </div>

        {/* --- COLONNE DROITE : TUNNEL DE RÉSERVATION --- */}
        <div className="lg:col-span-5">
          <div className="sticky top-32 bg-dark p-8 md:p-12 text-white border-t-12px border-primary shadow-2xl">
            <h2 className="text-3xl font-black uppercase tracking-tighter italic mb-8">Billeterie<span className="text-primary">.</span></h2>
            
            <form onSubmit={handleBookingSubmit} className="space-y-8">
              
              {/* ÉTAPE 1 : IDENTIFICATION PAR EMAIL */}
              <div className="space-y-2">
                <label className="text-[9px] font-black text-primary uppercase tracking-[0.2em]">Votre adresse email</label>
                <div className="relative group">
                  <Mail className="absolute left-0 top-4 text-gray-600 group-focus-within:text-primary transition-colors" size={18} />
                  <input 
                    type="email" required
                    className="w-full p-4 pl-8 bg-transparent border-b border-white/10 focus:border-primary outline-none font-bold text-white transition-all uppercase text-xs"
                    placeholder="EMAIL@THEMOROCCANNETWORK.ORG"
                    onBlur={(e) => checkMembership(e.target.value)}
                    onChange={e => setBookingForm({...bookingForm, email: e.target.value})}
                  />
                  {verifying && <Loader2 className="absolute right-0 top-4 animate-spin text-primary" size={18} />}
                </div>
              </div>

              {/* MESSAGE DE STATUT DYNAMIQUE */}
              <AnimatePresence>
                {memberInfo && (
                  <motion.div 
                    initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                    className={`p-4 text-[10px] font-black uppercase tracking-widest border-l-4 ${
                      memberInfo.isMember ? 'bg-green-500/10 border-green-500 text-green-500' : 'bg-primary/10 border-primary text-primary'
                    }`}
                  >
                    {memberInfo.isMember 
                      ? `✓ Adhérent ${memberInfo.type} reconnu. Tarifs débloqués.` 
                      : "ℹ Non-adhérent. Accès aux tarifs publics uniquement."}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* ÉTAPE 2 : SÉLECTION DU PRIX FILTRÉ */}
              <div className="space-y-4">
                <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Sélectionner un tarif</p>
                <div className="space-y-2">
                  {getFilteredPrices().map((p: any, i: number) => (
                    <label 
                      key={i} 
                      className={`flex justify-between items-center p-5 border cursor-pointer transition-all duration-300 ${
                        bookingForm.category === p.category ? 'border-primary bg-primary/10' : 'border-white/10 hover:border-white/30'
                      }`}
                    >
                      <input 
                        type="radio" name="price" className="hidden" 
                        onChange={() => {
                            setBookingForm({...bookingForm, category: p.category, amount: p.amount});
                        }} 
                      />
                      <div className="flex flex-col">
                      <span className="font-black text-[10px] uppercase tracking-widest">
                        {CATEGORY_LABELS[p.category] || p.category}
                      </span>
                        {p.category.includes('STUDENT') && <span className="text-[7px] text-primary font-bold mt-1">CARTE ÉTUDIANT OBLIGATOIRE</span>}
                      </div>
                      <span className="font-black text-xl tracking-tighter">{p.amount}€</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* MESSAGE DE CONVERSION SI NON-MEMBRE */}
              {memberInfo && !memberInfo.isMember && (
                <div className="p-5 bg-white/5 border border-white/5 text-[10px] text-gray-400 italic">
                   <p>Économisez plus en devenant membre. <Link to="/adhesion" className="text-primary font-bold underline ml-1">Adhérer maintenant</Link></p>
                </div>
              )}

              {/* FORMULAIRE NOM/PRENOM (S'affiche après choix de prix) */}
              <AnimatePresence>
                {bookingForm.category && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-2 gap-4">
                    <input 
                      required placeholder="PRÉNOM"
                      value={bookingForm.firstName}
                      className="w-full p-4 bg-white/5 border-b border-white/10 focus:border-primary outline-none font-bold text-white text-[10px] uppercase transition-all"
                      onChange={e => setBookingForm({...bookingForm, firstName: e.target.value.toUpperCase()})}
                    />
                    <input 
                      required placeholder="NOM"
                      value={bookingForm.lastName}
                      className="w-full p-4 bg-white/5 border-b border-white/10 focus:border-primary outline-none font-bold text-white text-[10px] uppercase transition-all"
                      onChange={e => setBookingForm({...bookingForm, lastName: e.target.value.toUpperCase()})}
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              <button 
                type="submit" 
                disabled={loading || !bookingForm.category}
                className="w-full py-6 bg-primary text-white font-black text-xs tracking-[0.3em] hover:bg-white hover:text-dark transition-all flex items-center justify-center gap-3 disabled:opacity-20 shadow-xl"
              >
                {loading ? "AUTHENTIFICATION BANCAIRE..." : `PAYER — ${bookingForm.amount}€`}
                <CreditCard size={18} />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};