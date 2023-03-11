import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
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
import { SeatTicket } from '../../hall';
import { NgIf, NgFor } from '@angular/common';
import { faArrowDown, faTrash } from '@fortawesome/free-solid-svg-icons';
import { TicketType } from '../../tickets';
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ChoosenMovieShowing } from 'src/app/domains/movies/movie.interface';

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
    FontAwesomeModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectedSeatsTicketsComponent implements OnInit {
  @Input() orderItems: SeatTicket[] = [];
  @Input() tickets$: Observable<TicketType[]>;
  @Input() chosenMovieShowing: ChoosenMovieShowing;
  @Output() btnClick = new EventEmitter<SeatTicket>();

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
  }
}
