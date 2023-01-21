import { Injectable } from '@angular/core';
import { BehaviorSubject, switchMap, tap } from 'rxjs';
import { HallStateService } from '../hall';
import { ChoosenMovieStateService } from '../../movies/choosen-movie.state.service';
import { LocalStorageService } from '../../../shared/storage/local-storage.service';
import { TicketsStateService } from '../tickets/tickets.state.service';
import { Ticket } from '../tickets/ticket.interface';
import { ChoosenMovieShowing } from '../../movies/movie.interface';
import {
  ChosenSeatsAndTickets,
  Seat,
  UnavailableSeats,
} from '../hall/hall.interface';

@Injectable({
  providedIn: 'root',
})
export class OrderStateService {
  unavailableSeats: UnavailableSeats[];

  rows: { [key: string]: { [key: number]: Seat } };
  listOfTickets: Ticket[];

  private orderItems$$ = new BehaviorSubject<ChosenSeatsAndTickets[]>([]);
  private tickets$$ = new BehaviorSubject<Ticket[]>([]);
  private rows$$ = new BehaviorSubject<{
    [key: string]: { [key: number]: Seat };
  }>({});
  private chosenShowing$$ = new BehaviorSubject<ChoosenMovieShowing>(null);

  get orderItems$() {
    return this.orderItems$$.asObservable();
  }

  setOrderItems(orderItems: ChosenSeatsAndTickets[]) {
    this.orderItems$$.next(orderItems);
  }

  get tickets$() {
    return this.tickets$$.asObservable();
  }

  get rows$() {
    return this.rows$$.asObservable();
  }

  get chosenShowing$() {
    return this.chosenShowing$$.asObservable();
  }

  constructor(
    private ticketsService: TicketsStateService,
    private seatsService: HallStateService,
    private choosenMovieService: ChoosenMovieStateService,
    private localStoreService: LocalStorageService
  ) {
    const storedSeatTicketPairs =
      this.localStoreService.getData('seatTicketPairs');

    if (storedSeatTicketPairs !== '')
      this.setTicketPairs(JSON.parse(storedSeatTicketPairs));

    this.choosenMovieService.chosenMovieShowing$
      .pipe(
        tap((chosenShowing) => {
          this.chosenShowing$$.next(chosenShowing);

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
          return this.seatsService.fetchSeats(chosenShowing.hallId);
        }),

        tap((rows) => {
          this.rows$$.next(rows);
        })
      )
      .subscribe();

    this.ticketsService
      .getAllTickets()
      .subscribe((tickets) => this.tickets$$.next(tickets));

    this.tickets$$
      .pipe(
        tap((listOfTickets) => {
          this.listOfTickets = listOfTickets;
        })
      )
      .subscribe();
  }

  setTicketPairs(pair: ChosenSeatsAndTickets[], shouldStore = true) {
    if (shouldStore) {
      localStorage.setItem('seatTicketPairs', JSON.stringify(pair));
      this.orderItems$$.next(pair);
    }
  }

  fetchOrderedSeats(hallId: number) {
    return this.seatsService.fetchSeats(hallId);
  }

  checkIfSeatIsAvailable(seat: Seat): boolean {
    return this.unavailableSeats.some(
      (el) => el.column === seat.column && el.row === seat.row
    );
  }

  clickChosenSeat(seat: Seat, chosenSeatsAndTickets: ChosenSeatsAndTickets[]) {
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

  checkIfSeatIsChosen(
    seat: Seat,
    chosenSeatsAndTickets: ChosenSeatsAndTickets[]
  ) {
    return chosenSeatsAndTickets.some((el) => el.seat === seat);
  }

  selectTicket(
    seat: ChosenSeatsAndTickets,
    chosenSeatsAndTickets: ChosenSeatsAndTickets[],
    ticket: Ticket
  ) {
    const foundSeat = chosenSeatsAndTickets.find((el) => {
      return el.seat === seat.seat;
    });
    foundSeat.ticket = ticket;
  }

  deleteChosenTicket(
    ticket: ChosenSeatsAndTickets,
    chosenSeatsAndTickets: ChosenSeatsAndTickets[]
  ) {
    const indexOfTicket = chosenSeatsAndTickets.indexOf(ticket);
    chosenSeatsAndTickets.splice(indexOfTicket, 1);
  }
}
