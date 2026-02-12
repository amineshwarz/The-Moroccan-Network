import React from 'react';
import { MapPin, Mail, Clock, Send, Phone } from 'lucide-react';

export const ContactPage: React.FC = () => {
  return (
    <div className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid md:grid-cols-2 gap-12 items-start">
        
        {/* COLONNE GAUCHE : INFOS DE CONTACT */}
        <div>
          <h1 className="text-4xl font-bold text-dark mb-6">Contactez-nous</h1>
          <p className="text-lg text-gray-600 mb-8">
            Une question sur votre adhésion ou nos projets ? 
            L'équipe de <span className="text-primary font-bold">Moroccan 4 Life</span> est là pour vous répondre.
          </p>
          
          <div className="space-y-6">
            {/* Bloc Adresse */}
            <div className="flex items-start space-x-4">
              <div className="bg-primary-light p-3 rounded-lg text-primary">
                <MapPin size={24} />
              </div>
              <div>
                <h3 className="font-bold text-dark">Notre siège</h3>
                <div className="h-4 bg-gray-100 rounded w-48 mt-1"></div> {/* Placeholder adresse */}
              </div>
            </div>
            
            {/* Bloc Email */}
            <div className="flex items-start space-x-4">
              <div className="bg-primary-light p-3 rounded-lg text-primary">
                <Mail size={24} />
              </div>
              <div>
                <h3 className="font-bold text-dark">Email</h3>
                <p className="text-gray-600">contact@moroccan4life.org</p>
              </div>
            </div>

             {/* Bloc Horaires */}
             <div className="flex items-start space-x-4">
              <div className="bg-primary-light p-3 rounded-lg text-primary">
                <Clock size={24} />
              </div>
              <div>
                <h3 className="font-bold text-dark">Permanence</h3>
                <p className="text-gray-600">Lundi au Vendredi : 9h - 18h</p>
              </div>
            </div>
          </div>
        </div>

        {/* COLONNE DROITE : FORMULAIRE */}
        <div className="bg-white p-8 rounded-2xl shadow-xl border border-primary-light">
          <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-dark mb-1">Prénom</label>
                <input type="text" className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition" />
              </div>
              <div>
                <label className="block text-sm font-bold text-dark mb-1">Nom</label>
                <input type="text" className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition" />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-bold text-dark mb-1">Email</label>
              <input type="email" className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition" />
            </div>

            <div>
              <label className="block text-sm font-bold text-dark mb-1">Votre message</label>
              <textarea rows={4} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"></textarea>
            </div>

            <button type="submit" className="w-full bg-primary text-white py-3 rounded-lg font-bold flex items-center justify-center space-x-2 hover:bg-dark transition-colors shadow-lg">
              <Send size={18} />
              <span>Envoyer le message</span>
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};