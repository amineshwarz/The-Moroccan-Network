
import axios from 'axios';
import { useState } from 'react';

//------------ 1. CONFIGURATION DE L'INSTANCE : On crée UNE seule instance configurée pour tout le projet.
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,   // http://localhost:5173 (.env.local)
    headers: {  
        // 'Content-Type': 'application/json',    
        'Accept': 'application/json',        // "je t'envoie du JSON et j'attends du JSON en retour"
    }
});

//------------ 2. L'INTERCEPTEUR DE REQUÊTE (Avant l'envoi vers symfony)

api.interceptors.request.use(
    (config) => {
        // On récupère le jeton stocké dans le localStorage (AuthContext l'a mis là via localStorage.setItem)
        const token = localStorage.getItem('jwt_token');
        
        // Si le jeton existe, on l'ajoute dans l'en-tête "Authorization"
        if (token) {
            config.headers.Authorization = `Bearer ${token}`; // C'est le format standard 
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

//------------ 3. L'INTERCEPTEUR DE RÉPONSE (À la réception)
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

//------------ 4. LE HOOK
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
            return response.data; // On retourne directement response.data (pas tout l'objet Axios)

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

    // Usage dans un composant :
    // const { request, loading, error } = useAxios()
    // const data = await request('GET', '/api/events')
};