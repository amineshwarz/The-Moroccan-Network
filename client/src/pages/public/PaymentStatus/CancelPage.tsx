// src/pages/public/PaymentStatus/CancelPage.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { XCircle, RefreshCw, Mail } from 'lucide-react';

export const CancelPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="bg-white p-10 md:p-16 rounded-[3rem] shadow-2xl max-w-lg w-full text-center border-t-8 border-primary animate-in fade-in zoom-in duration-500">
        
        <div className="w-24 h-24 bg-red-50 text-primary rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
          <XCircle size={50} strokeWidth={2.5} />
        </div>

        <h1 className="text-3xl font-black text-dark mb-4 uppercase tracking-tighter italic">
          Paiement <span className="text-primary">Interrompu</span>
        </h1>
        
        <p className="text-gray-500 font-medium leading-relaxed mb-10">
          L'opération a été annulée. Aucun montant n'a été prélevé sur votre compte bancaire.
        </p>

        <div className="flex flex-col gap-3">
          <button 
            onClick={() => navigate('/adhesion')}
            className="w-full py-4 bg-primary text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-dark transition-all shadow-lg shadow-primary/20"
          >
            <RefreshCw size={18} />
            Réessayer l'adhésion
          </button>
          
          <button 
            onClick={() => navigate('/contact')}
            className="w-full py-4 bg-gray-50 text-gray-500 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-gray-100 transition-all"
          >
            <Mail size={18} />
            Contacter le bureau
          </button>
        </div>
      </div>
    </div>
  );
};