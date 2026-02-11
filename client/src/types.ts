export interface Member {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  status: 'active' | 'pending' | 'expired';
  joinDate: string;
  plan: string;
}

export interface Event {
  id: string;
  title: string;
  date: string;
  location: string;
  ticketsSold: number;
  capacity: number;
  description: string;
  image?: string;
}

export interface NewsItem {
  id: string;
  title: string;
  date: string;
  summary: string;
  category: string;
}

export interface NavItem {
  label: string;
  path: string;
  icon?: React.ReactNode;
}