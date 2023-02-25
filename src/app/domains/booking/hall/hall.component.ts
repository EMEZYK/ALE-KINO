import { Component, OnInit, inject } from '@angular/core';
import { AsyncPipe, NgIf, NgFor, KeyValuePipe, NgClass } from '@angular/common';
import { RouterModule } from '@angular/router';

import { map, Observable, switchMap, tap } from 'rxjs';
import { faArrowDown, faTrash } from '@fortawesome/free-solid-svg-icons';
import { LocalStorageService } from 'src/app/shared/local-storage';
import { TicketType } from '../tickets';
import { ChoosenMovieShowing, Showing } from '../../movies/movie.interface';
import { SeatTicket, Seat } from './hall.interface';
import { SeatTicketsStateService } from '../order';
import { TicketTypesStateService } from '../tickets';
import { ChoosenMovieShowingStateService } from '../../movies';
import { HallApiService } from './hall.api.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { OrderStateService } from '../order/order.service';
import { Order } from '../order';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-seats-page',
  standalone: true,
  imports: [
    AsyncPipe,
    NgIf,
    NgFor,
    KeyValuePipe,
    FontAwesomeModule,
    NgClass,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    JsonPipe,
  ],
  templateUrl: './hall.component.html',
  styleUrls: ['./hall.component.css'],
  providers: [HallApiService],
})
export class HallComponent implements OnInit {
  private seatTicketService = inject(SeatTicketsStateService);
  private orderService = inject(OrderStateService);
  private localStorageService = inject(LocalStorageService);
  private ticketsService = inject(TicketTypesStateService);
  private chosenShowingService = inject(ChoosenMovieShowingStateService);
  private hallService = inject(HallApiService);

  tickets$: Observable<TicketType[]>;
  rows$: Observable<{ [key: string]: { [key: number]: Seat } }>;
  chosenShowing$: Observable<ChoosenMovieShowing>;
  orderItems$: Observable<SeatTicket[]> = this.seatTicketService.seatTickets$;
  arrowIcon = faArrowDown;
  trashIcon = faTrash;
  // showing: Showing;

  ngOnInit(): void {
    this.tickets$ = this.ticketsService.ticketTypes$;
    this.chosenShowing$ = this.chosenShowingService.chosenMovieShowing$;

    this.rows$ = this.chosenShowing$.pipe(
      // tap((showing) => (this.showing = showing)),
      switchMap((chosenShowing) => {
        return this.hallService.fetchHallSeats(chosenShowing.hallId);
      })
    );
  }

  checkIfSeatIsAvailable(seat: Seat): boolean {
    return this.seatTicketService.checkIfSeatIsAvailable(seat);
  }

  clickChosenSeat(seat: Seat, showingId: number) {
    this.orderService
      .addOrder({
        orderItems: [
          {
            seatId: seat.id,
          },
        ],
        showingId: showingId,
        status: 'reserved',
      })
      .subscribe();

    this.seatTicketService.clickChosenSeat(seat, showingId);
  }

  checkIfSeatIsChosen(seat: Seat): boolean {
    return this.seatTicketService.checkIfSeatIsChosen(seat);
  }

  selectTicket(orderItem: SeatTicket): void {
    this.seatTicketService.selectTicket(orderItem);
  }

  deleteChosenTicket(chosenItem: SeatTicket) {
    this.seatTicketService.deleteChosenSeatAndTicket(chosenItem);
  }

  saveChosenSeatsAndTicketsInLocalStorage(orderItems: SeatTicket[]) {
    this.localStorageService.saveData(
      'seatTicketPairs',
      JSON.stringify(orderItems)
    );
  }
}
