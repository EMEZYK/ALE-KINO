import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, take, tap } from 'rxjs';
import { LocalStorageService } from '../../../shared/local-storage/local-storage.service';
import { SeatTicket, Seat } from '../hall/hall.interface';
import { HttpClient } from '@angular/common/http';
import { Order } from './order.interface';

@Injectable({
  providedIn: 'root',
})
export class SeatTicketsStateService {
  private localStorageService = inject(LocalStorageService);
  private http = inject(HttpClient);

  private seatTickets$$ = new BehaviorSubject<SeatTicket[]>([]);

  get seatTickets$() {
    return this.seatTickets$$.asObservable();
  }

  constructor() {
    this.localStorageService.saveData('seatTicketPairs', JSON.stringify([]));

    const storedSeatTicketPairs =
      this.localStorageService.getData('seatTicketPairs');
    if (storedSeatTicketPairs !== '') {
      this.setOrderItems(JSON.parse(storedSeatTicketPairs));
    }
  }

  removeUnrelatedReservations(showingId: number) {
    this.seatTickets$
      .pipe(
        take(1),
        tap((res: SeatTicket[]) => {
          const result = res.filter((el) => el.showingId === showingId);
          this.seatTickets$$.next(result);
          return result;
        })
      )
      .subscribe();
  }

  setOrderItems(pair: SeatTicket[], shouldStore = true) {
    if (shouldStore) {
      this.localStorageService.saveData(
        'seatTicketPairs',
        JSON.stringify(pair)
      );
      this.seatTickets$$.next(pair);
    }
  }

  clickChosenSeat(seat: Seat, showingId: number) {
    const currentOrderItems = this.seatTickets$$.getValue();

    const indexOfSeat = currentOrderItems.findIndex(
      (el) => el.seat.column === seat.column && el.seat.row === seat.row
    );

    if (indexOfSeat === -1) {
      this.seatTickets$$.next([
        ...this.seatTickets$$.value,
        { seat, ticket: null, showingId },
      ]);
    } else {
      currentOrderItems.splice(indexOfSeat, 1);
      this.deleteChosenSeatAndTicket({ seat, ticket: null, showingId });
      this.seatTickets$$.next(currentOrderItems);
    }
  }

  checkIfSeatIsAvailable(
    showingId: number,
    seatId: number
  ): Observable<boolean> {
    return this.http.get<Order[]>(`orders?showingId=${showingId}`).pipe(
      map((orders) => {
        const occupiedSeats = orders.flatMap(({ orderItems }) =>
          orderItems.map(({ seatId }) => seatId)
        );

        return occupiedSeats.some(
          (occupiedSeatId) => occupiedSeatId === seatId
        );
      })
    );
  }

  getOccupiedSeats(showingId: number) {
    return this.http.get<Order[]>(`orders?showingId=${showingId}`).pipe(
      map((orders) => {
        return orders.flatMap(({ orderItems }) =>
          orderItems.map(({ seatId }) => seatId)
        );
      })
    );
  }

  checkIfSeatIsChosen(seat: Seat) {
    const currentOrderItems = this.seatTickets$$.getValue();

    return currentOrderItems.some((el) => el.seat.id === seat.id);
  }

  selectTicket(seat: SeatTicket) {
    const currentOrderItems = this.seatTickets$$.getValue();

    const updated = currentOrderItems.map((el) => {
      if (el.seat === seat.seat) {
        el.seat === seat.seat;
      }
      return el;
    });
    this.seatTickets$$.next(updated);
  }

  deleteChosenSeatAndTicket(orderItem: SeatTicket) {
    const currentOrderItems = this.seatTickets$$.getValue();

    currentOrderItems.forEach((item, index) => {
      if (item === orderItem) {
        currentOrderItems.splice(index, 1);
      }
    });

    this.seatTickets$$.next(currentOrderItems);
    this.localStorageService.saveData(
      'seatTicketPairs',
      JSON.stringify(currentOrderItems)
    );
  }

  sumTicketsValues() {
    return this.seatTickets$.pipe(
      map((pair) => {
        return pair
          .map((pair) => pair.ticket.price)
          .reduce((acc, value) => acc + value, 0);
      })
    );
  }

  clearSeatSelection() {
    this.seatTickets$$.next([]);
    this.localStorageService.saveData('seatTicketPairs', JSON.stringify([]));
  }
}
