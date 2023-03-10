import { AsyncPipe, NgFor, NgIf, JsonPipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { SeatTicket } from 'src/app/domains/booking/hall';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-chosen-showing-info',
  templateUrl: './chosen-showing-info.component.html',
  styleUrls: ['./chosen-showing-info.component.css'],
  standalone: true,
  imports: [NgFor, AsyncPipe, NgIf, JsonPipe, MatCardModule],
})
export class ChosenShowingInfoComponent {
  @Input() sumOfTickets: number;
  @Input() chosenShowing;
  @Input() seatTickets: SeatTicket[];
}
