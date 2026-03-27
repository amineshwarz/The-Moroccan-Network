import React, { useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useAxios } from '../../../hooks/useAxios';
import { Mail, Lock, CheckCircle, ChevronLeft, Send, ArrowRight, ShieldAlert, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const ForgotPasswordPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();
  const { request, loading, error } = useAxios();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSent, setIsSent] = useState(false);

  const handleRequestMail = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await request('POST', '/api/forgot-password/request', { email });
      setIsSent(true);
    } catch (err) {}
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await request('POST', '/api/forgot-password/reset', { token, password });
      alert("Mot de passe modifié avec succès !");
      navigate('/admin');
    } catch (err) {}
  };

  return (
    <div className="flex min-h-screen bg-white">
      
      {/* --- PARTIE GAUCHE : IDENTITÉ VISUELLE --- */}
      <div className="hidden lg:flex w-1/2 bg-dark relative flex-col justify-between p-16 overflow-hidden">
        {/* Décoration géométrique */}
        <div className="absolute top-0 right-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute bottom-[-10%] left-[-10%] w-500px h-500px border border-primary -rotate-12" />
        </div>

        <div className="relative z-10">
          <Link to="/admin" className="flex items-center gap-2 text-primary font-black uppercase tracking-[0.4em] text-xs hover:text-white transition-colors">
            <ChevronLeft size={16} /> Retour à la connexion
          </Link>
        </div>

        <div className="relative z-10">
          <div className="w-16 h-2 bg-primary mb-8" />
          <h1 className="text-7xl font-black text-white leading-none tracking-tighter uppercase italic">
            SÉCURITÉ <br />
            DU <br />
            <span className="text-primary">RÉSEAU.</span>
          </h1>
          <p className="text-gray-400 mt-8 max-w-md font-medium text-lg leading-relaxed">
            Protocole de récupération d'accès pour les membres accrédités de The Moroccan Network.
          </p>
        </div>

        <div className="relative z-10 text-gray-500 text-[10px] font-bold uppercase tracking-[0.5em]">
          Access Recovery System v2.0
        </div>
      </div>

      {/* --- PARTIE DROITE : LE FORMULAIRE DYNAMIQUE --- */}
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

          <AnimatePresence mode="wait">
            {!token ? (
              /* --- CAS 1 : DEMANDE DE LIEN --- */
              !isSent ? (
                <motion.div key="request" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-10">
                  <div className="space-y-2">
                    <h2 className="text-4xl font-black text-dark uppercase italic tracking-tighter">Récupération</h2>
                    <p className="text-gray-400 font-medium">Entrez votre email pour recevoir une clé de reset.</p>
                  </div>

                  <form onSubmit={handleRequestMail} className="space-y-10">
                    <div className="relative group">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block group-focus-within:text-primary transition-colors">
                        Email du Bureau
                      </label>
                      <div className="flex items-center border-b-2 border-gray-100 group-focus-within:border-primary transition-all pb-2">
                        <Mail size={18} className="text-gray-300 group-focus-within:text-primary transition-colors" />
                        <input 
                          type="email" required
                          className="w-full pl-4 bg-transparent outline-none font-bold text-dark placeholder:text-gray-200" 
                          placeholder="votre@email.org" 
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </div>
                    </div>

                    <button 
                      type="submit" disabled={loading}
                      className="w-full bg-dark text-white py-5 font-black text-xs tracking-[0.3em] hover:bg-primary transition-all flex items-center justify-center gap-4 shadow-2xl"
                    >
                      {loading ? <Loader2 className="animate-spin" /> : <><span>GÉNÉRER LE LIEN</span><Send size={16} /></>}
                    </button>
                  </form>
                </motion.div>
              ) : (
                /* --- ÉTAT SUCCÈS ENVOI --- */
                <motion.div key="sent" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center space-y-8">
                  <div className="w-20 h-20 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle size={40} />
                  </div>
                  <h2 className="text-3xl font-black text-dark uppercase italic tracking-tighter leading-none">Vérifiez vos <br/>emails.</h2>
                  <p className="text-gray-500 font-medium text-sm leading-relaxed">
                    Si un compte est associé à <span className="text-dark font-bold">{email}</span>, un protocole de réinitialisation vous a été transmis.
                  </p>
                  <button onClick={() => navigate('/admin')} className="text-[10px] font-black text-primary uppercase tracking-[0.2em] border-b-2 border-primary pb-1">
                    Retour au portail
                  </button>
                </motion.div>
              )
            ) : (
              /* --- CAS 2 : RÉINITIALISATION (TOKEN PRÉSENT) --- */
              <motion.div key="reset" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-10">
                <div className="space-y-2">
                  <h2 className="text-4xl font-black text-dark uppercase italic tracking-tighter">Nouveau mot de passe</h2>
                  <p className="text-gray-400 font-medium">Veuillez définir votre nouvel identifiant de sécurité.</p>
                </div>

                <form onSubmit={handleResetPassword} className="space-y-10">
                  <div className="relative group">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block group-focus-within:text-primary transition-colors">
                      Nouveau Mot de passe
                    </label>
                    <div className="flex items-center border-b-2 border-gray-100 group-focus-within:border-primary transition-all pb-2">
                      <Lock size={18} className="text-gray-300 group-focus-within:text-primary transition-colors" />
                      <input 
                        type="password" required
                        className="w-full pl-4 bg-transparent outline-none font-bold text-dark placeholder:text-gray-200" 
                        placeholder="••••••••" 
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </div>
                  </div>

                  <button 
                    type="submit" disabled={loading}
                    className="w-full bg-primary text-white py-5 font-black text-xs tracking-[0.3em] hover:bg-dark transition-all flex items-center justify-center gap-4 shadow-xl shadow-primary/20"
                  >
                    {loading ? <Loader2 className="animate-spin" /> : <><span>VALIDER LE CHANGEMENT</span><ArrowRight size={16} /></>}
                  </button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>

          {error && (
            <div className="p-4 border-l-4 border-primary bg-red-50 text-primary text-xs font-black uppercase tracking-widest mt-4">
              {error}
            </div>
          )}

        </motion.div>
      </div>
    </div>
  );
};