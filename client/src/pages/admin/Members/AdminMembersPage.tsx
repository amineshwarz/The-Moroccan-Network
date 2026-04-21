import React, { useEffect, useState } from 'react';
import { useAxios } from '../../../hooks/useAxios';
import { useAuth } from '../../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, Lock, ShieldCheck, Search, 
  ChevronRight, AlertTriangle, X, Check,Trash2
} from 'lucide-react';

export const AdminMembersPage: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const { request, loading } = useAxios();
  const { user: currentUser } = useAuth();
  const amISuperAdmin = currentUser?.roles?.includes('ROLE_SUPER_ADMIN');

  // État pour la modal de confirmation
  const [pendingChange, setPendingChange] = useState<{userId: number, userName: string, role: string} | null>(null);

  const fetchUsers = async () => {
    try {
      const data = await request('GET', '/api/admin/users/');
      setUsers(data);
    } catch (err) { console.error(err); }
  };

  useEffect(() => { fetchUsers(); }, []);

  // Exécution du changement après confirmation
  const executeRoleChange = async () => {
    if (!pendingChange) return;
    try {
      await request('PATCH', `/api/admin/users/${pendingChange.userId}/role`, { role: pendingChange.role });
      setUsers(users.map(u => u.id === pendingChange.userId ? { ...u, roles: [pendingChange.role] } : u));
      setPendingChange(null);
    } catch (err) {
      alert("Action refusée.");
      setPendingChange(null);
    }
  };

  const handleDelete = async (userId: number, userName: string) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer ${userName} ?`)) {
      try {
        await request('DELETE', `/api/admin/users/${userId}`);
        // Rafraîchir la liste après suppression
        setUsers(users.filter(u => u.id !== userId));
      } catch (err) {
        alert("Erreur lors de la suppression.");
      }
    }
  };

  const getMainRole = (roles: string[]) => {
    if (roles.includes('ROLE_SUPER_ADMIN')) return 'ROLE_SUPER_ADMIN';
    if (roles.includes('ROLE_ADMIN')) return 'ROLE_ADMIN';
    return 'ROLE_USER';
  };

  const filteredUsers = users.filter(u => 
    `${u.firstName} ${u.lastName} ${u.email}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // --- COMPOSANT SEGMENTED CONTROL ---
  const RoleSwitcher = ({ u, targetRole, amISuperAdmin, isTargetSuperAdmin, isSelf, canIEdit }: any) => {
    const roles = [
      { id: 'ROLE_USER', label: 'BUREAU' },
      { id: 'ROLE_ADMIN', label: 'ADMIN 2' },
      ...(amISuperAdmin ? [{ id: 'ROLE_SUPER_ADMIN', label: 'PRÉSIDENT' }] : [])
    ];

    if (isTargetSuperAdmin && !amISuperAdmin) {
      return (
        <div className="flex items-center gap-2 text-gray-300 font-black text-[9px] tracking-widest italic uppercase border border-gray-100 px-3 py-2">
          <Lock size={12} /> Accès Protégé
        </div>
      );
    }

    return (
      <div className="inline-flex bg-gray-100 p-1 border border-dark/5 w-full md:w-auto overflow-x-auto no-scrollbar">
        {roles.map((role) => {
          const isSelected = targetRole === role.id;
          const isDisabled = isSelf || !canIEdit;
          return (
            <button
              key={role.id}
              disabled={isDisabled}
              onClick={() => setPendingChange({ userId: u.id, userName: `${u.firstName} ${u.lastName}`, role: role.id })}
              className={`relative px-4 py-2 text-[9px] font-black uppercase tracking-widest transition-all duration-300 flex-1 whitespace-nowrap
                ${isSelected ? 'bg-dark text-white shadow-lg' : 'text-gray-400 hover:text-dark hover:bg-white/50'}
                ${isDisabled ? 'opacity-20 cursor-not-allowed' : 'cursor-pointer'}
              `}
            >
              {role.label}
            </button>
          );
        })}
      </div>
    );
  };

  return (
    <div className="space-y-10 pb-20">
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-dark/5 pb-10">
        <div>
          <h1 className="text-5xl md:text-6xl font-black text-dark tracking-tighter uppercase italic leading-none">
            Staff<span className="text-primary">.</span>
          </h1>
          <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px] mt-4 flex items-center gap-2">
            <ShieldCheck size={14} className="text-primary"/> Accréditations du réseau
          </p>
        </div>

        <div className="relative w-full md:w-80">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
          <input 
            type="text"
            placeholder="RECHERCHER..."
            className="w-full pl-12 pr-4 py-4 bg-white border border-gray-100 outline-none focus:ring-2 focus:ring-primary/20 font-bold text-[10px] uppercase tracking-widest"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* --- VUE MOBILE (Cartes) : Visible uniquement sur petit écran --- */}
      <div className="grid grid-cols-1 gap-4 lg:hidden">
        {filteredUsers.map((u) => {
          const targetRole = getMainRole(u.roles);
          const amISuperAdmin = currentUser?.roles?.includes('ROLE_SUPER_ADMIN');
          const isTargetSuperAdmin = targetRole === 'ROLE_SUPER_ADMIN';
          const canIEdit = amISuperAdmin || !isTargetSuperAdmin;
          const isSelf = currentUser?.email === u.email;

          return (
            <div key={u.id} className="bg-white p-6 border border-gray-100 shadow-sm space-y-6">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 flex items-center justify-center font-black border-2 ${isTargetSuperAdmin ? 'bg-dark border-primary text-primary' : 'bg-gray-50 text-gray-400'}`}>
                  {u.firstName[0]}{u.lastName[0]}
                </div>
                <div>
                  <p className="font-black text-dark uppercase italic">{u.firstName} {u.lastName}</p>
                  <p className="text-[10px] text-gray-400 font-bold uppercase">{u.email}</p>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Modifier les accès :</p>
                <RoleSwitcher u={u} targetRole={targetRole} amISuperAdmin={amISuperAdmin} isTargetSuperAdmin={isTargetSuperAdmin} isSelf={isSelf} canIEdit={canIEdit} />
              </div>
            </div>
          );
        })}
      </div>

      {/* --- VUE DESKTOP (Tableau) : Cachée sur mobile --- */}
      <div className="hidden lg:block bg-white border border-gray-100 shadow-2xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-dark text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
            <tr>
              <th className="px-8 py-6">Collaborateur</th>
              <th className="px-8 py-6">Accréditation actuelle</th>
              <th className="px-8 py-6 text-center">Role</th>
              <th className="px-8 py-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filteredUsers.map((u) => {
              const targetRole = getMainRole(u.roles);
              const amISuperAdmin = currentUser?.roles?.includes('ROLE_SUPER_ADMIN');
              const isTargetSuperAdmin = targetRole === 'ROLE_SUPER_ADMIN';
              const canIEdit = amISuperAdmin || !isTargetSuperAdmin;
              const isSelf = currentUser?.email === u.email;

              return (
                <tr key={u.id} className="group hover:bg-primary-light/5 transition-colors">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 flex items-center justify-center font-black text-xs border-2 ${isTargetSuperAdmin ? 'bg-dark border-primary text-primary' : 'bg-gray-50 text-gray-400'}`}>
                        {u.firstName[0]}{u.lastName[0]}
                      </div>
                      <p className="font-black text-dark uppercase italic">{u.firstName} {u.lastName} {isSelf && <span className="text-primary ml-2">(VOUS)</span>}</p>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{u.email}</span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <RoleSwitcher u={u} targetRole={targetRole} amISuperAdmin={amISuperAdmin} isTargetSuperAdmin={isTargetSuperAdmin} isSelf={isSelf} canIEdit={canIEdit} />
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex justify-end items-center gap-2">
                      {amISuperAdmin && !isSelf ? (
                        <motion.button 
                          whileHover={{ scale: 1.1 }}
                          onClick={() => handleDelete(u.id, u.firstName)}
                          className="p-2 text-gray-300 hover:text-primary transition-all"
                        >
                          <Trash2 size={18} />
                        </motion.button>
                      ) : (
                        <div className="text-gray-200 items-center" title="Accès limité">
                          <Lock size={16} />
                        </div>
                      )}
                    </div>
                  </td>

                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* --- MODAL DE CONFIRMATION --- */}
      <AnimatePresence>
        {pendingChange && (
          <div className="fixed inset-0 z-1000 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setPendingChange(null)} className="absolute inset-0 bg-dark/90 backdrop-blur-md" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative bg-white border-t-12 border-primary w-full max-w-md p-10 shadow-2xl">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary-light text-primary mx-auto flex items-center justify-center mb-6">
                   <AlertTriangle size={32} />
                </div>
                <h2 className="text-2xl font-black text-dark uppercase italic tracking-tighter mb-4">SÉCURITÉ.</h2>
                <p className="text-gray-500 font-medium text-sm mb-10 leading-relaxed">
                  Confirmez-vous le changement de rôle pour <br/>
                  <span className="text-dark font-black uppercase tracking-widest">{pendingChange.userName}</span> ?
                </p>
                <div className="flex gap-4">
                  <button onClick={() => setPendingChange(null)} className="flex-1 py-4 border-2 border-dark font-black text-[11px] uppercase tracking-widest hover:bg-gray-50 transition-all">Annuler</button>
                  <button onClick={executeRoleChange} className="flex-1 py-4 bg-dark text-white font-black text-[11px] uppercase tracking-widest hover:bg-primary transition-all flex items-center justify-center gap-2">
                    <Check size={16} /> CONFIRMER
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};