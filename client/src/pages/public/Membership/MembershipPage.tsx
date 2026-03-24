import React, { useState } from 'react';
import { useAxios } from '../../../hooks/useAxios';
import { Check, ArrowRight, Mail, CreditCard, GraduationCap, User } from 'lucide-react';

export const MembershipPage: React.FC = () => {
  const { request, loading, error } = useAxios();
  const [selectedPlan, setSelectedPlan] = useState<{title: string, price: number, type: string} | null>(null);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: ''
  });

  // TES DEUX FORMULES UNIQUEMENT
  const plans = [
    { 
      title: 'Tarif annuel adhésion', 
      price: 35, 
      type: 'NORMAL', 
      features: ['Accès complet aux événements', 'Droit de vote AG', 'Newsletter privée'],
      icon: <User size={24}/> 
    },
    { 
      title: 'Tarif adhésion étudiant', 
      price: 30, 
      type: 'STUDENT', 
      features: ['Tarif réduit sur les billets', 'Droit de vote AG', 'Justificatif étudiant requis'],
      icon: <GraduationCap size={24}/> 
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
        amount: selectedPlan.price * 100 // 35€ -> 3500 centimes
      });

      if (response.redirectUrl) {
        window.location.href = response.redirectUrl;
      }
    } catch (err) {
      console.error("Erreur paiement", err);
    }
  };

  return (
    <div className="py-20 bg-gray-50 min-h-screen">
      <div className="max-w-5xl mx-auto px-4">
        
        <div className="text-center mb-16">
          <h1 className="text-4xl font-black text-dark uppercase tracking-tighter mb-4">
            Devenir <span className="text-primary italic">Membre</span>
          </h1>
          <p className="text-gray-500 font-medium">
            Choisissez la formule qui vous correspond pour rejoindre le réseau.
          </p>
        </div>

        {!selectedPlan ? (
          <div className="grid md:grid-cols-2 gap-12 max-w-4xl mx-auto">
            {plans.map((plan, index) => (
              <div key={index} className="bg-white p-10 rounded-[3rem] shadow-xl border-2 border-transparent hover:border-primary transition-all duration-500 flex flex-col group">
                <div className="w-14 h-14 bg-primary-light text-primary rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  {plan.icon}
                </div>
                <h3 className="text-2xl font-bold text-dark mb-2">{plan.title}</h3>
                <div className="text-5xl font-black text-dark mb-8">{plan.price}€<span className="text-sm text-gray-400 font-normal"> /an</span></div>
                
                <ul className="space-y-4 mb-10 flex-1">
                  {plan.features.map((f, i) => (
                    <li key={i} className="flex items-center gap-3 text-gray-600 font-medium text-sm">
                      <Check size={18} className="text-primary" /> {f}
                    </li>
                  ))}
                </ul>

                <button 
                  onClick={() => setSelectedPlan(plan)}
                  className="w-full py-5 bg-dark text-white rounded-[1.5rem] font-bold hover:bg-primary transition-all shadow-lg active:scale-95"
                >
                  Sélectionner
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="max-w-md mx-auto animate-in fade-in slide-in-from-bottom-8 duration-500">
            <button onClick={() => setSelectedPlan(null)} className="text-gray-400 text-sm font-bold mb-6 flex items-center gap-1 hover:text-primary transition-colors">
               <ArrowRight size={16} className="rotate-180" /> Changer de formule
            </button>

            <div className="bg-white p-10 rounded-[3rem] shadow-2xl border-t-8 border-primary">
              <h2 className="text-2xl font-bold text-dark mb-2">Finaliser</h2>
              <p className="text-gray-500 text-sm mb-8">Paiement pour : <span className="text-primary font-bold uppercase">{selectedPlan.title}</span></p>

              <form onSubmit={handlePayment} className="space-y-5">
                <div className="space-y-4">
                  <input 
                    required placeholder="Prénom"
                    className="w-full p-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-primary font-bold text-dark"
                    onChange={e => setFormData({...formData, firstName: e.target.value})}
                  />
                  <input 
                    required placeholder="Nom"
                    className="w-full p-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-primary font-bold text-dark"
                    onChange={e => setFormData({...formData, lastName: e.target.value})}
                  />
                  <div className="relative">
                    <Mail className="absolute left-4 top-4 text-gray-300" size={20} />
                    <input 
                      type="email" required placeholder="Email"
                      className="w-full pl-12 p-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-primary font-bold text-dark"
                      onChange={e => setFormData({...formData, email: e.target.value})}
                    />
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full bg-primary text-white py-5 rounded-2xl font-black text-lg hover:bg-dark transition-all shadow-xl shadow-primary/30 flex items-center justify-center gap-3 disabled:bg-gray-300"
                >
                  {loading ? "Traitement..." : `PAYER ${selectedPlan.price}€`}
                  <CreditCard size={22} />
                </button>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};