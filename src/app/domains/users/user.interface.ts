export interface Guest {
  id: number;
  firstName: string;
  lastName: string;
  phoneNumber?: number;
  email: string;
}

export interface User extends Guest {
  password: string;
  role: 'user' | 'admin';
  orders?: [];
  moviesToWatch?: [];
  ratedMovies?: [];
  active?: boolean;
}
