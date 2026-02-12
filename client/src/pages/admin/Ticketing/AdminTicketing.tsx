import React from 'react';
import { TrendingUp, CreditCard, ShoppingCart, ArrowUpRight } from 'lucide-react';

export const AdminTicketing: React.FC = () => {
  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-dark">Billetterie & Finances</h1>

      {/* Cartes de statistiques financières */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-dark text-white p-6 rounded-2xl shadow-xl">
          <div className="flex justify-between items-center mb-4">
            <div className="p-2 bg-white/10 rounded-lg text-primary"><TrendingUp size={24} /></div>
            <span className="text-xs font-bold bg-primary text-white px-2 py-1 rounded-full">+12%</span>
          </div>
          <p className="text-gray-400 text-sm font-medium">Revenu Total</p>
          <p className="text-3xl font-bold">14,250.00€</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <div className="p-2 bg-primary-light rounded-lg text-primary"><ShoppingCart size={24} /></div>
          </div>
          <p className="text-gray-500 text-sm font-medium">Billets Vendus</p>
          <p className="text-3xl font-bold text-dark">452</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <div className="p-2 bg-gray-100 rounded-lg text-dark"><CreditCard size={24} /></div>
          </div>
          <p className="text-gray-500 text-sm font-medium">Panier Moyen</p>
          <p className="text-3xl font-bold text-dark">31.50€</p>
        </div>
      </div>

      {/* Zone Graphique (Simulée par un bloc de couleur) */}
      <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-lg font-bold text-dark">Évolution des ventes</h2>
          <select className="bg-gray-50 border-none text-sm rounded-lg px-3 py-1 outline-none text-gray-500">
            <option>7 derniers jours</option>
            <option>30 derniers jours</option>
          </select>
        </div>
        
        {/* Placeholder pour un futur graphique (ex: Chart.js ou Recharts) */}
        <div className="h-64 bg-primary-light/30 rounded-xl border-2 border-dashed border-primary/20 flex flex-col items-center justify-center space-y-3">
          <TrendingUp size={48} className="text-primary opacity-20" />
          <p className="text-primary font-bold opacity-40">Graphique des ventes (Connecter Backend)</p>
        </div>
      </div>

      {/* Dernières transactions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-50">
          <h2 className="text-lg font-bold text-dark">Transactions Récentes</h2>
        </div>
        <div className="p-6 space-y-4">
          {[1, 2, 3].map((t) => (
            <div key={t} className="flex justify-between items-center p-3 hover:bg-gray-50 rounded-lg transition">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary-light text-primary flex items-center justify-center rounded-full font-bold">
                  <ArrowUpRight size={20} />
                </div>
                <div>
                  <div className="h-4 bg-gray-200 rounded w-24 mb-1"></div>
                  <div className="text-[10px] text-gray-400">Paiement par Carte</div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-dark">+50.00€</p>
                <p className="text-[10px] text-gray-400 italic">Il y a {t}h</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};