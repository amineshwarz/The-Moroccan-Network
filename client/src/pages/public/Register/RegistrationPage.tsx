import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAxios } from '../../../hooks/useAxios';
import { UserPlus, Lock, User, CheckCircle } from 'lucide-react';

export const RegistrationPage: React.FC = () => {
  // 1. Récupérer le token depuis l'URL
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  
  const navigate = useNavigate();
  const { request, loading, error } = useAxios();

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    password: '',
    confirmPassword: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      alert("Les mots de passe ne correspondent pas !");
      return;
    }

    try {
      // 2. Envoyer les données au Backend
      await request('POST', '/api/register', {
        token: token,
        firstName: form.firstName,
        lastName: form.lastName,
        password: form.password
      });

      alert("Compte créé avec succès ! Connectez-vous.");
      navigate('/admin'); // Redirection vers le login
    } catch (err) {
      console.error(err);
    }
  };

  if (!token) return <div className="p-20 text-center">Lien invalide.</div>;

  return (
    <div className="min-h-screen bg-light flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border-t-8 border-primary">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-dark italic">Bienvenue au Bureau</h1>
          <p className="text-gray-500 text-sm">Finalisez votre profil pour rejoindre l'équipe.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <p className="text-primary text-xs font-bold">{error}</p>}
          
          <div className="grid grid-cols-2 gap-4">
            <input 
              className="p-2 border rounded-lg outline-none focus:ring-2 focus:ring-primary"
              placeholder="Prénom"
              onChange={e => setForm({...form, firstName: e.target.value})}
              required
            />
            <input 
              className="p-2 border rounded-lg outline-none focus:ring-2 focus:ring-primary"
              placeholder="Nom"
              onChange={e => setForm({...form, lastName: e.target.value})}
              required
            />
          </div>

          <input 
            type="password"
            className="w-full p-2 border rounded-lg outline-none focus:ring-2 focus:ring-primary"
            placeholder="Mot de passe"
            onChange={e => setForm({...form, password: e.target.value})}
            required
          />

          <input 
            type="password"
            className="w-full p-2 border rounded-lg outline-none focus:ring-2 focus:ring-primary"
            placeholder="Confirmer mot de passe"
            onChange={e => setForm({...form, confirmPassword: e.target.value})}
            required
          />

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-dark text-white py-3 rounded-lg font-bold hover:bg-primary transition shadow-lg disabled:bg-gray-400"
          >
            {loading ? 'Création...' : 'Activer mon compte'}
          </button>
        </form>
      </div>
    </div>
  );
};