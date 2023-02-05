export interface Order {
  userId: number;
  orderItems: {
    seatId: number;
    ticketId: number;
  }[];
  showingId: number;
  status: 'reserved' | 'paid';
}
