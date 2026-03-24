// src/pages/public/PaymentStatus/SuccessPage.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Home, Calendar } from 'lucide-react';

export const SuccessPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="bg-white p-10 md:p-16 rounded-[3rem] shadow-2xl max-w-lg w-full text-center border-t-8 border-green-500 animate-in fade-in zoom-in duration-500">
        
        {/* Icône de succès animée */}
        <div className="w-24 h-24 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
          <CheckCircle size={50} strokeWidth={2.5} />
        </div>

        <h1 className="text-3xl font-black text-dark mb-4 uppercase tracking-tighter italic">
          Bienvenue dans le <span className="text-primary">Réseau</span> !
        </h1>
        
        <p className="text-gray-500 font-medium leading-relaxed mb-10">
          Votre adhésion à <strong>The Moroccan Network</strong> a été validée avec succès. 
          Un email de confirmation vous a été envoyé par HelloAsso.
        </p>

        <div className="flex flex-col gap-3">
          <button 
            onClick={() => navigate('/')}
            className="w-full py-4 bg-dark text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-primary transition-all shadow-lg"
          >
            <Home size={18} />
            Retour à l'accueil
          </button>
          
          <button 
            onClick={() => navigate('/evenements')}
            className="w-full py-4 bg-gray-50 text-gray-500 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-gray-100 transition-all"
          >
            <Calendar size={18} />
            Découvrir nos événements
          </button>
        </div>
      </div>
    </div>
  );
};