import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAxios } from '../../../hooks/useAxios';
import { 
  Mail, Phone, MapPin, Send, 
  MessageSquare, Globe, CheckCircle, Loader2 
} from 'lucide-react';

export const ContactPage: React.FC = () => {
  const { request, loading } = useAxios();
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // On prépare la route Symfony /api/contact (on la créera juste après)
      await request('POST', '/api/contact', form);
      setSubmitted(true);
    } catch (err) {
      console.error("Erreur envoi contact", err);
    }
  };

  return (
    <div className="relative min-h-screen bg-white overflow-hidden flex items-center justify-center py-20 px-4">
      
      {/* --- ÉLÉMENTS DE DÉCOR DÉGRADÉS (Arrière-plan) --- */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-dark/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 relative z-10">
        
        {/* --- COLONNE GAUCHE : TEXTE & INFOS --- */}
        <motion.div 
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="flex flex-col justify-center space-y-10"
        >
          <div className="space-y-4">
            <span className="text-primary font-black uppercase tracking-[0.4em] text-xs">Contactez-nous</span>
            <h1 className="text-6xl md:text-7xl font-black text-dark tracking-tighter leading-none uppercase italic">
              Parlons de <br />
              <span className="text-primary">vos projets.</span>
            </h1>
            <p className="text-gray-500 text-lg font-medium max-w-md leading-relaxed">
              Une question, un partenariat ou simplement envie de nous rejoindre ? Notre équipe est à votre écoute.
            </p>
          </div>

          <div className="space-y-6">
            {[
              { icon: <Mail />, label: "Email", value: "contact@themoroccannetwork.org" },
              { icon: <MapPin />, label: "Siège Social", value: "Lyon, France" },
              { icon: <Globe />, label: "Réseau", value: "International" },
            ].map((info, i) => (
              <div key={i} className="flex items-center gap-4 group">
                <div className="w-12 h-12 bg-gray-50 text-dark rounded-2xl flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all duration-300 shadow-sm">
                  {info.icon}
                </div>
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{info.label}</p>
                  <p className="text-dark font-bold">{info.value}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* --- COLONNE DROITE : LE FORMULAIRE (GLASS) --- */}
        <motion.div 
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="relative"
        >
          {!submitted ? (
            <form 
              onSubmit={handleSubmit}
              className="bg-white/70 backdrop-blur-2xl border border-white rounded-[3rem] p-10 md:p-12 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.1)] space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase ml-2">Nom Complet</label>
                  <input 
                    required className="w-full p-4 bg-white/50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-primary font-bold text-dark transition-all"
                    placeholder="Amine ..."
                    onChange={e => setForm({...form, name: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase ml-2">Votre Email</label>
                  <input 
                    type="email" required className="w-full p-4 bg-white/50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-primary font-bold text-dark transition-all"
                    placeholder="email@exemple.com"
                    onChange={e => setForm({...form, email: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase ml-2">Sujet</label>
                <input 
                  required className="w-full p-4 bg-white/50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-primary font-bold text-dark transition-all"
                  placeholder="Partenariat, adhésion..."
                  onChange={e => setForm({...form, subject: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase ml-2">Message</label>
                <textarea 
                  required className="w-full p-4 bg-white/50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-primary font-medium text-dark h-32 resize-none"
                  placeholder="Comment pouvons-nous vous aider ?"
                  onChange={e => setForm({...form, message: e.target.value})}
                />
              </div>

              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={loading}
                className="w-full bg-dark text-white py-5 rounded-2xl font-black text-lg hover:bg-primary transition-all shadow-2xl flex items-center justify-center gap-3 disabled:opacity-50"
              >
                {loading ? <Loader2 className="animate-spin" /> : <Send size={20} />}
                <span>ENVOYER LE MESSAGE</span>
              </motion.button>
            </form>
          ) : (
            // --- ÉTAT APRÈS ENVOI ---
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-[3rem] p-16 text-center shadow-2xl border border-primary/10"
            >
              <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle size={40} />
              </div>
              <h2 className="text-3xl font-black text-dark uppercase italic tracking-tighter mb-4">Message Reçu !</h2>
              <p className="text-gray-500 font-medium mb-8">
                Merci {form.name}. Notre équipe vous répondra dans les plus brefs délais sur {form.email}.
              </p>
              <button 
                onClick={() => setSubmitted(false)}
                className="text-primary font-black uppercase tracking-widest text-xs hover:underline"
              >
                Envoyer un autre message
              </button>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};