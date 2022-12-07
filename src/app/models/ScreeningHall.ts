export interface ScreeningHall {
  id: number;
  name: string;
  number: number;
  rows: number;
  columns: number;
  seats: Seat[];
}

export interface Seat {
  id: number;
  row: string;
  column: number;
  vip: boolean;
}
