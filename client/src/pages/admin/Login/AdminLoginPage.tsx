import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, Loader2 } from 'lucide-react'; // Ajout de Loader2 pour le spinner
import { useAxios } from '../../../hooks/useAxios'; // Import de ton hook personnalisé
import { useAuth } from '../../../context/AuthContext'; 
import {Link} from "react-router-dom";

export const AdminLoginPage: React.FC = () => {
  // 1. Définition des états pour les champs du formulaire
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const navigate = useNavigate();

  const { login } = useAuth(); // On récupère la fonction login du context pour mettre à jour l'état global après la connexion

  // 2. Utilisation de ton hook useAxios
  // request : la fonction pour appeler l'API
  // loading : devient vrai pendant l'appel
  // error   : contient le message d'erreur si Symfony renvoie une erreur
  const { request, loading, error } = useAxios();

  // 3. Logique de soumission du formulaire
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // 1. Appel à la route de login JWT
      const data = await request('POST', '/api/login', { email, password });
    
      // 2. On utilise la fonction du context
      // ATTENTION : 'data.user' doit exister dans la réponse Symfony 
      // (via le Listener AuthenticationSuccessListener que je t'ai donné avant)
      login(data.user, data.token);
    
      navigate('/admin/dashboard');
    } catch (err) {
      console.error("Échec de la connexion", err);
    }
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
          
          {/* 4. Affichage de l'erreur si Symfony renvoie une 401 ou 403 */}
          {error && (
            <div className="bg-red-50 border-l-4 border-primary text-primary p-3 rounded text-sm font-medium animate-pulse">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-bold text-dark mb-1">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading} // Désactivé pendant l'appel API
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary outline-none transition disabled:opacity-50" 
                placeholder="@" 
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-dark mb-1">Mot de passe</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading} // Désactivé pendant l'appel API
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary outline-none transition disabled:opacity-50" 
                placeholder="••••••••" 
              />
            </div>
            <div className="flex justify-end">
  <Link 
    to="/forgot-password" 
    className="text-xs font-bold text-primary hover:text-dark transition"
  >
    Mot de passe oublié ?
  </Link>
</div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-primary text-white py-3 rounded-lg font-bold hover:bg-dark transition shadow-lg flex items-center justify-center space-x-2 disabled:bg-gray-400"
          >
            {/* 5. Feedback visuel du chargement */}
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                <span>Connexion en cours...</span>
              </>
            ) : (
              <span>Se connecter</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};