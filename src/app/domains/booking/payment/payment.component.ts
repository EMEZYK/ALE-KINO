import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ChoosenMovieShowingStateService } from '../../movies';
import { ShowingWithMovie } from '../../movies/movie.interface';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css'],
})
export class PaymentComponent {
  private router = inject(Router);
  chosenMovieShowing$ = inject(ChoosenMovieShowingStateService)
    .chosenMovieShowing$;

  cancelPayment(chosenMoving: ShowingWithMovie) {
    this.router.navigate([
      'booking/payment',
      chosenMoving.id,
      chosenMoving.movie.title,
      'cancel',
    ]);
  }

  approvePayment(chosenMoving: ShowingWithMovie) {
    this.router.navigate([
      '/booking/summary',
      chosenMoving.id,
      chosenMoving.movie.title,
    ]);
  }
}
