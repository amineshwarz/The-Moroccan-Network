/// <reference types="vite/client" />

/**
 * Ce fichier de déclaration TypeScript permet au compilateur de reconnaître 
 * les types spécifiques à Vite. 
 * 
 * Sans cette ligne, TypeScript ne connaît pas l'objet 'import.meta.env' 
 * et afficherait une erreur lors de l'utilisation de nos variables 
 * d'environnement comme VITE_API_URL.
 */