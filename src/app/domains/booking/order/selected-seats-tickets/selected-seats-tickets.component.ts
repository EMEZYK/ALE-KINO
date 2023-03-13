import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import {
  FormControl,
  ReactiveFormsModule,
  Validators,
  FormsModule,
} from '@angular/forms';
import { NgIf, NgFor, CommonModule, AsyncPipe } from '@angular/common';
import { combineLatest, map, Observable } from 'rxjs';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { Seat, SeatsApiService, SeatTicket } from '../../hall';
import { faArrowDown, faTrash } from '@fortawesome/free-solid-svg-icons';
import { TicketType } from '../../tickets';
import { ChoosenMovieShowing } from 'src/app/domains/movies/movie.interface';
import { Order } from '../order.interface';

@Component({
  selector: 'app-selected-seats-tickets',
  templateUrl: './selected-seats-tickets.component.html',
  styleUrls: ['./selected-seats-tickets.component.css'],
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatSelectModule,
    ReactiveFormsModule,
    FormsModule,
    NgIf,
    NgFor,
    AsyncPipe,
    CommonModule,
    FontAwesomeModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectedSeatsTicketsComponent implements OnInit {
  @Input() order$: Observable<Order>;
  @Input() tickets$: Observable<TicketType[]>;
  @Input() chosenMovieShowing: ChoosenMovieShowing;
  @Output() btnClick = new EventEmitter<SeatTicket>();

  private seats$ = inject(SeatsApiService).fetchAllSeats();
  items$: Observable<SeatTicket[]>;

  deleteChosenTicket(chosenSeat: SeatTicket) {
    this.btnClick.emit(chosenSeat);
  }

  selectTicket(chosenSeat: SeatTicket, ticket: TicketType) {
    chosenSeat.ticket = ticket;
  }

  arrowIcon = faArrowDown;
  trashIcon = faTrash;

  selected = new FormControl(null, [Validators.required]);

  ngOnInit() {
    this.tickets$.pipe().subscribe((tickets) => {
      if (tickets.length > 0) {
        this.selected.setValue(tickets[0]);
      }
    });

    this.items$ = combineLatest([this.order$, this.tickets$, this.seats$]).pipe(
      map(([order, tickets, seats]) => {
        return order.orderItems.map(({ seatId, ticketId }) => {
          const seat = seats.find((seat: Seat) => seat.id === seatId);
          const ticket = tickets.find(
            (ticket: TicketType) => ticket.id === ticketId
          );
          return { seat: seat, ticket: ticket, showingId: order.showingId };
        });
      })
    );
  }
}
