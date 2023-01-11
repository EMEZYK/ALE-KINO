import {Ticket} from '../tickets/ticket.interface';
import { User } from '../../users/user.interface';

export interface Order {
  id: number;
  tickets: Ticket[];
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: number;
  user: User;
  status: string
  qrCode:  string
  cuponCode: string
}

