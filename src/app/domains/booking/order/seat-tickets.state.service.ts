import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, map, tap } from 'rxjs';
import { ChoosenMovieShowingStateService } from '../../movies/choosen-movie.state.service';
import { LocalStorageService } from '../../../shared/local-storage/local-storage.service';
import { SeatTicket, Seat, UnavailableSeats } from '../hall/hall.interface';

@Injectable({
  providedIn: 'root',
})
export class SeatTicketsStateService {
  private choosenMovieShowingService = inject(ChoosenMovieShowingStateService);
  private localStorageService = inject(LocalStorageService);

  private seatTickets$$ = new BehaviorSubject<SeatTicket[]>([]);

  get seatTickets$() {
    return this.seatTickets$$.asObservable();
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
        })
      )
      .subscribe();
  }

  checkIfSeatIsAvailable(seat: Seat): boolean {
    return this.unavailableSeats.some(
      (el) => el.column === seat.column && el.row === seat.row
    );
  }

  setOrderItems(pair: SeatTicket[], shouldStore = true) {
    if (shouldStore) {
      this,
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
      map((pair) =>
        pair
          .map((pair) => pair.ticket.price)
          .reduce((acc, value) => acc + value, 0)
      )
    );
  }
}
