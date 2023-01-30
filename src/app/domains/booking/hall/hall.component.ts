import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from 'rxjs';
import { faArrowDown, faTrash } from '@fortawesome/free-solid-svg-icons';
import { LocalStorageService } from 'src/app/shared/storage';
import { Ticket } from '../tickets';
import { ChoosenMovieShowing } from '../../movies/movie.interface';
import { OrderItem, Seat } from './hall.interface';
import { OrderStateService } from '../order';
import { TicketsStateService } from '../tickets';
import { ChoosenMovieShowingStateService } from '../../movies';

@Component({
  selector: 'app-seats-page',
  templateUrl: './hall.component.html',
  styleUrls: ['./hall.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HallComponent implements OnInit {
  tickets$: Observable<Ticket[]>;
  rows$: Observable<{ [key: string]: { [key: number]: Seat } }>;
  chosenShowing$: Observable<ChoosenMovieShowing>;

  chosenSeatsAndTickets: OrderItem[] = [];
  seat: Seat;
  selectedTicket: Ticket;
  arrowIcon = faArrowDown;
  trashIcon = faTrash;

  constructor(
    private orderService: OrderStateService,
    private localStorageService: LocalStorageService,
    private ticketsService: TicketsStateService,
    private chosenShowingService: ChoosenMovieShowingStateService
  ) {}

  ngOnInit(): void {
    this.tickets$ = this.ticketsService.tickets$;
    this.rows$ = this.orderService.rows$;
    this.chosenShowing$ = this.chosenShowingService.chosenMovieShowing$;
  }

  checkIfSeatIsAvailable(seat: Seat): boolean {
    return this.orderService.checkIfSeatIsAvailable(seat);
  }

  clickChosenSeat(seat: Seat) {
    // console.log(this.chosenSeatsAndTickets);
    this.orderService.clickChosenSeat(seat, this.chosenSeatsAndTickets);
  }

  checkIfSeatIsChosen(seat: Seat): boolean {
    return this.orderService.checkIfSeatIsChosen(
      seat,
      this.chosenSeatsAndTickets
    );
  }

  selectTicket(orderItem: OrderItem): void {
    this.orderService.selectTicket(
      orderItem,
      this.chosenSeatsAndTickets,
      this.selectedTicket
    );
    this.orderService.setOrderItems(this.chosenSeatsAndTickets);
  }

  deleteChosenTicket(chosenItem: OrderItem) {
    this.orderService.deleteChosenSeatAndTicket(chosenItem);
  }

  saveChosenSeatsAndTicketsInLocalStorage(chosenSeatsAndTickets: OrderItem[]) {
    this.localStorageService.saveData(
      'seatTicketPairs',
      JSON.stringify(chosenSeatsAndTickets)
    );
  }
}
