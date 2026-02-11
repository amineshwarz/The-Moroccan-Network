import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Calendar, TrendingUp, Search, Plus, MoreHorizontal, DollarSign } from 'lucide-react';
import { MOCK_MEMBERS, MOCK_EVENTS } from '../data';

export const AdminLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulation simple de connexion
    if (email && password) {
      navigate('/admin/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <div className="text-center mb-8">
           <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4">A</div>
          <h1 className="text-2xl font-bold text-gray-900">Administration</h1>
          <p className="text-gray-500">Connectez-vous pour gérer l'association</p>
        </div>
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none" 
              placeholder="admin@asso.org"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe</label>
            <input 
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none" 
              placeholder="••••••••"
            />
          </div>
          <button type="submit" className="w-full bg-dark text-white py-3 rounded-lg font-bold hover:bg-gray-800 transition">
            Se connecter
          </button>
        </form>
      </div>
    </div>
  );
};

export const AdminDashboard: React.FC = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Tableau de bord Adhérents</h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-primary-light rounded-lg text-primary"><Users size={24} /></div>
            <span className="text-green-500 text-sm font-medium">+12%</span>
          </div>
          <h3 className="text-gray-500 text-sm font-medium">Total Adhérents</h3>
          <p className="text-3xl font-bold text-gray-900">1,240</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
           <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-purple-50 rounded-lg text-purple-600"><Calendar size={24} /></div>
            <span className="text-gray-400 text-sm font-medium">Ce mois</span>
          </div>
          <h3 className="text-gray-500 text-sm font-medium">Événements Actifs</h3>
          <p className="text-3xl font-bold text-gray-900">3</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
           <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-green-50 rounded-lg text-green-600"><DollarSign size={24} /></div>
             <span className="text-green-500 text-sm font-medium">+5%</span>
          </div>
          <h3 className="text-gray-500 text-sm font-medium">Recettes Cotisations</h3>
          <p className="text-3xl font-bold text-gray-900">12,450€</p>
        </div>
      </div>

      {/* Members Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-4">
          <h2 className="text-lg font-bold text-gray-900">Liste des membres récents</h2>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input type="text" placeholder="Rechercher..." className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 text-gray-900 font-medium">
              <tr>
                <th className="px-6 py-4">Nom</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Statut</th>
                <th className="px-6 py-4">Formule</th>
                <th className="px-6 py-4">Date d'inscription</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {MOCK_MEMBERS.map(member => (
                <tr key={member.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">{member.firstName} {member.lastName}</td>
                  <td className="px-6 py-4">{member.email}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      member.status === 'active' ? 'bg-green-100 text-green-800' :
                      member.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {member.status === 'active' ? 'Actif' : member.status === 'pending' ? 'En attente' : 'Expiré'}
                    </span>
                  </td>
                  <td className="px-6 py-4">{member.plan}</td>
                  <td className="px-6 py-4">{new Date(member.joinDate).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-gray-400 hover:text-gray-600"><MoreHorizontal size={20} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export const AdminEvents: React.FC = () => {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Gestion des événements</h1>
        <button className="bg-primary text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 hover:bg-red-600">
          <Plus size={18} />
          Créer un événement
        </button>
      </div>

       <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
         <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 text-gray-900 font-medium">
              <tr>
                <th className="px-6 py-4">Titre</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Lieu</th>
                <th className="px-6 py-4">Billets vendus</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {MOCK_EVENTS.map(event => (
                <tr key={event.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">{event.title}</td>
                  <td className="px-6 py-4">{new Date(event.date).toLocaleDateString()}</td>
                  <td className="px-6 py-4">{event.location}</td>
                  <td className="px-6 py-4">
                     <div className="w-full bg-gray-200 rounded-full h-2.5 max-w-[100px]">
                      <div className="bg-primary h-2.5 rounded-full" style={{ width: `${(event.ticketsSold / event.capacity) * 100}%` }}></div>
                    </div>
                    <span className="text-xs text-gray-500 mt-1 block">{event.ticketsSold} / {event.capacity}</span>
                  </td>
                  <td className="px-6 py-4">
                     <button className="text-primary hover:text-red-700 font-medium text-xs">Éditer</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
       </div>
    </div>
  );
};

export const AdminTicketing: React.FC = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Billetterie & Ventes</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          { label: 'Revenu Total', value: '15,240€', color: 'bg-green-100 text-green-700' },
          { label: 'Billets Vendus', value: '342', color: 'bg-primary-light text-primary' },
          { label: 'Taux de remplissage', value: '78%', color: 'bg-yellow-100 text-yellow-700' },
          { label: 'Panier Moyen', value: '44€', color: 'bg-purple-100 text-purple-700' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-xl border border-gray-200">
            <h3 className="text-gray-500 text-sm font-medium mb-2">{stat.label}</h3>
            <p className={`text-2xl font-bold ${stat.color} px-3 py-1 rounded-lg inline-block`}>{stat.value}</p>
          </div>
        ))}
      </div>
      
      <div className="bg-white p-12 text-center rounded-xl border border-gray-200 border-dashed">
        <TrendingUp className="mx-auto text-gray-300 mb-4" size={48} />
        <h3 className="text-lg font-medium text-gray-900">Graphiques détaillés</h3>
        <p className="text-gray-500">Connectez le backend pour voir les courbes de ventes en temps réel.</p>
      </div>
    </div>
  );
};