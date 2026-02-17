import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAxios } from '../../../hooks/useAxios';
import { Mail, Lock, CheckCircle, ArrowLeft } from 'lucide-react';

export const ForgotPasswordPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token'); // On guette le token dans l'URL
  const navigate = useNavigate();
  const { request, loading, error } = useAxios();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSent, setIsSent] = useState(false);

  // ÉTAPE 1 : Envoyer la demande de mail
  const handleRequestMail = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await request('POST', '/api/forgot-password/request', { email });
      setIsSent(true); // On affiche le message de succès
    } catch (err) {}
  };

  // ÉTAPE 2 : Envoyer le nouveau mot de passe
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await request('POST', '/api/forgot-password/reset', { token, password });
      alert("Mot de passe modifié !");
      navigate('/admin');
    } catch (err) {}
  };

  return (
    <div className="min-h-screen bg-light flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-md border-t-8 border-primary">
        
        {/* CAS 1 : On demande le mail (Pas de token dans l'URL) */}
        {!token ? (
          <>
            {!isSent ? (
              <form onSubmit={handleRequestMail} className="space-y-6">
                <h1 className="text-2xl font-bold text-dark text-center">Mot de passe oublié ?</h1>
                <p className="text-gray-500 text-sm text-center">Entrez votre email pour recevoir un lien de récupération.</p>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 text-gray-400" size={18} />
                  <input 
                    type="email" required placeholder="votre@email.com"
                    className="w-full pl-10 p-2 border rounded-xl outline-none focus:ring-2 focus:ring-primary"
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <button disabled={loading} className="w-full bg-primary text-white py-3 rounded-xl font-bold hover:bg-dark transition">
                  {loading ? 'Envoi...' : 'Envoyer le lien'}
                </button>
              </form>
            ) : (
              <div className="text-center space-y-4">
                <CheckCircle size={60} className="text-green-500 mx-auto" />
                <h2 className="text-xl font-bold">Vérifiez vos emails</h2>
                <p className="text-gray-500">Si un compte existe pour {email}, vous allez recevoir un lien d'ici quelques instants.</p>
                <button onClick={() => navigate('/admin')} className="text-primary font-bold">Retour au login</button>
              </div>
            )}
          </>
        ) : (
          /* CAS 2 : On réinitialise (Token présent dans l'URL) */
          <form onSubmit={handleResetPassword} className="space-y-6">
            <h1 className="text-2xl font-bold text-dark text-center">Nouveau mot de passe</h1>
            <p className="text-gray-500 text-sm text-center">Choisissez un mot de passe robuste.</p>
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
              <input 
                type="password" required placeholder="Minimum 8 caractères"
                className="w-full pl-10 p-2 border rounded-xl outline-none focus:ring-2 focus:ring-primary"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button disabled={loading} className="w-full bg-dark text-white py-3 rounded-xl font-bold hover:bg-primary transition">
              {loading ? 'Mise à jour...' : 'Valider le nouveau mot de passe'}
            </button>
          </form>
        )}

        {error && <p className="text-primary text-center mt-4 text-xs font-bold">{error}</p>}
      </div>
    </div>
  );
};