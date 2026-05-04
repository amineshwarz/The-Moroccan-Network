// Un membre du staff (table user en BDD)
export interface Member {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  status: 'active' | 'pending' | 'expired';
  joinDate: string;
  plan: string;
}

// Un événement
export interface Event {
  id: string;
  title: string;
  date: string;
  location: string;
  ticketsSold: number;
  capacity: number;
  description: string;
  image?: string; // ← optionnel (le ? = peut être absent)
}

// Un article de news
export interface NewsItem {
  id: string;
  title: string;
  date: string;
  summary: string;
  category: string;
}

// Un lien de navigation (navbar, sidebar)
export interface NavItem {
  label: string;
  path: string;
  icon?: React.ReactNode; // ← optionnel, icône JSX
}

// a rajouter d'autre interface pour centraliser tout les types utilisés dans l'app 