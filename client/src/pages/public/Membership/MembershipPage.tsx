import React, { useState } from 'react';
import { useAxios } from '../../../hooks/useAxios';
import { Check, ArrowRight, Mail, CreditCard, GraduationCap, User, ChevronLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const MembershipPage: React.FC = () => {
  const { request, loading, error } = useAxios();
  const [selectedPlan, setSelectedPlan] = useState<{title: string, price: number, type: string} | null>(null);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: ''
  });

  const plans = [
    { 
      title: 'Tarif annuel adhésion', 
      price: 35, 
      type: 'NORMAL', 
      features: ['Accès prioritaire aux événements', 'Droit de vote à l\'AG', 'Accès au réseau de mentorat', 'Newsletter trimestrielle'],
      icon: <User size={20}/> 
    },
    { 
      title: 'Tarif adhésion étudiant', 
      price: 30, 
      type: 'STUDENT', 
      features: ['Tarifs réduits sur la billetterie', 'Droit de vote à l\'AG', 'Accès aux ateliers carrière', 'Justificatif requis'],
      icon: <GraduationCap size={20}/> 
    },
  ];

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlan) return;

    try {
      const response = await request('POST', '/api/payment/membership', {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        type: selectedPlan.type,
        amount: selectedPlan.price * 100 
      });

      if (response.redirectUrl) {
        window.location.href = response.redirectUrl;
      }
    } catch (err) {
      console.error("Erreur paiement", err);
    }
  };

  return (
    <div className="bg-white min-h-screen">
      
      {/* --- SECTION TITRE (STYLE INSTITUTIONNEL) --- */}
      <section className="bg-dark text-white pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <motion.span 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="text-primary font-bold tracking-[0.4em] text-xs uppercase block mb-4"
          >
            Engagement & Solidarité
          </motion.span>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase italic">
            Adhésion <span className="text-primary">{new Date().getFullYear()}</span>
          </h1>
          <p className="mt-6 text-gray-400 max-w-xl mx-auto font-medium text-lg">
            Rejoignez The Moroccan Network et participez activement au rayonnement de notre communauté.
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 -mt-10 pb-24">
        
        <AnimatePresence mode="wait">
          {!selectedPlan ? (
            /* --- ÉTAPE 1 : GRILLE DE SÉLECTION --- */
            <motion.div 
              key="step1"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-8"
            >
              {plans.map((plan, index) => (
                <div 
                  key={index} 
                  className="bg-white border border-gray-200 p-10 flex flex-col group hover:border-primary transition-all duration-300 shadow-sm"
                >
                  <div className="flex justify-between items-start mb-8">
                    <div className="text-primary bg-primary-light p-3 rounded-md">
                      {plan.icon}
                    </div>
                    <div className="text-right">
                      <p className="text-4xl font-black text-dark tracking-tighter leading-none">{plan.price}€</p>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Par an</p>
                    </div>
                  </div>

                  <h3 className="text-2xl font-black text-dark uppercase tracking-tighter mb-6 italic">{plan.title}</h3>
                  
                  <ul className="space-y-4 mb-10 flex-1">
                    {plan.features.map((f, i) => (
                      <li key={i} className="flex items-start gap-3 text-gray-600 font-medium text-sm">
                        <Check size={16} className="text-primary mt-0.5 shrink-0" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>

                  <button 
                    onClick={() => setSelectedPlan(plan)}
                    className="w-full py-4 bg-primary text-white font-bold hover:bg-dark transition-all flex items-center justify-center gap-2 group"
                  >
                    SÉLECTIONNER CETTE FORMULE
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              ))}
            </motion.div>
          ) : (
            /* --- ÉTAPE 2 : FORMULAIRE ÉPURÉ --- */
            <motion.div 
              key="step2"
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
              className="max-w-2xl mx-auto"
            >
              <button 
                onClick={() => setSelectedPlan(null)} 
                className="flex items-center gap-2 text-gray-400 text-xs font-black uppercase tracking-widest mb-8 hover:text-primary transition-colors"
              >
                <ChevronLeft size={16} /> Revenir aux tarifs
              </button>

              <div className="bg-white border-2 border-dark p-8 md:p-12 shadow-2xl">
                <div className="flex justify-between items-center mb-10 pb-6 border-b border-gray-100">
                    <h2 className="text-3xl font-black text-dark uppercase tracking-tighter italic">Finalisation</h2>
                    <div className="text-right">
                        <p className="text-[10px] font-bold text-gray-400 uppercase">Montant</p>
                        <p className="text-2xl font-black text-primary">{selectedPlan.price}€</p>
                    </div>
                </div>

                <form onSubmit={handlePayment} className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Prénom</label>
                      <input 
                        required className="w-full p-4 bg-gray-50 border-b-2 border-transparent focus:border-primary focus:bg-white outline-none font-bold text-dark transition-all"
                        placeholder="Ex: Amine"
                        onChange={e => setFormData({...formData, firstName: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Nom</label>
                      <input 
                        required className="w-full p-4 bg-gray-50 border-b-2 border-transparent focus:border-primary focus:bg-white outline-none font-bold text-dark transition-all"
                        placeholder="Ex: El Amrani"
                        onChange={e => setFormData({...formData, lastName: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Adresse Email</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-4 text-gray-300" size={20} />
                      <input 
                        type="email" required className="w-full pl-12 p-4 bg-gray-50 border-b-2 border-transparent focus:border-primary focus:bg-white outline-none font-bold text-dark transition-all"
                        placeholder="contact@exemple.com"
                        onChange={e => setFormData({...formData, email: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="pt-6">
                    <button 
                        type="submit" 
                        disabled={loading}
                        className="w-full bg-primary text-white py-5 font-black text-lg hover:bg-dark transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-3 disabled:bg-gray-400"
                    >
                        {loading ? "TRAITEMENT..." : "PROCÉDER AU PAIEMENT"}
                        <CreditCard size={22} />
                    </button>
                    <p className="text-[10px] text-center text-gray-400 mt-6 uppercase tracking-widest font-medium">
                        Paiement 100% sécurisé via HelloAsso
                    </p>
                  </div>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
};