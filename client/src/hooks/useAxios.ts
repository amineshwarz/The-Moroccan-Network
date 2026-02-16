// src/hooks/useAxios.ts
import axios from 'axios';
import { useState } from 'react';

// 1. CONFIGURATION DE L'INSTANCE
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL, // http://localhost:5173
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    }
    // Note : withCredentials: true n'est plus indispensable avec le JWT, 
    // mais on peut le laisser si on a d'autres cookies à gérer.
});

// 2. L'INTERCEPTEUR (La partie magique)
// Cette fonction s'exécute AUTOMATIQUEMENT juste avant que la requête ne parte vers Symfony.
api.interceptors.request.use(
    (config) => {
        // On récupère le jeton stocké dans le localStorage
        const token = localStorage.getItem('jwt_token');
        
        // Si le jeton existe, on l'ajoute dans l'en-tête "Authorization"
        // C'est le format standard : Bearer <votre_jeton>
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// 3. LE HOOK
export const useAxios = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const request = async (method: string, url: string, data: any = null) => {
        setLoading(true);
        setError(null);

        try {
            const response = await api({
                method,
                url,
                data,
            });
            return response.data;
        } catch (err: any) {
            // Si Symfony renvoie une erreur (ex: 401), on récupère le message
            const message = err.response?.data?.message || err.response?.data?.error || "Une erreur est survenue";
            setError(message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { request, loading, error };
};