import React from 'react';
import { Calendar, MapPin } from 'lucide-react';

export const EventsPage: React.FC = () => {
  // On crée juste un tableau de 6 éléments pour générer 6 blocs
  const placeholders = [1, 2, 3, 4, 5, 6];

  return (
    <div className="py-16 max-w-7xl mx-auto px-4">
      <h1 className="text-4xl font-bold text-dark mb-8">Nos prochains événements</h1>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {placeholders.map((item, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm border border-primary-light overflow-hidden hover:shadow-lg transition">
            {/* Bloc de couleur à la place de l'image (Alternance Primary / Dark) */}
            <div className={`h-48 ${index % 2 === 0 ? 'bg-primary' : 'bg-dark'} flex items-center justify-center`}>
               <span className="text-white font-bold opacity-50 text-xl">IMAGE EVENT</span>
            </div>

            <div className="p-6">
              <div className="flex items-center text-sm text-primary mb-2 italic">
                <Calendar size={16} className="mr-2" />
                Date à venir...
              </div>
              {/* Blocs de texte simulés par des barres de couleur grise */}
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="flex items-center text-sm text-gray-400 mb-4">
                <MapPin size={16} className="mr-2" />
                Lieu non défini
              </div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-100 rounded w-full"></div>
                <div className="h-4 bg-gray-100 rounded w-5/6"></div>
              </div>
              <div className="mt-6 pt-4 border-t flex justify-end">
                 <button className="text-primary font-bold hover:underline">Réserver &rarr;</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};