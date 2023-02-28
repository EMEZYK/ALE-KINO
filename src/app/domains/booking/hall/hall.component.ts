import { Component, OnInit, inject } from '@angular/core';
import { AsyncPipe, NgIf, NgFor, KeyValuePipe, NgClass } from '@angular/common';
import { RouterModule } from '@angular/router';

import { Observable, switchMap } from 'rxjs';
import { faArrowDown, faTrash } from '@fortawesome/free-solid-svg-icons';
import { LocalStorageService } from 'src/app/shared/local-storage';
import { TicketType } from '../tickets';
import { ChoosenMovieShowing, Showing } from '../../movies/movie.interface';
import { SeatTicket, Seat } from './hall.interface';
import { SeatTicketsStateService } from '../order';
import { TicketsStateService } from '../tickets';
import { ChoosenMovieShowingStateService } from '../../movies';
import { SeatsApiService } from './seats.api.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { OrderStateService } from '../order/order.service';
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
  providers: [SeatsApiService],
})
export class HallComponent implements OnInit {
  private seatTicketService = inject(SeatTicketsStateService);
  private orderService = inject(OrderStateService);
  private localStorageService = inject(LocalStorageService);
  private ticketsService = inject(TicketsStateService);
  private chosenShowingService = inject(ChoosenMovieShowingStateService);
  private hallService = inject(SeatsApiService);
  chosenShowinId: number;
  clickCount = 0;
  maxClickCount = 10;

  tickets$: Observable<TicketType[]>;
  rows$: Observable<{ [key: string]: { [key: number]: Seat } }>;
  chosenShowing$: Observable<ChoosenMovieShowing>;
  orderItems$: Observable<SeatTicket[]> = this.seatTicketService.seatTickets$;
  occupiedSeatIds$: Observable<number[]>;
  arrowIcon = faArrowDown;
  trashIcon = faTrash;

  ngOnInit(): void {
    this.tickets$ = this.ticketsService.ticketTypes$;
    this.chosenShowing$ = this.chosenShowingService.chosenMovieShowing$;

    this.occupiedSeatIds$ = this.chosenShowing$.pipe(
      switchMap((showing: Showing) =>
        this.seatTicketService.getOccupiedSeats(showing.id)
      )
    );

    this.rows$ = this.chosenShowing$.pipe(
      switchMap((chosenShowing) => {
        return this.hallService.fetchHallSeats(chosenShowing.hallId);
      })
    );
  }

  checkIfSeatIsAvailable(
    showingId: number,
    seatId: number
  ): Observable<boolean> {
    return this.seatTicketService.checkIfSeatIsAvailable(showingId, seatId);
  }

  clickChosenSeat(seat: Seat, showingId: number) {
    this.clickCount++;

    if (this.clickCount > this.maxClickCount) {
      alert('za duzo razy');
      return;
    }
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

  checkIfSeatIsChosen(showingId: Seat) {
    return this.seatTicketService.checkIfSeatIsChosen(showingId);
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
