import React, { useEffect, useState } from 'react';
import { useAxios } from '../../../hooks/useAxios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  DollarSign, ArrowUpRight, Download, Search, 
  Filter, CreditCard, ArrowLeft, TrendingUp, History 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const AdminTicketing: React.FC = () => {
  const { request, loading } = useAxios();
  const [data, setData] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const res = await request('GET', '/api/admin/finance/transactions');
      setData(res);
    };
    fetchData();
  }, []);

  const filtered = data?.transactions.filter((t: any) => 
    t.label.toLowerCase().includes(searchTerm.toLowerCase()) || 
    t.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-10 pb-20">
      
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-dark/5 pb-10">
        <div>
          <button onClick={() => navigate('/admin/dashboard')} className="flex items-center gap-2 text-gray-400 hover:text-primary transition-colors text-xs font-black uppercase tracking-widest mb-4">
             <ArrowLeft size={14} /> Retour Dashboard
          </button>
          <h1 className="text-6xl font-black text-dark tracking-tighter uppercase italic">
            Finance<span className="text-primary">.</span>
          </h1>
          <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px] mt-2">The Moroccan Network Treasury</p>
        </div>
        
        <div className="flex gap-3">
          <button className="bg-dark text-white p-4 rounded-2xl font-bold flex items-center gap-2 hover:bg-primary transition-all shadow-xl">
            <Download size={18} /> <span className="text-sm">Exporter</span>
          </button>
        </div>
      </div>

      {/* --- STATS D'ENTÊTE --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-dark p-8 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden group">
            <div className="relative z-10">
                <p className="text-primary font-black text-[10px] tracking-[0.2em] mb-2 uppercase italic">Solde Total</p>
                <h2 className="text-5xl font-black tracking-tighter">{data?.totalBalance || 0}€</h2>
                <div className="mt-4 flex items-center text-green-400 text-xs font-bold bg-green-400/10 w-fit px-3 py-1 rounded-full">
                    <TrendingUp size={14} className="mr-1"/> +100% de croissance
                </div>
            </div>
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-primary/20 rounded-full blur-3xl" />
        </div>

        <div className="md:col-span-2 bg-white border border-gray-100 rounded-[2.5rem] p-8 flex items-center justify-around shadow-sm">
            <div className="text-center">
                <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-1">Membres</p>
                <p className="text-2xl font-black text-dark">Actif</p>
            </div>
            <div className="w-px h-12 bg-gray-100" />
            <div className="text-center">
                <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-1">Billets</p>
                <p className="text-2xl font-black text-dark">En ligne</p>
            </div>
            <div className="w-px h-12 bg-gray-100" />
            <div className="text-center">
                <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-1">Statut</p>
                <p className="text-2xl font-black text-green-500 italic">Sain</p>
            </div>
        </div>
      </div>

      {/* --- TABLE DE TRANSACTIONS (GLASSMORPHISM STYLE) --- */}
      <div className="bg-white/50 backdrop-blur-xl border border-gray-100 rounded-[3rem] shadow-xl overflow-hidden">
        <div className="p-8 border-b border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-dark rounded-xl text-white"><History size={20}/></div>
                <h2 className="text-xl font-black text-dark uppercase italic tracking-tighter">Flux Récent</h2>
            </div>
            <div className="relative w-full md:w-80">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input 
                    type="text" placeholder="Filtrer les transactions..."
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 font-medium text-sm"
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
        </div>

        <div className="overflow-x-auto">
            <table className="w-full text-left">
                <thead className="bg-gray-50/50 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                    <tr>
                        <th className="px-8 py-5 font-black">Transaction</th>
                        <th className="px-8 py-5 font-black">Catégorie</th>
                        <th className="px-8 py-5 font-black">Date</th>
                        <th className="px-8 py-5 text-right font-black">Montant</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {filtered?.map((t: any) => (
                        <tr key={t.id} className="hover:bg-primary-light/10 transition-colors group">
                            <td className="px-8 py-6">
                                <div className="flex items-center gap-4">
                                    <div className={`p-3 rounded-xl ${t.category === 'ADHESION' ? 'bg-primary/10 text-primary' : 'bg-dark/5 text-dark'}`}>
                                        <CreditCard size={18} />
                                    </div>
                                    <div>
                                        <p className="font-bold text-dark tracking-tight">{t.label}</p>
                                        <p className="text-[10px] text-gray-400 font-medium">{t.email}</p>
                                    </div>
                                </div>
                            </td>
                            <td className="px-8 py-6">
                                <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${
                                    t.category === 'ADHESION' ? 'border-primary/20 text-primary' : 'border-dark/20 text-dark'
                                }`}>
                                    {t.category}
                                </span>
                            </td>
                            <td className="px-8 py-6 text-xs font-bold text-gray-400 uppercase tracking-tighter">
                                {t.date}
                            </td>
                            <td className="px-8 py-6 text-right">
                                <span className="text-lg font-black text-dark tracking-tighter">
                                    +{t.amount}€
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      </div>
    </motion.div>
  );
};