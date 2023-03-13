import { AsyncPipe, NgFor, NgIf, JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { TicketType } from 'src/app/domains/booking/tickets';

@Component({
  selector: 'app-chosen-showing-info',
  templateUrl: './chosen-showing-info.component.html',
  styleUrls: ['./chosen-showing-info.component.css'],
  standalone: true,
  imports: [NgFor, AsyncPipe, NgIf, JsonPipe, MatCardModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChosenShowingInfoComponent {
  @Input() sumOfTickets: number;
  @Input() chosenShowing;
  @Input() tickets: TicketType[];
}
