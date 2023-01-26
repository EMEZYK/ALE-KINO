import { User } from '../users/user.interface';

export interface AuthResponse {
  accessToken: string;
  user: User;
}
