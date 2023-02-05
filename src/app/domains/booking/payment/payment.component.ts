import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ChoosenMovieShowingStateService } from '../../movies';
import { ShowingWithMovie } from '../../movies/movie.interface';
import { Order } from '../order';
import { OrderStateService } from '../order/order.service';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css'],
})
export class PaymentComponent {
  private router = inject(Router);
  private orderService = inject(OrderStateService);
  chosenMovieShowing$ = inject(ChoosenMovieShowingStateService)
    .chosenMovieShowing$;

  order$: Observable<Order> = this.orderService.order$;

  cancelPayment(chosenMoving: ShowingWithMovie) {
    this.router.navigate([
      'booking/payment',
      chosenMoving.id,
      chosenMoving.movie.title,
      'cancel',
    ]);
  }

  approvePayment(chosenMoving: ShowingWithMovie, orderId: number) {
    this.orderService.changeOrderStatus(orderId);

    this.router.navigate([
      '/booking/summary',
      chosenMoving.id,
      chosenMoving.movie.title,
    ]);
  }
}
