import React from 'react';
import { Check } from 'lucide-react';

export const MembershipPage: React.FC = () => {
  const plans = [
    { title: 'Étudiant', price: '15€', features: ['Accès événements', 'Vote AG'] },
    { title: 'Membre Actif', price: '30€', features: ['T-shirt asso', 'Vote AG'], isPopular: true },
    { title: 'Bienfaiteur', price: '80€', features: ['Reçu fiscal', 'Invitation dîner'] },
  ];

  return (
    <div className="py-16 max-w-7xl mx-auto px-4">
      <div className="text-center mb-12">
        <h1 className="text-dark">Adhérer à l'association</h1>
        <p className="text-gray-600">Soutenez nos actions en choisissant une formule.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {plans.map((plan, index) => (
          <div key={index} className={`bg-white rounded-2xl shadow-lg p-8 border-2 ${plan.isPopular ? 'border-primary' : 'border-gray-100'}`}>
            <h3 className="text-xl font-bold mb-2">{plan.title}</h3>
            <div className="text-4xl font-bold text-primary mb-6">{plan.price}</div>
            <ul className="space-y-4 mb-8">
              {plan.features.map((feat, i) => (
                <li key={i} className="flex items-center text-gray-600">
                  <Check className="text-primary mr-3 h-5 w-5" /> {feat}
                </li>
              ))}
            </ul>
            <button className={`w-full py-3 rounded-lg font-bold transition ${plan.isPopular ? 'bg-primary text-white hover:bg-primary-hover' : 'bg-primary-light text-primary hover:bg-primary hover:text-white'}`}>
              Choisir cette formule
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};