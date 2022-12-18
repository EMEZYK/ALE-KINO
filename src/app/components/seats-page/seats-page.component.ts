import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ChoosenMovieShowing } from 'src/app/models/Movie';
import { Ticket } from 'src/app/models/Ticket';
import { Observable } from 'rxjs';
import {
  Seat,
  ChosenSeatsAndTickets,
} from 'src/app/models/Hall';
import { faArrowDown, faTrash } from '@fortawesome/free-solid-svg-icons';
import { OrderService } from 'src/app/services/order.service';

@Component({
  selector: 'app-seats-page',
  templateUrl: './seats-page.component.html',
  styleUrls: ['./seats-page.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class SeatsPageComponent implements OnInit {
  tickets$: Observable<Ticket[]>;
  rows$: Observable<any>;
  chosenShowing$: Observable<ChoosenMovieShowing>;

  chosenSeatsAndTickets: ChosenSeatsAndTickets[] = [];
  seat: Seat;
  selectedTicket: Ticket;
  arrowIcon = faArrowDown;
  trashIcon = faTrash;

  constructor(private orderService: OrderService) {}

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
}
