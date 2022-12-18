import {Ticket} from './Ticket';
import { User } from './User';
import { Seat } from './Hall';

export interface Order {
  id: number;
  tickets: Ticket[];
  firstName: string;
  lastName: string;
  emailAddress: string;
  phoneNumber: number;
  user: User;
  status: string
  qrCode:  string
  cuponCode: string
}

