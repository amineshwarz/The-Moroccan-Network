export interface Subscriber {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string; // Ajouté à la demande
    status: 'active' | 'pending' | 'expired';
    lastPaymentDate?: string;
  }
  
  export enum ViewState {
    HOME = 'HOME',
    SUBSCRIBE = 'SUBSCRIBE',
    DASHBOARD = 'DASHBOARD'
  }