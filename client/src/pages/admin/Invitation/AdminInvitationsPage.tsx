import React, { useState } from 'react';
import { UserPlus, Copy, CheckCircle, Send, Mail } from 'lucide-react';
import { useAxios } from '../../../hooks/useAxios';

export const AdminInvitationsPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [generatedLink, setGeneratedLink] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const { request, loading, error } = useAxios();

  // Fonction pour envoyer l'invitation à Symfony
  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneratedLink(null);
    setCopied(false);

    try {
      // On appelle la route que nous avons créée dans Symfony
      const data = await request('POST', '/api/admin/invitations/create', { email });
      
      // Symfony nous renvoie le lien magique
      setGeneratedLink(data.link);
      setEmail(''); // On vide le champ
    } catch (err) {
      console.error("Erreur lors de l'invitation", err);
    }
  };

  // Fonction pour copier le lien dans le presse-papier
  const copyToClipboard = () => {
    if (generatedLink) {
      navigator.clipboard.writeText(generatedLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000); // Reset l'icône après 3s
    }
  };

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-dark">Gestion des Invitations Staff</h1>

      {/* --- FORMULAIRE D'INVITATION --- */}
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 max-w-2xl">
        <h2 className="text-lg font-bold text-dark mb-4 flex items-center gap-2">
          <UserPlus className="text-primary" size={20} />
          Inviter un nouveau membre du bureau
        </h2>
        
        <p className="text-sm text-gray-500 mb-6">
          Saisissez l'adresse email de la personne. Elle recevra un lien unique pour créer son compte.
        </p>

        <form onSubmit={handleInvite} className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@exemple.com"
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary outline-none transition"
              disabled={loading}
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="bg-primary text-white px-6 py-2 rounded-xl font-bold hover:bg-dark transition shadow-lg flex items-center justify-center gap-2 disabled:bg-gray-400"
          >
            {loading ? 'Génération...' : 'Inviter'}
            <Send size={16} />
          </button>
        </form>

        {error && <p className="text-primary text-sm mt-4 font-medium">{error}</p>}
      </div>

      {/* --- AFFICHAGE DU LIEN GÉNÉRÉ --- */}
      {generatedLink && (
        <div className="bg-primary-light border-2 border-primary border-dashed p-6 rounded-2xl animate-in fade-in slide-in-from-top-4 duration-500">
          <h3 className="text-primary font-bold mb-2 flex items-center gap-2">
            <CheckCircle size={18} />
            Lien généré avec succès !
          </h3>
          <p className="text-sm text-dark mb-4">
            Copiez ce lien et envoyez-le manuellement à votre futur membre :
          </p>
          <div className="flex items-center gap-2 bg-white p-3 rounded-lg border border-primary/20">
            <code className="text-xs text-gray-600 flex-1 break-all">{generatedLink}</code>
            <button 
              onClick={copyToClipboard}
              className={`p-2 rounded-lg transition ${copied ? 'bg-green-500 text-white' : 'bg-primary text-white hover:bg-dark'}`}
            >
              {copied ? <CheckCircle size={20} /> : <Copy size={20} />}
            </button>
          </div>
          {copied && <p className="text-green-600 text-xs mt-2 font-bold">Lien copié dans le presse-papier !</p>}
        </div>
      )}

      {/* --- LISTE DES INVITATIONS EN ATTENTE (Placeholder) --- */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-50">
          <h2 className="text-lg font-bold text-dark">Invitations récentes</h2>
        </div>
        <div className="p-12 text-center text-gray-400">
          <Mail size={48} className="mx-auto mb-4 opacity-20" />
          <p>La liste de suivi des invitations sera disponible dès que le backend sera branché.</p>
        </div>
      </div>
    </div>
  );
};