import { inject, Injectable } from '@angular/core';
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

  private rows$$ = new BehaviorSubject<{
    [key: string]: { [key: number]: Seat };
  }>({});

  get orderItems$() {
    return this.orderItems$$.asObservable();
  }

  get rows$() {
    return this.rows$$.asObservable();
  }

  unavailableSeats: UnavailableSeats[];
  rows: { [key: string]: { [key: number]: Seat } };

  constructor() {
    const storedSeatTicketPairs =
      this.localStorageService.getData('seatTicketPairs');

    if (storedSeatTicketPairs !== '')
      this.setOrderItems(JSON.parse(storedSeatTicketPairs));

    this.choosenMovieShowingService.chosenMovieShowing$
      .pipe(
        tap((chosenShowing) => {
          this.unavailableSeats = [
            ...chosenShowing.bookedSeats,
            ...chosenShowing.paidSeats,
          ].map((unavailableSeat) => {
            // console.log(unavailableSeat);
            return {
              column: unavailableSeat.column,
              row: unavailableSeat.row,
            };
          });
        }),
        switchMap((chosenShowing) => {
          return this.hallService.fetchSeats(chosenShowing.hallId);
        }),

        tap((rows) => {
          console.log(rows);
          this.rows$$.next(rows);
        })
      )
      .subscribe();
  }

  setOrderItems(pair: OrderItem[], shouldStore = true) {
    if (shouldStore) {
      localStorage.setItem('seatTicketPairs', JSON.stringify(pair));
      this.orderItems$$.next(pair);
    }
  }

  fetchOrderedSeats(hallId: number) {
    return this.hallService.fetchSeats(hallId);
  }

  checkIfSeatIsAvailable(seat: Seat): boolean {
    return this.unavailableSeats.some(
      (el) => el.column === seat.column && el.row === seat.row
    );
  }

  clickChosenSeat(seat: Seat, chosenSeatsAndTickets: OrderItem[]) {
    const indexOfSeat = chosenSeatsAndTickets.findIndex(
      (el) => el.seat.column === seat.column && el.seat.row === seat.row
    );
    if (indexOfSeat === -1) {
      chosenSeatsAndTickets.push({
        seat: seat,
        ticket: null,
      });
    } else {
      chosenSeatsAndTickets.splice(indexOfSeat, 1);
    }
  }

  checkIfSeatIsChosen(seat: Seat, chosenSeatsAndTickets: OrderItem[]) {
    return chosenSeatsAndTickets.some((el) => el.seat === seat);
  }

  selectTicket(
    seat: OrderItem,
    chosenSeatsAndTickets: OrderItem[],
    ticket: Ticket
  ) {
    const foundSeat = chosenSeatsAndTickets.find((el) => {
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
  }
}
