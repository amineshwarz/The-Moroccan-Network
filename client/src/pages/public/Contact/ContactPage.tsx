import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAxios } from '../../../hooks/useAxios';
import { 
  Mail, MapPin, Send, Globe, CheckCircle, 
  Loader2, MessageCircle, Instagram, Linkedin, 
  Facebook, ArrowRight, ChevronLeft
} from 'lucide-react';

export const ContactPage: React.FC = () => {
  const { request, loading } = useAxios();
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await request('POST', '/api/contact', form);
      setSubmitted(true);
    } catch (err) {
      console.error("Erreur envoi contact", err);
    }
  };

  return (
    <div className="bg-white min-h-screen">
      
      {/* --- SECTION TITRE (STYLE INSTITUTIONNEL IDENTIQUE AUX AUTRES PAGES) --- */}
      <section className="bg-dark text-white pt-32 pb-20 px-4 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.span 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="text-primary font-bold tracking-[0.4em] text-xs uppercase block mb-4"
          >
            Communication Officielle
          </motion.span>
          <h1 className="text-5xl md:text-8xl font-black tracking-tighter uppercase italic leading-[0.8]">
            Contact<span className="text-primary">.</span>
          </h1>
          <p className="mt-8 text-gray-400 max-w-xl font-medium text-lg italic">
            Une question sur le réseau ? Un projet de partenariat ? <br/>Nos équipes sont à votre disposition.
          </p>
        </div>
        {/* Décor géométrique en fond */}
        <div className="absolute right-0 top-0 w-1/4 h-full bg-primary/5 -skew-x-12 translate-x-20" />
      </section>

      <div className="max-w-7xl mx-auto px-4 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
          
          {/* --- COLONNE GAUCHE (INFOS & RÉSEAUX) --- */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-5 space-y-16"
          >
            {/* Informations de contact */}
            <div className="space-y-10">
              {[
                { icon: <Mail size={18}/>, label: "Email", value: "contact@themoroccannetwork.org" },
                { icon: <MapPin size={18}/>, label: "Siège", value: "Lyon, France" },
                { icon: <Globe size={18}/>, label: "Réseau", value: "International" },
              ].map((info, i) => (
                <div key={i} className="flex items-start gap-6 group">
                  <div className="w-12 h-12 bg-dark text-primary flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-white transition-colors duration-500">
                    {info.icon}
                  </div>
                  <div className="border-l border-gray-100 pl-6">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{info.label}</p>
                    <p className="text-dark font-bold text-lg tracking-tight">{info.value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Réseaux Sociaux (Carrés et épurés) */}
            <div className="space-y-6">
              <p className="text-[10px] font-black text-dark uppercase tracking-[0.3em] border-b-2 border-primary w-fit pb-1">Suivez le réseau</p>
              <div className="flex gap-4">
                {[
                  { icon: <Instagram size={20}/>, link: "#" },
                  { icon: <Linkedin size={20}/>, link: "#" },
                  { icon: <Facebook size={20}/>, link: "#" },
                ].map((social, i) => (
                  <motion.a
                    key={i} href={social.link}
                    whileHover={{ scale: 1.1 }}
                    className="w-14 h-14 bg-gray-50 border border-gray-200 flex items-center justify-center text-dark hover:bg-primary hover:text-white transition-all duration-300"
                  >
                    {social.icon}
                  </motion.a>
                ))}
              </div>
            </div>

            {/* Bloc WhatsApp (Compact, Couleur officielle, Institutionnel) */}
            <motion.a 
              href="https://chat.whatsapp.com/..."
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ x: 8 }}
              className="block bg-[#25D366] border-l-8 border-[#075E54] p-5 text-white group transition-all max-w-sm"
            >
              <div className="flex items-center gap-4">
                  {/* Icône avec un fond légèrement plus sombre pour le contraste */}
                  <div className="p-3 bg-[#075E54]/20 rounded-sm">
                      <MessageCircle size={24} fill="currentColor" />
                  </div>
                  
                  <div className="flex-1">
                      <h3 className="text-lg font-black uppercase italic tracking-tighter leading-none">
                        Communauté <span className="text-white">Whatapp</span>
                      </h3>
                      <p className="text-[#f6fafa] text-[9px] font-black uppercase tracking-[0.2em] mt-1 opacity-80">
                        Rejoindre le groupe
                      </p>
                  </div>

                  {/* Flèche d'action */}
                  <ArrowRight 
                    size={20} 
                    className="text-white group-hover:translate-x-1 transition-transform" 
                  />
              </div>
            </motion.a>
          </motion.div>

          {/* --- COLONNE DROITE (LE FORMULAIRE ANGULAIRE) --- */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-7"
          >
            <AnimatePresence mode="wait">
              {!submitted ? (
                <motion.form 
                  key="form"
                  exit={{ opacity: 0 }}
                  onSubmit={handleSubmit}
                  className="bg-gray-50 border border-gray-100 p-10 md:p-14 space-y-10"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-dark uppercase tracking-widest">Nom Complet</label>
                      <input 
                        required className="w-full p-4 bg-transparent border-b-2 border-gray-200 focus:border-primary focus:bg-white outline-none font-bold text-dark transition-all"
                        placeholder="EX: AMINE EL AMRANI"
                        onChange={e => setForm({...form, name: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-dark uppercase tracking-widest">Votre Email</label>
                      <input 
                        type="email" required className="w-full p-4 bg-transparent border-b-2 border-gray-200 focus:border-primary focus:bg-white outline-none font-bold text-dark transition-all"
                        placeholder="EMAIL@EXEMPLE.COM"
                        onChange={e => setForm({...form, email: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-dark uppercase tracking-widest">Objet de la demande</label>
                    <input 
                      required className="w-full p-4 bg-transparent border-b-2 border-gray-200 focus:border-primary focus:bg-white outline-none font-bold text-dark transition-all"
                      placeholder="PARTENARIAT, ADHÉSION, AUTRE..."
                      onChange={e => setForm({...form, subject: e.target.value})}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-dark uppercase tracking-widest">Message</label>
                    <textarea 
                      required className="w-full p-4 bg-transparent border-b-2 border-gray-200 focus:border-primary focus:bg-white outline-none font-medium text-dark h-40 resize-none transition-all"
                      placeholder="VOTRE MESSAGE ICI..."
                      onChange={e => setForm({...form, message: e.target.value})}
                    />
                  </div>

                  <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full bg-primary text-white py-6 font-black text-xs tracking-[0.3em] hover:bg-dark transition-all shadow-xl flex items-center justify-center gap-4 disabled:bg-gray-300"
                  >
                    {loading ? <Loader2 className="animate-spin" /> : <Send size={18} />}
                    ENVOYER LE MESSAGE
                  </button>
                </motion.form>
              ) : (
                /* ÉTAT DE SUCCÈS (Carré et minimaliste) */
                <motion.div 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="bg-dark p-20 text-center border-t-8 border-primary"
                >
                  <CheckCircle size={48} className="text-primary mx-auto mb-8" />
                  <h2 className="text-4xl font-black text-white uppercase italic tracking-tighter mb-4">Transmission Réussie</h2>
                  <p className="text-gray-400 font-medium mb-12 uppercase text-xs tracking-widest">
                    Votre message a été intégré à notre flux de traitement.
                  </p>
                  <button 
                    onClick={() => setSubmitted(false)}
                    className="text-primary font-black uppercase tracking-widest text-xs border-b-2 border-primary pb-1 hover:text-white hover:border-white transition-all"
                  >
                    Nouveau message
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

        </div>
      </div>
    </div>
  );
};