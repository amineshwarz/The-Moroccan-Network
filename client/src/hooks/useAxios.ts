// src/hooks/useAxios.ts
import axios from 'axios';
import { useState } from 'react';

// 1. ON CRÉE L'INSTANCE AXIOS ICI (La configuration)
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL, // L'adresse de ton Symfony
    withCredentials: true,           // OBLIGATOIRE pour la session
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    }
});

// 2. ON CRÉE LE HOOK
export const useAxios = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const request = async (method: string, url: string, data: any = null) => {
        setLoading(true);
        setError(null);

        try {
            // On utilise "api" qu'on a configuré juste au-dessus
            const response = await api({
                method,
                url,
                data,
            });
            return response.data;
        } catch (err: any) {
            // Gestion de l'erreur
            const message = err.response?.data?.error || "Une erreur est survenue";
            setError(message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { request, loading, error };
};