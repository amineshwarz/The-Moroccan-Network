import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAxios } from '../../../hooks/useAxios';
import { Lock, User, ShieldCheck, ChevronLeft } from 'lucide-react';
import { motion } from 'framer-motion';

export const RegistrationPage: React.FC = () => {
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
      await request('POST', '/api/register', {
        token: token,
        firstName: form.firstName,
        lastName: form.lastName,
        password: form.password
      });
      navigate('/admin'); 
    } catch (err) { console.error(err); }
  };

  if (!token) return (
    <div className="h-screen flex items-center justify-center bg-dark text-white p-4 text-center">
      <div className="space-y-6">
        <h1 className="text-4xl font-black uppercase italic tracking-tighter">Accès Restreint<span className="text-primary">.</span></h1>
        <p className="text-gray-400 font-medium">Une invitation valide est requise pour accéder à cet espace.</p>
        <button onClick={() => navigate('/')} className="text-primary font-bold border-b border-primary pb-1">Retour au site</button>
      </div>
    </div>
  );

  return (
    <div className="bg-white min-h-screen">
      <section className="bg-dark text-white pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          <span className="text-primary font-bold tracking-[0.4em] text-[10px] uppercase block mb-4">Administration Staff</span>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase italic leading-[0.8]">
            Finaliser<br/><span className="text-primary">l'accès.</span>
          </h1>
        </div>
      </section>

      <div className="max-w-2xl mx-auto px-4 -mt-12 pb-24">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="bg-white border-2 border-dark p-8 md:p-12 shadow-2xl"
        >
          <div className="flex items-center gap-3 mb-10 pb-6 border-b border-gray-100">
             <ShieldCheck className="text-primary" size={28} />
             <h2 className="text-2xl font-black text-dark uppercase tracking-tighter italic">Création de compte</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {error && <p className="bg-red-50 text-primary p-4 text-xs font-bold border-l-4 border-primary uppercase tracking-widest">{error}</p>}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Prénom</label>
                <input 
                  required className="w-full p-4 bg-gray-50 border-b-2 border-transparent focus:border-primary focus:bg-white outline-none font-bold text-dark transition-all"
                  placeholder="EX: AMINE"
                  onChange={e => setForm({...form, firstName: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Nom</label>
                <input 
                  required className="w-full p-4 bg-gray-50 border-b-2 border-transparent focus:border-primary focus:bg-white outline-none font-bold text-dark transition-all"
                  placeholder="EX: EL AMRANI"
                  onChange={e => setForm({...form, lastName: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Mot de passe</label>
              <input 
                type="password" required className="w-full p-4 bg-gray-50 border-b-2 border-transparent focus:border-primary focus:bg-white outline-none font-bold text-dark transition-all"
                placeholder="••••••••"
                onChange={e => setForm({...form, password: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Confirmation</label>
              <input 
                type="password" required className="w-full p-4 bg-gray-50 border-b-2 border-transparent focus:border-primary focus:bg-white outline-none font-bold text-dark transition-all"
                placeholder="••••••••"
                onChange={e => setForm({...form, confirmPassword: e.target.value})}
              />
            </div>

            <div className="pt-6">
              <button 
                type="submit" disabled={loading}
                className="w-full bg-dark text-white py-5 font-black text-xs tracking-[0.3em] hover:bg-primary transition-all shadow-xl disabled:bg-gray-400"
              >
                {loading ? "TRAITEMENT..." : "ACTIVER MON COMPTE STAFF"}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};