import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { Observable } from 'rxjs';
import { ChoosenMovieShowing } from 'src/app/domains/movies/movie.interface';
import { AsyncPipe, NgIf, NgFor } from '@angular/common';
import { OrderStateService } from '../order.state.service';
import { ActivatedRoute } from '@angular/router';
import { UserOrder } from '../order.interface';
import { JsonPipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.css'],
  standalone: true,
  imports: [MatCardModule, NgIf, AsyncPipe, NgFor, JsonPipe, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderDetailsComponent implements OnInit {
  private orderService = inject(OrderStateService);
  private route = inject(ActivatedRoute);

  chosenMovieShowing$: Observable<ChoosenMovieShowing>;
  userOrder$: Observable<UserOrder[]>;
  sumOfTickets: number;

  ngOnInit() {
    const orderId = +this.route.snapshot.paramMap.get('id');

    this.userOrder$ = this.orderService.getOrdersByIds([orderId]);
  }
}
