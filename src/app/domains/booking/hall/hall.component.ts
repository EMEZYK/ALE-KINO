import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from 'rxjs';
import { faArrowDown, faTrash } from '@fortawesome/free-solid-svg-icons';
import { LocalStorageService } from 'src/app/shared/storage';
import { OrderService } from '../order';
import { Ticket } from '../tickets';
import { ChoosenMovieShowing } from '../../movies/movie.interface';
import { ChosenSeatsAndTickets, Seat } from './hall.interface';


@Component({
  selector: 'app-seats-page',
  templateUrl: './hall.component.html',
  styleUrls: ['./hall.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HallComponent implements OnInit {
  tickets$: Observable<Ticket[]>;
  rows$: Observable<any>;
  chosenShowing$: Observable<ChoosenMovieShowing>;

  chosenSeatsAndTickets: ChosenSeatsAndTickets[] = [];
  seat: Seat;
  selectedTicket: Ticket;
  arrowIcon = faArrowDown;
  trashIcon = faTrash;

  constructor(
    private orderService: OrderService,
    private localStoreService: LocalStorageService
  ) {

  }

  ngOnInit(): void {
    this.tickets$ = this.orderService.tickets$;
    this.rows$ = this.orderService.rows$;
    this.chosenShowing$ = this.orderService.chosenShowing$;
  }

  checkIfSeatIsAvailable(seat: Seat): boolean {
    return this.orderService.checkIfSeatIsAvailable(seat);
  }

  clickChosenSeat(seat: Seat) {
    this.orderService.clickChosenSeat(seat, this.chosenSeatsAndTickets);
  }

  checkIfSeatIsChosen(seat: Seat): boolean {
    return this.orderService.checkIfSeatIsChosen(
      seat,
      this.chosenSeatsAndTickets
    );
  }

  selectTicket(seat: ChosenSeatsAndTickets): void {
    this.orderService.selectTicket(
      seat,
      this.chosenSeatsAndTickets,
      this.selectedTicket
    );
  }

  deleteChosenTicket(ticket: ChosenSeatsAndTickets) {
    this.orderService.deleteChosenTicket(ticket, this.chosenSeatsAndTickets);
  }

  saveChosenSeatsAndTickets(chosenSeatsAndTickets: ChosenSeatsAndTickets[]) {
    this.orderService.setOrderItems(chosenSeatsAndTickets);

    this.setSeatTicketPairs(chosenSeatsAndTickets);
    console.log(chosenSeatsAndTickets);
  }

  setSeatTicketPairs(chosenSeatsAndTickets: ChosenSeatsAndTickets[],) {
    this.localStoreService.saveData(
      'seatTicketPairs',
      JSON.stringify(chosenSeatsAndTickets)
    );
  }
}
