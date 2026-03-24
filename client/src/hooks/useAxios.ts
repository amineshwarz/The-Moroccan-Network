// src/hooks/useAxios.ts
import axios from 'axios';
import { useState } from 'react';

// 1. CONFIGURATION DE L'INSTANCE
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL, // http://localhost:5173
    headers: {
        // 'Content-Type': 'application/json',
        'Accept': 'application/json',
    }
    // Note : withCredentials: true n'est plus indispensable avec le JWT, 
    // mais on peut le laisser si on a d'autres cookies à gérer.
});

// 2. L'INTERCEPTEUR DE REQUÊTE (Avant l'envoi)
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

// 3. L'INTERCEPTEUR DE RÉPONSE (À la réception)
// Gère automatiquement les erreurs d'authentification (Token expiré)
api.interceptors.response.use(
    (response) => {
        // Si la réponse est un succès (200, 201, etc.), on la laisse passer telle quelle
        return response;
    },
    (error) => {
        // On récupère le message d'erreur envoyé par Symfony
        const errorMessage = error.response?.data?.message;
        const status = error.response?.status;

        // Si le serveur répond 401 (Non autorisé) ou que le message indique un Token expiré
        if (status === 401 || errorMessage === "Expired JWT Token") {
            console.warn("Session expirée ou jeton invalide. Nettoyage...");

            // 1. On supprime les données de connexion du navigateur
            localStorage.removeItem('jwt_token');
            localStorage.removeItem('user');

            // 2. On force la redirection vers la page de login
            // Note: On utilise window.location car useNavigate ne fonctionne pas hors d'un composant
            window.location.href = '/admin';
        }

        // On renvoie l'erreur pour qu'elle puisse quand même être traitée par le hook
        return Promise.reject(error);
    }
);

// 4. LE HOOK
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