import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, Mail, Loader2, ChevronLeft, ArrowRight } from 'lucide-react';
import { useAxios } from '../../../hooks/useAxios';
import { useAuth } from '../../../context/AuthContext'; 
import { motion } from 'framer-motion';

export const AdminLoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();
  const { request, loading, error } = useAxios();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = await request('POST', '/api/login', { email, password });
      login(data.user, data.token);
      navigate('/admin/dashboard');
    } catch (err) {
      console.error("Échec de la connexion", err);
    }
  };

  return (
    <div className="flex min-h-screen bg-white">
      
      {/* --- PARTIE GAUCHE : VISUELLE & INSTITUTIONNELLE --- */}
      <div className="hidden lg:flex w-1/2 bg-dark relative flex-col justify-between p-16 overflow-hidden">
        {/* Décoration géométrique subtile */}
        <div className="absolute top-0 right-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute top-[-10%] right-[-10%] w-500px h-500px border border-primary rotate-45" />
        </div>

        <div className="relative z-10">
          <Link to="/" className="flex items-center gap-2 text-primary font-black uppercase tracking-[0.4em] text-xs">
            <ChevronLeft size={16} /> Retour au portail
          </Link>
        </div>

        <div className="relative z-10">
          <h1 className="text-7xl font-black text-white leading-none tracking-tighter uppercase italic">
            THE <br />
            MOROCCAN <br />
            <span className="text-primary">NETWORK.</span>
          </h1>
          <div className="w-24 h-2 bg-primary mt-8" />
          <p className="text-gray-400 mt-8 max-w-md font-medium text-lg leading-relaxed">
            Accès sécurisé réservé aux membres du bureau exécutif et à l'administration du réseau.
          </p>
        </div>

        <div className="relative z-10 text-gray-500 text-[8px] font-bold uppercase tracking-[0.5em]">
          &copy; 2026 The Moroccan Network - Tous droits réservés.
        </div>
      </div>

      {/* --- PARTIE DROITE : LE FORMULAIRE --- */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 md:p-20">
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-md space-y-12"
        >
          {/* Logo mobile uniquement */}
          <div className="lg:hidden mb-12">
            <h1 className="text-3xl font-black text-dark tracking-tighter uppercase italic">
              TM<span className="text-primary">N</span>.
            </h1>
          </div>

          <div className="space-y-2">
            <h2 className="text-4xl font-black text-dark uppercase italic tracking-tighter">Connexion</h2>
            <p className="text-gray-400 font-medium">Veuillez entrer vos identifiants de session.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-10">
            
            {/* Gestion des erreurs */}
            {error && (
              <div className="p-4 border-l-4 border-primary bg-red-50 text-primary text-xs font-black uppercase tracking-widest animate-in fade-in slide-in-from-left-2">
                {error}
              </div>
            )}

            <div className="space-y-8">
              {/* Champ Identifiant */}
              <div className="relative group">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block group-focus-within:text-primary transition-colors">
                  Email du Bureau
                </label>
                <div className="flex items-center border-b-2 border-gray-100 group-focus-within:border-primary transition-all pb-2">
                  <Mail size={18} className="text-gray-300 group-focus-within:text-primary transition-colors" />
                  <input 
                    type="email" 
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                    className="w-full pl-4 bg-transparent outline-none font-bold text-dark placeholder:text-gray-200" 
                    placeholder="nom@themoroccannetwork.org" 
                  />
                </div>
              </div>

              {/* Champ Mot de passe */}
              <div className="relative group">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block group-focus-within:text-primary transition-colors">
                  Mot de passe
                </label>
                <div className="flex items-center border-b-2 border-gray-100 group-focus-within:border-primary transition-all pb-2">
                  <Lock size={18} className="text-gray-300 group-focus-within:text-primary transition-colors" />
                  <input 
                    type="password" 
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                    className="w-full pl-4 bg-transparent outline-none font-bold text-dark placeholder:text-gray-200" 
                    placeholder="••••••••" 
                  />
                </div>
                <div className="flex justify-end mt-2">
                  <Link to="/forgot-password" className="text-[10px] font-black text-gray-400 uppercase hover:text-primary transition-colors">
                    Oubli ?
                  </Link>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-dark text-white py-5 font-black text-xs tracking-[0.3em] hover:bg-primary transition-all flex items-center justify-center gap-4 disabled:bg-gray-200"
              >
                {loading ? (
                  <Loader2 className="animate-spin" size={18} />
                ) : (
                  <>
                    <span>S'AUTHENTIFIER</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
              
              <p className="text-center text-[10px] text-gray-300 font-medium leading-relaxed">
                En vous connectant, vous acceptez les protocoles de sécurité <br /> et de confidentialité de The Moroccan Network.
              </p>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};