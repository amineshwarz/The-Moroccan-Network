import React, { useEffect, useState } from 'react';
import { useAxios } from '../../../hooks/useAxios';
import { useAuth } from '../../../context/AuthContext'; // On récupère l'utilisateur connecté
import { Shield, User as UserIcon, Lock, RefreshCw } from 'lucide-react';

export const AdminMembersPage: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const { request, loading } = useAxios();
  const { user: currentUser } = useAuth(); // "currentUser" est la personne qui regarde la page

  const fetchUsers = async () => {
    try {
      const data = await request('GET', '/api/admin/users/');
      setUsers(data);
    } catch (err) {
      console.error("Erreur de chargement", err);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleChangeRole = async (userId: number, newRole: string) => {
    try {
      await request('PATCH', `/api/admin/users/${userId}/role`, { role: newRole });
      setUsers(users.map(u => u.id === userId ? { ...u, roles: [newRole] } : u));
    } catch (err) {
      // L'erreur 403 du backend sera capturée ici si un Admin 2 force l'appel
      alert("Action refusée par le serveur.");
    }
  };

  // Helper pour obtenir le rôle principal à afficher (plus simple qu'un tableau)
  const getMainRole = (roles: string[]) => {
    if (roles.includes('ROLE_SUPER_ADMIN')) return 'ROLE_SUPER_ADMIN';
    if (roles.includes('ROLE_ADMIN')) return 'ROLE_ADMIN';
    return 'ROLE_USER';
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-dark italic">
        Gestion de l'<span className="text-primary">Équipe Staff</span>
      </h1>

      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-dark text-white text-xs uppercase tracking-widest">
              <tr>
                <th className="px-6 py-4">Membre</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Niveau d'accès</th>
                <th className="px-6 py-4">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {users.map((u) => {
                const targetRole = getMainRole(u.roles);
                
                // --- LOGIQUE DE SÉCURITÉ CÔTÉ FRONT ---
                
                // 1. Est-ce que je suis le Président (Super Admin) ?
                const amISuperAdmin = currentUser?.roles?.includes('ROLE_SUPER_ADMIN');
                
                // 2. Est-ce que la personne dans la liste est un Président ?
                const isTargetSuperAdmin = targetRole === 'ROLE_SUPER_ADMIN';

                // 3. Règle : On peut modifier si (Je suis Super Admin) OU (La cible n'est pas Super Admin)
                // En clair : Un Admin 2 peut modifier tout le monde SAUF le Président.
                const canIEdit = amISuperAdmin || !isTargetSuperAdmin;

                // 4. On empêche aussi de se modifier soi-même (pour ne pas s'enlever ses propres droits par erreur)
                const isSelf = currentUser?.email === u.email;

                return (
                  <tr key={u.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${isTargetSuperAdmin ? 'bg-primary text-white' : 'bg-primary-light text-primary'}`}>
                          {u.firstName[0]}{u.lastName[0]}
                        </div>
                        <span className="font-bold text-dark">{u.firstName} {u.lastName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">{u.email}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${
                        targetRole === 'ROLE_SUPER_ADMIN' ? 'bg-dark text-primary border border-primary' : 
                        targetRole === 'ROLE_ADMIN' ? 'bg-red-50 text-primary' : 'bg-blue-50 text-blue-700'
                      }`}>
                        {targetRole === 'ROLE_SUPER_ADMIN' ? 'PRÉSIDENT (ADMIN 1)' : 
                         targetRole === 'ROLE_ADMIN' ? 'BRAS DROIT (ADMIN 2)' : 'BUREAU (USER)'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {isTargetSuperAdmin && !amISuperAdmin ? (
                        // Si l'utilisateur est Président et que je ne le suis pas, j'affiche un cadenas
                        <div className="flex items-center gap-2 text-gray-400 text-xs italic">
                          <Lock size={14} /> Accès restreint
                        </div>
                      ) : (
                        <select 
                          className="text-xs border rounded-lg p-2 outline-none focus:ring-2 focus:ring-primary bg-gray-50 disabled:opacity-50"
                          value={targetRole}
                          disabled={isSelf || !canIEdit} // On bloque si c'est soi-même ou si on n'a pas le rang
                          onChange={(e) => handleChangeRole(u.id, e.target.value)}
                        >
                          <option value="ROLE_USER">Membre Bureau</option>
                          <option value="ROLE_ADMIN">Admin 2 (Bras droit)</option>
                          
                          {/* Seul le Président peut voir l'option pour créer un autre Président */}
                          {amISuperAdmin && (
                            <option value="ROLE_SUPER_ADMIN">Admin 1 (Président)</option>
                          )}
                        </select>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};