import React from 'react';
import { ArrowRight, Check, Calendar, MapPin, Mail, Phone, Clock } from 'lucide-react';
import { MOCK_EVENTS, MOCK_NEWS } from '../data';
import { Link } from 'react-router-dom';

export const HomePage: React.FC = () => {
  return (
    <div>
      {/* Hero Section - Utilisation de Black Bean (bg-dark) */}
      <section className="bg-dark text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Ensemble pour un avenir meilleur
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Rejoignez notre communauté dynamique et participez à nos actions locales. 
            Découvrez nos événements et impliquez-vous dès aujourd'hui.
          </p>
          <div className="flex justify-center space-x-4">
            {/* Bouton Coquelicot (bg-primary) */}
            <Link to="/adhesion" className="bg-primary text-white px-8 py-3 rounded-full font-bold hover:bg-red-600 transition shadow-lg shadow-red-900/50">
              Devenir membre
            </Link>
            <Link to="/evenements" className="bg-white text-dark px-8 py-3 rounded-full font-bold hover:bg-gray-100 transition">
              Nos événements
            </Link>
          </div>
        </div>
      </section>

      {/* Latest News Preview */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Dernières Actualités</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {MOCK_NEWS.map(news => (
            <div key={news.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition">
              <span className="text-xs font-semibold text-primary uppercase tracking-wide">{news.category}</span>
              <h3 className="text-xl font-bold mt-2 mb-3">{news.title}</h3>
              <p className="text-gray-600 mb-4">{news.summary}</p>
              <div className="text-sm text-gray-400">{new Date(news.date).toLocaleDateString()}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export const MembershipPage: React.FC = () => {
  const plans = [
    { title: 'Étudiant / Sans emploi', price: '15€', features: ['Carte membre', 'Accès événements', 'Vote AG'] },
    { title: 'Membre Actif', price: '30€', features: ['Carte membre', 'Accès événements', 'Vote AG', 'T-shirt asso'], isPopular: true },
    { title: 'Bienfaiteur', price: '80€', features: ['Carte membre', 'Accès événements', 'Vote AG', 'T-shirt asso', 'Reçu fiscal', 'Invitation dîner'] },
  ];

  return (
    <div className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Adhérer à l'association</h1>
        <p className="text-xl text-gray-600">Choisissez la formule qui vous correspond et soutenez nos actions.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {plans.map((plan, index) => (
          <div key={index} className={`relative bg-white rounded-2xl shadow-lg p-8 border ${plan.isPopular ? 'border-primary ring-2 ring-red-100' : 'border-gray-200'}`}>
            {plan.isPopular && (
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-primary text-white px-4 py-1 rounded-full text-sm font-bold">
                Recommandé
              </div>
            )}
            <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.title}</h3>
            <div className="text-4xl font-bold text-primary mb-6">{plan.price}<span className="text-base font-normal text-gray-500">/an</span></div>
            <ul className="space-y-4 mb-8">
              {plan.features.map((feat, i) => (
                <li key={i} className="flex items-center text-gray-600">
                  <Check className="text-green-600 mr-3 h-5 w-5" />
                  {feat}
                </li>
              ))}
            </ul>
            <button className={`w-full py-3 rounded-lg font-bold transition ${plan.isPopular ? 'bg-primary text-white hover:bg-red-600' : 'bg-gray-100 text-gray-900 hover:bg-gray-200'}`}>
              Choisir cette formule
            </button>
          </div>
        ))}
      </div>
      
      <div className="mt-12 text-center text-sm text-gray-500 bg-gray-50 p-6 rounded-lg border border-gray-100">
        Le paiement est sécurisé par HelloAsso. Une fois le paiement validé, vous recevrez automatiquement votre carte de membre par email.
      </div>
    </div>
  );
};

export const EventsPage: React.FC = () => {
  return (
    <div className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Nos prochains événements</h1>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {MOCK_EVENTS.map(event => (
          <div key={event.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden group hover:shadow-lg transition">
            <div className="h-48 bg-gray-200 relative overflow-hidden">
               {event.image && <img src={event.image} alt={event.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />}
            </div>
            <div className="p-6">
              <div className="flex items-center text-sm text-primary mb-2">
                <Calendar size={16} className="mr-2" />
                {new Date(event.date).toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </div>
              <h3 className="text-xl font-bold mb-2">{event.title}</h3>
              <div className="flex items-center text-sm text-gray-500 mb-4">
                <MapPin size={16} className="mr-2" />
                {event.location}
              </div>
              <p className="text-gray-600 mb-6 line-clamp-2">{event.description}</p>
              <div className="flex justify-between items-center border-t pt-4">
                 <span className="text-sm font-medium text-gray-900">
                   {event.capacity - event.ticketsSold} places restantes
                 </span>
                 <button className="text-primary font-semibold hover:text-red-700 text-sm">Réserver &rarr;</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const NewsPage: React.FC = () => {
  return (
    <div className="py-16 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Actualités</h1>
      <div className="space-y-8">
        {MOCK_NEWS.map(news => (
          <article key={news.id} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
              <span className="bg-primary-light text-primary px-3 py-1 rounded-full font-medium">{news.category}</span>
              <span>{new Date(news.date).toLocaleDateString()}</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{news.title}</h2>
            <p className="text-gray-600 leading-relaxed">{news.summary}</p>
            <div className="mt-6">
               <button className="text-primary font-medium hover:text-red-700">Lire la suite &rarr;</button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

export const ContactPage: React.FC = () => {
  return (
    <div className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid md:grid-cols-2 gap-12">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-6">Contactez-nous</h1>
          <p className="text-lg text-gray-600 mb-8">
            Une question sur votre adhésion ? Une proposition de partenariat ?
            N'hésitez pas à nous envoyer un message.
          </p>
          
          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <div className="bg-primary-light p-3 rounded-lg text-primary">
                <MapPin size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Notre adresse</h3>
                <p className="text-gray-600">10 Rue de la République, 69001 Lyon</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="bg-primary-light p-3 rounded-lg text-primary">
                <Mail size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Email</h3>
                <p className="text-gray-600">contact@assoconnect.org</p>
              </div>
            </div>

             <div className="flex items-start space-x-4">
              <div className="bg-primary-light p-3 rounded-lg text-primary">
                <Clock size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Horaires</h3>
                <p className="text-gray-600">Du Lundi au Vendredi: 9h - 18h</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
          <form className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Prénom</label>
                <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
                <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input type="email" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
              <textarea rows={4} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"></textarea>
            </div>
            <button type="submit" className="w-full bg-primary text-white py-3 rounded-lg font-bold hover:bg-red-600 transition">
              Envoyer le message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};