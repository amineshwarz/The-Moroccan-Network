import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail } from 'lucide-react';

export const AdminLoginPage: React.FC = () => {
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/admin/dashboard');
  };

  return (
    <div className="min-h-screen bg-light flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md border-b-8 border-primary">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-dark rounded-xl flex items-center justify-center text-primary font-bold text-3xl mx-auto mb-4 shadow-lg">M</div>
          <h1 className="text-2xl font-bold text-dark">Administration</h1>
          <p className="text-gray-500">Accès réservé au bureau</p>
        </div>
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-dark mb-1">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input type="email" className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary outline-none" placeholder="admin@asso.org" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold text-dark mb-1">Mot de passe</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input type="password" className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary outline-none" placeholder="••••••••" />
            </div>
          </div>
          <button type="submit" className="w-full bg-primary text-white py-3 rounded-lg font-bold hover:bg-dark transition shadow-lg">
            Se connecter
          </button>
        </form>
      </div>
    </div>
  );
};