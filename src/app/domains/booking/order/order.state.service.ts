import { inject, Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, switchMap, tap } from 'rxjs';
import { HallStateService } from '../hall';
import { ChoosenMovieShowingStateService } from '../../movies/choosen-movie.state.service';
import { LocalStorageService } from '../../../shared/storage/local-storage.service';
import { Ticket } from '../tickets/ticket.interface';
import { OrderItem, Seat, UnavailableSeats } from '../hall/hall.interface';

@Injectable({
  providedIn: 'root',
})
export class OrderStateService {
  private hallService = inject(HallStateService);
  private choosenMovieShowingService = inject(ChoosenMovieShowingStateService);
  private localStorageService = inject(LocalStorageService);

  private orderItems$$ = new BehaviorSubject<OrderItem[]>([]);

  get orderItems$() {
    return this.orderItems$$.asObservable();
  }

  unavailableSeats: UnavailableSeats[];

  constructor() {
    const storedSeatTicketPairs =
      this.localStorageService.getData('seatTicketPairs');

    if (storedSeatTicketPairs !== '') {
      this.setOrderItems(JSON.parse(storedSeatTicketPairs));
    }

    this.choosenMovieShowingService.chosenMovieShowing$
      .pipe(
        tap((chosenShowing) => {
          this.unavailableSeats = [
            ...chosenShowing.bookedSeats,
            ...chosenShowing.paidSeats,
          ].map((unavailableSeat) => {
            return {
              column: unavailableSeat.column,
              row: unavailableSeat.row,
            };
          });
        }),
        switchMap((chosenShowing) => {
          return this.hallService.fetchSeats(chosenShowing.hallId);
        })
      )
      .subscribe();
  }

  checkIfSeatIsAvailable(seat: Seat): boolean {
    return this.unavailableSeats.some(
      (el) => el.column === seat.column && el.row === seat.row
    );
  }

  setOrderItems(pair: OrderItem[], shouldStore = true) {
    if (shouldStore) {
      this,
        this.localStorageService.saveData(
          'seatTicketPairs',
          JSON.stringify(pair)
        );
      this.orderItems$$.next(pair);
    }
  }

  clickChosenSeat(seat: Seat) {
    const currentOrderItems = this.orderItems$$.getValue();

    const indexOfSeat = currentOrderItems.findIndex(
      (el) => el.seat.column === seat.column && el.seat.row === seat.row
    );

    if (indexOfSeat === -1) {
      this.orderItems$$.next([
        ...this.orderItems$$.value,
        { seat, ticket: null },
      ]);
    } else {
      currentOrderItems.splice(indexOfSeat, 1);
      this.orderItems$$.next(currentOrderItems);
    }
  }

  checkIfSeatIsChosen(seat: Seat) {
    const currentOrderItems = this.orderItems$$.getValue();

    const seatchosen = currentOrderItems.some((el) => {
      return el.seat === seat;
    });

    return seatchosen;
  }

  selectTicket(seat: OrderItem, ticket: Ticket) {
    const currentOrderItems = this.orderItems$$.getValue();
    const foundSeat = currentOrderItems.find((el) => {
      return el.seat === seat.seat;
    });
    foundSeat.ticket = ticket;
  }

  deleteChosenSeatAndTicket(orderItem: OrderItem) {
    const currentOrderItems = this.orderItems$$.getValue();

    currentOrderItems.forEach((item, index) => {
      if (item === orderItem) {
        currentOrderItems.splice(index, 1);
      }
    });

    this.orderItems$$.next(currentOrderItems);
    this.localStorageService.saveData(
      'seatTicketPairs',
      JSON.stringify(currentOrderItems)
    );
  }
}
