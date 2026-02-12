import React from 'react';
import { Link } from 'react-router-dom';

export const HomePage: React.FC = () => {
  // On crée un tableau vide de 3 éléments pour simuler 3 actualités
  const placeholders = [1, 2, 3];

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-dark text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-primary text-4xl md:text-6xl font-bold mb-6">
            Ensemble pour un avenir meilleur
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Rejoignez Moroccan 4 Life et participez à nos actions locales.
          </p>
          <div className="flex justify-center space-x-4">
            <Link to="/adhesion" className="bg-primary text-white px-8 py-3 rounded-full font-bold hover:bg-primary-hover transition shadow-lg shadow-primary/20">
              Devenir membre
            </Link>
          </div>
        </div>
      </section>

      {/* News Preview (Section Actualités avec Blocs de couleurs) */}
      <section className="py-16 max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-dark mb-8 border-b-4 border-primary inline-block">Actualités</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {placeholders.map((item, index) => (
            <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-primary-light hover:shadow-md transition">
              {/* Badge de catégorie simulé */}
              <div className="w-20 h-4 bg-primary-light rounded mb-3"></div>
              
              {/* Titre simulé (Barre Dark) */}
              <div className="h-6 bg-dark rounded w-full mb-3 opacity-80"></div>
              
              {/* Texte simulé (Barres grises) */}
              <div className="space-y-2">
                <div className="h-3 bg-gray-100 rounded w-full"></div>
                <div className="h-3 bg-gray-100 rounded w-5/6"></div>
                <div className="h-3 bg-gray-100 rounded w-4/6"></div>
              </div>

              {/* Date simulée */}
              <div className="mt-4 h-3 bg-gray-50 rounded w-1/4"></div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};