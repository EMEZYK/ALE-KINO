export interface Guest {
  id: number;
  firstName: string;
  lastName: string;
  phoneNumber?: number;
  email: string;
}

export interface User extends Guest {
  password?: string;
  role: 'user' | 'admin' | 'guest';
  orders?: [];
  moviesToWatch?: [];
  ratedMovies?: [];
  active?: boolean;
}

export type UserRole = 'admin' | 'user' | 'guest';
