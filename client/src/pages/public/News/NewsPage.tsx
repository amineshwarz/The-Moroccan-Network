import React from 'react';

export const NewsPage: React.FC = () => {
  const placeholders = [1, 2, 3, 4];

  return (
    <div className="py-16 max-w-3xl mx-auto px-4">
      <h1 className="text-4xl font-bold text-dark mb-8">Actualités</h1>
      <div className="space-y-8">
        {placeholders.map((item, index) => (
          <article key={index} className="bg-white p-8 rounded-2xl  border-l-8 border-primary shadow-lg">
            <div className="flex items-center space-x-4 mb-4">
              <span className="bg-primary-light text-primary px-3 py-1 rounded-full text-xs font-bold">
                CATÉGORIE
              </span>
              <span className="text-gray-400 text-sm">Janvier 2024</span>
            </div>
            {/* Titre simulé */}
            <div className={`h-8 rounded mb-4 ${index % 2 === 0 ? 'bg-dark' : 'bg-gray-300'} w-full`}></div>
            {/* Texte simulé */}
            <div className="space-y-3">
              <div className="h-4 bg-gray-100 rounded w-full"></div>
              <div className="h-4 bg-gray-100 rounded w-full"></div>
              <div className="h-4 bg-gray-100 rounded w-2/3"></div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};