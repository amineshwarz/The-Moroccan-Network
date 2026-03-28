import React, { useEffect, useState } from 'react';
import { 
  UserPlus, Copy, CheckCircle, Send, Mail, 
  Trash2, Clock, ShieldCheck, Search, X, Loader2, RefreshCcw 
} from 'lucide-react';
import { useAxios } from '../../../hooks/useAxios';
import { motion, AnimatePresence } from 'framer-motion';

export const AdminInvitationsPage: React.FC = () => {
  const { request, loading, error } = useAxios();
  const [invitations, setInvitations] = useState<any[]>([]);
  const [email, setEmail] = useState('');
  const [generatedLink, setGeneratedLink] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Charger la liste des invitations
  const fetchInvitations = async () => {
    try {
      const data = await request('GET', '/api/admin/invitations');
      setInvitations(data);
    } catch (err) { console.error(err); }
  };

  useEffect(() => { fetchInvitations(); }, []);

  // Envoyer une invitation
  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = await request('POST', '/api/admin/invitations/create', { email });
      setGeneratedLink(data.link);
      setEmail('');
      fetchInvitations(); // Rafraîchir la liste
    } catch (err) {}
  };

  // Révoquer une invitation
  const handleDelete = async (id: number) => {
    if (window.confirm("Voulez-vous vraiment révoquer cette invitation ?")) {
      try {
        await request('DELETE', `/api/admin/invitations/${id}`);
        setInvitations(prev => prev.filter(inv => inv.id !== id));
      } catch (err) {}
    }
  };

  const copyToClipboard = () => {
    if (generatedLink) {
      navigator.clipboard.writeText(generatedLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-12 pb-20">
      
      {/* --- HEADER --- */}
      <div className="border-b border-dark/5 pb-10">
        <h1 className="text-6xl font-black text-dark tracking-tighter uppercase italic">
          Staff <span className="text-primary">Recruitment.</span>
        </h1>
        <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px] mt-2">
          Générez des accès sécurisés pour le futur bureau exécutif.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* --- COLONNE GAUCHE : FORMULAIRE (5/12) --- */}
        <div className="lg:col-span-5 space-y-8">
          <div className="bg-white border-2 border-dark p-8 shadow-2xl">
            <h2 className="text-xl font-black text-dark uppercase tracking-widest mb-6 italic flex items-center gap-3">
              <UserPlus className="text-primary" /> Nouvelle Invitation
            </h2>
            
            <form onSubmit={handleInvite} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Email du destinataire</label>
                <input 
                  type="email" required value={email}
                  className="w-full p-4 bg-gray-50 border-b-2 border-transparent focus:border-primary outline-none font-bold text-dark transition-all"
                  placeholder="NOM@THEMOROCCANNETWORK.ORG"
                  onChange={e => setEmail(e.target.value)}
                />
              </div>

              <button 
                disabled={loading}
                className="w-full bg-dark text-white py-5 font-black text-xs tracking-[0.3em] hover:bg-primary transition-all flex items-center justify-center gap-3 shadow-xl"
              >
                {loading ? <Loader2 className="animate-spin" size={16}/> : <Send size={16} />}
                GÉNÉRER L'ACCÈS
              </button>
            </form>
          </div>

          {/* Affichage du lien si généré */}
          <AnimatePresence>
            {generatedLink && (
              <motion.div 
                initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}
                className="bg-primary text-white p-6 border-l-8 border-dark shadow-xl"
              >
                <div className="flex justify-between items-start mb-4">
                    <p className="text-[10px] font-black uppercase tracking-widest">Lien de sécurité généré</p>
                    <button onClick={() => setGeneratedLink(null)}><X size={16}/></button>
                </div>
                <div className="bg-white/10 p-4 mb-4 break-all text-xs font-mono border border-white/20">
                    {generatedLink}
                </div>
                <button 
                  onClick={copyToClipboard}
                  className="w-full bg-white text-dark py-3 font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-dark hover:text-white transition-all"
                >
                  {copied ? <CheckCircle size={14}/> : <Copy size={14}/>}
                  {copied ? "COPIÉ !" : "COPIER LE LIEN"}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* --- COLONNE DROITE : LISTE DE SUIVI (7/12) --- */}
        <div className="lg:col-span-7">
          <div className="bg-white border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-50 bg-gray-50/50 flex justify-between items-center">
              <h3 className="text-[10px] font-black text-dark uppercase tracking-[0.3em]">Suivi des envois</h3>
              <button onClick={fetchInvitations} className="text-gray-400 hover:text-primary transition-colors">
                <RefreshCcw size={14} className={loading ? 'animate-spin' : ''} />
              </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="text-[9px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100">
                    <th className="px-6 py-4">Utilisateur autorisé</th>
                    <th className="px-6 py-4">Statut</th>
                    <th className="px-6 py-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {invitations.map((inv) => (
                    <tr key={inv.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-5">
                        <p className="font-bold text-dark text-sm uppercase tracking-tighter">{inv.email}</p>
                        <p className="text-[9px] text-gray-400 font-medium tracking-widest">Expire : {inv.expiresAt}</p>
                      </td>
                      <td className="px-6 py-5">
                        {inv.isUsed ? (
                          <span className="text-[9px] font-black text-green-600 bg-green-50 px-2 py-1 uppercase tracking-widest border border-green-100 italic">Inscrit</span>
                        ) : inv.isValid ? (
                          <span className="text-[9px] font-black text-primary bg-primary/5 px-2 py-1 uppercase tracking-widest border border-primary/10">En attente</span>
                        ) : (
                          <span className="text-[9px] font-black text-gray-400 bg-gray-100 px-2 py-1 uppercase tracking-widest">Expiré</span>
                        )}
                      </td>
                      <td className="px-6 py-5 text-right">
                        {!inv.isUsed && (
                          <button 
                            onClick={() => handleDelete(inv.id)}
                            className="p-2 text-gray-300 hover:text-primary transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                  {invitations.length === 0 && (
                    <tr>
                      <td colSpan={3} className="p-20 text-center text-gray-300 text-xs font-bold uppercase tracking-widest italic">
                        Aucun historique de recrutement.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>
    </motion.div>
  );
};