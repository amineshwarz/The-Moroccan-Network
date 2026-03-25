// src/pages/public/PaymentStatus/SuccessPage.tsx
import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom'; // Ajoute useSearchParams
import { CheckCircle, Home, Calendar, Heart } from 'lucide-react';

export const SuccessPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  // On récupère le type depuis l'URL
  const type = searchParams.get('type');

  // Configuration du contenu selon le type
  const isMembership = type === 'membership';

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="bg-white p-10 md:p-16 rounded-[3rem] shadow-2xl max-w-lg w-full text-center border-t-8 border-green-500">
        
        {/* Icône dynamique */}
        <div className="w-24 h-24 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-8">
          {isMembership ? <Heart size={50} /> : <Calendar size={50} />}
        </div>

        {/* Titre dynamique */}
        <h1 className="text-3xl font-black text-dark mb-4 uppercase tracking-tighter italic">
          {isMembership ? "Bienvenue Membre !" : "Place Réservée !"}
        </h1>
        
        {/* Message dynamique */}
        <p className="text-gray-500 font-medium leading-relaxed mb-10">
          {isMembership 
            ? "Votre adhésion à The Moroccan Network a été validée. Vous faites officiellement partie de l'aventure !"
            : "Votre billet pour l'événement a bien été enregistré. Préparez-vous pour un moment inoubliable !"}
        </p>

        <div className="flex flex-col gap-3">
          <button 
            onClick={() => navigate('/')}
            className="w-full py-4 bg-dark text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-primary transition-all"
          >
            <Home size={18} />
            Retour à l'accueil
          </button>
        </div>
      </div>
    </div>
  );
};