import React, { useEffect, useState } from 'react';
import { useAxios } from '../../../hooks/useAxios';
import { Shield, User as UserIcon, CheckCircle, RefreshCw } from 'lucide-react';

export const AdminMembersPage: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const { request, loading, error } = useAxios();

  const fetchUsers = async () => {
    try {
      const data = await request('GET', '/api/admin/users/');
      setUsers(data);
    } catch (err) {}
  };

  useEffect(() => { fetchUsers(); }, []);

  // Fonction pour changer le rôle
  const handleChangeRole = async (userId: number, newRole: string) => {
    try {
      await request('PATCH', `/api/admin/users/${userId}/role`, { role: newRole });
      // On met à jour la liste localement pour éviter de tout recharger
      setUsers(users.map(u => u.id === userId ? { ...u, roles: [newRole] } : u));
    } catch (err) {
      alert("Erreur lors du changement de rôle");
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-dark italic">
        Gestion de l'<span className="text-primary">Équipe Staff</span>
      </h1>

      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-dark text-white text-xs uppercase tracking-widest">
            <tr>
              <th className="px-6 py-4">Membre</th>
              <th className="px-6 py-4">Email</th>
              <th className="px-6 py-4">Rôle Actuel</th>
              <th className="px-6 py-4">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary-light text-primary rounded-full flex items-center justify-center font-bold">
                      {u.firstName[0]}{u.lastName[0]}
                    </div>
                    <span className="font-bold text-dark">{u.firstName} {u.lastName}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">{u.email}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${u.roles.includes('ROLE_ADMIN') ? 'bg-red-100 text-primary' : 'bg-blue-100 text-blue-700'}`}>
                    {u.roles.includes('ROLE_ADMIN') ? 'ADMINISTRATEUR' : 'BUREAU (USER)'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <select 
                    className="text-xs border rounded-lg p-1 outline-none focus:ring-2 focus:ring-primary"
                    value={u.roles.includes('ROLE_ADMIN') ? 'ROLE_ADMIN' : 'ROLE_USER'}
                    onChange={(e) => handleChangeRole(u.id, e.target.value)}
                  >
                    <option value="ROLE_USER">Passer en Bureau</option>
                    <option value="ROLE_ADMIN">Passer en Admin</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};