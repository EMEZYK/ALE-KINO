import {
  Component,
  OnInit,
  inject,
  ChangeDetectionStrategy,
} from '@angular/core';
import {
  AsyncPipe,
  NgIf,
  NgFor,
  KeyValuePipe,
  NgClass,
  JsonPipe,
} from '@angular/common';
import { RouterModule } from '@angular/router';
import { combineLatest, Observable, switchMap, tap } from 'rxjs';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { TicketType } from '../tickets';
import { ChoosenMovieShowing, Showing } from '../../movies/movie.interface';
import { SeatTicket, Seat } from './hall.interface';
import { Order, SeatTicketsStateService } from '../order';
import { TicketsStateService } from '../tickets';
import { ChoosenMovieShowingStateService } from '../../movies';
import { SeatsApiService } from '../order/seats.api.service';
import { OrderStateService } from '../order/order.state.service';
import { ToastFacadeService } from 'src/app/shared/facades/toast.facade.service';
import { UserStateService } from 'src/app/core/user.state.service';
import { User } from '../../users/user.interface';
import { SelectedSeatsTicketsComponent } from '../order/selected-seats-tickets/selected-seats-tickets.component';
import { LocalStorageService } from 'src/app/shared/local-storage';

export interface OrderItem {
  seatId: number;
  ticketId?: number;
}
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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HallComponent implements OnInit {
  private seatTicketService = inject(SeatTicketsStateService);
  private orderService = inject(OrderStateService);
  private tickets$ = inject(TicketsStateService).ticketTypes$;
  private chosenShowingService = inject(ChoosenMovieShowingStateService);
  private hallService = inject(SeatsApiService);
  private toastService = inject(ToastFacadeService);
  private localStorageService = inject(LocalStorageService);

  clickCount = 0;
  maxClickCount = 10;
  rows$: Observable<{ [key: string]: { [key: number]: Seat } }>;

  seatTickets$: Observable<SeatTicket[]> = this.seatTicketService.seatTickets$;
  order$: Observable<Order> = this.orderService.order$;
  chosenShowing$: Observable<ChoosenMovieShowing> =
    this.chosenShowingService.chosenMovieShowing$;

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
    this.occupiedSeatIds$ = this.chosenShowing$.pipe(
      switchMap((showing: Showing) => {
        return this.seatTicketService.getOccupiedSeats(showing.id);
      })
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

  clickChosenSeat(seat: Seat, showingId: number, orderItems: OrderItem[]) {
    this.clickCount++;

    if (orderItems.find((e) => e.seatId === seat.id)) {
      this.deleteChosenTicket({ seat: seat, ticket: null, showingId: null });
      return;
    }

    if (this.clickCount > this.maxClickCount) {
      this.toastService.showError('Max możesz wybrać 10 biletów', 'Błąd');
      return;
    }

    if (orderItems.length === 0) {
      combineLatest([
        this.tickets$,
        this.orderService.addOrder({
          userId: this.user ? this.user.id : null,
          orderItems: [
            {
              seatId: seat.id,
              ticketId: 1,
            },
          ],
          showingId: showingId,
          status: 'reserved',
        }),
      ])
        .pipe(
          tap(([tickets, order]) => {
            const ticketType: TicketType = tickets.find(
              (e) => e.id == order.orderItems[0].ticketId
            );
            return this.seatTicketService.clickChosenSeat(
              seat,
              showingId,
              ticketType
            );
          })
        )
        .subscribe();
    } else {
      const oldItems = orderItems.map((orderItem: OrderItem) => {
        return {
          seatId: orderItem.seatId,
          ticketId: orderItem.ticketId,
        };
      });
      const newItem = { seatId: seat.id, ticketId: 1 };

      combineLatest([
        this.tickets$,
        this.orderService.updateOrder({
          userId: this.user ? this.user.id : null,
          orderItems: [...oldItems, newItem],
          showingId: showingId,
          status: 'reserved',
        }),
      ])
        .pipe(
          tap(([tickets]) => {
            const ticketType: TicketType = tickets.find(
              (e) => e.id == newItem.ticketId
            );
            return this.seatTicketService.clickChosenSeat(
              seat,
              showingId,
              ticketType
            );
          })
        )
        .subscribe();
    }

    this.saveChosenSeatsAndTicketsInLocalStorage(orderItems);
  }
  checkIfSeatIsChosen(seat: Seat) {
    return this.orderService.checkIfSeatIsChosen(seat);
  }

  selectTicket(orderItem: SeatTicket): void {
    this.seatTicketService.selectTicket(orderItem);
  }

  deleteChosenTicket(chosenItem: SeatTicket) {
    this.orderService.deleteOrderItem(chosenItem);
  }

  saveChosenSeatsAndTicketsInLocalStorage(orderItems: OrderItem[]) {
    this.localStorageService.saveData('order', JSON.stringify(orderItems));
  }
}
