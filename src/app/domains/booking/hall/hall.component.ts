import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  inject,
} from '@angular/core';
import { AsyncPipe, NgIf, NgFor, KeyValuePipe, NgClass } from '@angular/common';
import { RouterModule } from '@angular/router';

import { Observable, switchMap } from 'rxjs';
import { faArrowDown, faTrash } from '@fortawesome/free-solid-svg-icons';
import { LocalStorageService } from 'src/app/shared/local-storage';
import { TicketType } from '../tickets';
import { ChoosenMovieShowing } from '../../movies/movie.interface';
import { OrderItem, Seat } from './hall.interface';
import { OrderItemsStateService } from '../order';
import { TicketTypesStateService } from '../tickets';
import { ChoosenMovieShowingStateService } from '../../movies';
import { HallApiService } from './hall.api.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

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
  ],
  templateUrl: './hall.component.html',
  styleUrls: ['./hall.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [HallApiService],
})
export class HallComponent implements OnInit {
  private orderService = inject(OrderItemsStateService);
  private localStorageService = inject(LocalStorageService);
  private ticketsService = inject(TicketTypesStateService);
  private chosenShowingService = inject(ChoosenMovieShowingStateService);
  private hallService = inject(HallApiService);

  tickets$: Observable<TicketType[]>;
  rows$: Observable<{ [key: string]: { [key: number]: Seat } }>;
  chosenShowing$: Observable<ChoosenMovieShowing>;
  orderItems$: Observable<OrderItem[]> = this.orderService.orderItems$;
  seat: Seat;
  arrowIcon = faArrowDown;
  trashIcon = faTrash;

  ngOnInit(): void {
    this.tickets$ = this.ticketsService.ticketTypes$;
    this.chosenShowing$ = this.chosenShowingService.chosenMovieShowing$;

    this.rows$ = this.chosenShowing$.pipe(
      switchMap((chosenShowing) => {
        return this.hallService.fetchSeats(chosenShowing.hallId);
      })
    );
  }

  checkIfSeatIsAvailable(seat: Seat): boolean {
    return this.orderService.checkIfSeatIsAvailable(seat);
  }

  clickChosenSeat(seat: Seat, showingId: number) {
    this.orderService.clickChosenSeat(seat, showingId);
  }

  checkIfSeatIsChosen(seat: Seat): boolean {
    return this.orderService.checkIfSeatIsChosen(seat);
  }

  selectTicket(orderItem: OrderItem): void {
    this.orderService.selectTicket(orderItem);
  }

  deleteChosenTicket(chosenItem: OrderItem) {
    this.orderService.deleteChosenSeatAndTicket(chosenItem);
  }

  saveChosenSeatsAndTicketsInLocalStorage(orderItems: OrderItem[]) {
    this.localStorageService.saveData(
      'seatTicketPairs',
      JSON.stringify(orderItems)
    );
  }
}
