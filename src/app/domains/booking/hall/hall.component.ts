import { Component, OnInit, inject } from '@angular/core';
import { AsyncPipe, NgIf, NgFor, KeyValuePipe, NgClass } from '@angular/common';
import { RouterModule } from '@angular/router';

import { Observable, switchMap, tap } from 'rxjs';
import { faArrowDown, faTrash } from '@fortawesome/free-solid-svg-icons';
import { LocalStorageService } from 'src/app/shared/local-storage';
import { TicketType } from '../tickets';
import { ChoosenMovieShowing, Showing } from '../../movies/movie.interface';
import { SeatTicket, Seat } from './hall.interface';
import { Order, SeatTicketsStateService } from '../order';
import { TicketsStateService } from '../tickets';
import { ChoosenMovieShowingStateService } from '../../movies';
import { SeatsApiService } from '../order/seats.api.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { OrderStateService } from '../order/order.service';
import { JsonPipe } from '@angular/common';
import { ToastFacadeService } from 'src/app/shared/facades/toast.facade.service';
import { UserStateService } from 'src/app/core/user.state.service';
import { User } from '../../users/user.interface';
import { SelectedSeatsTicketsComponent } from '../order/selected-seats-tickets/selected-seats-tickets.component';

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
    SelectedSeatsTicketsComponent,
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
  private toastService = inject(ToastFacadeService);

  chosenShowinId: number;
  clickCount = 0;
  maxClickCount = 10;
  tickets$: Observable<TicketType[]>;
  rows$: Observable<{ [key: string]: { [key: number]: Seat } }>;
  chosenShowing$: Observable<ChoosenMovieShowing>;
  orderItems$: Observable<SeatTicket[]> = this.seatTicketService.seatTickets$;
  occupiedSeatIds$: Observable<number[]>;
  user: User;

  user$ = inject(UserStateService).user$.subscribe((user) => {
    if (user) {
      this.user = user;
    } else {
      this.user = null;
    }
  });

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

  clickChosenSeat(seat: Seat, showingId: number, seatTickets: SeatTicket[]) {
    console.log(seatTickets);
    this.clickCount++;

    if (this.clickCount > this.maxClickCount) {
      this.toastService.showError('Max możesz wybrać 10 biletów', 'Błąd');
      return;
    }
    if (seatTickets.length === 0) {
      // console.log('add');
      this.orderService
        .addOrder({
          userId: this.user ? this.user.id : null,
          orderItems: [
            {
              seatId: seat.id,
            },
          ],
          showingId: showingId,
          status: 'reserved',
        })
        .subscribe();
    } else {
      // console.log('update');

      const oldItems = seatTickets.map((orderItem: SeatTicket) => {
        return {
          seatId: orderItem.seat.id,
          ticketId: orderItem.ticket.id,
        };
      });
      const newItem = { seatId: seat.id, ticketId: undefined };

      this.orderService
        .updateOrder({
          userId: this.user ? this.user.id : null,
          orderItems: [...oldItems, newItem],
          showingId: showingId,
          status: 'reserved',
        })
        .subscribe();
    }
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
