import { Member, Event, NewsItem } from './types';

export const MOCK_MEMBERS: Member[] = [
  { id: '1', firstName: 'Alice', lastName: 'Dubois', email: 'alice@example.com', status: 'active', joinDate: '2023-09-15', plan: 'Standard' },
  { id: '2', firstName: 'Jean', lastName: 'Martin', email: 'jean@example.com', status: 'active', joinDate: '2023-10-02', plan: 'Bienfaiteur' },
  { id: '3', firstName: 'Claire', lastName: 'Petit', email: 'claire@example.com', status: 'expired', joinDate: '2022-05-20', plan: 'Réduit' },
  { id: '4', firstName: 'Paul', lastName: 'Leroy', email: 'paul@example.com', status: 'pending', joinDate: '2024-01-10', plan: 'Standard' },
  { id: '5', firstName: 'Sophie', lastName: 'Moreau', email: 'sophie@example.com', status: 'active', joinDate: '2023-11-28', plan: 'Standard' },
];

export const MOCK_EVENTS: Event[] = [
  { id: '1', title: 'Assemblée Générale', date: '2024-06-15', location: 'Salle des Fêtes', ticketsSold: 45, capacity: 100, description: 'Bilan annuel et vote du bureau.', image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80&w=800' },
  { id: '2', title: 'Atelier Zéro Déchet', date: '2024-04-10', location: 'Maison des Associations', ticketsSold: 12, capacity: 20, description: 'Apprenez à réduire vos déchets au quotidien.', image: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&q=80&w=800' },
  { id: '3', title: 'Concert de Soutien', date: '2024-05-20', location: 'Le Transbordeur', ticketsSold: 150, capacity: 300, description: 'Soirée festive pour lever des fonds.', image: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&q=80&w=800' },
];

export const MOCK_NEWS: NewsItem[] = [
  { id: '1', title: 'Succès de la collecte alimentaire', date: '2024-03-01', summary: 'Merci à tous les bénévoles pour ce weekend exceptionnel.', category: 'Action' },
  { id: '2', title: 'Nouveaux horaires de permanence', date: '2024-02-15', summary: 'Le bureau sera désormais ouvert le samedi matin.', category: 'Info' },
  { id: '3', title: 'Retour sur notre voyage annuel', date: '2024-01-20', summary: 'Découvrez les photos de notre excursion dans les Alpes.', category: 'Vie de l\'asso' },
];