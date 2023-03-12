import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { combineLatest, map, tap } from 'rxjs';
import { Router } from '@angular/router';
import { ChoosenMovieShowingStateService } from '../../movies';
import { Order } from '../order/order.interface';
import { SeatTicketsStateService } from '../order';
import { UserStateService } from 'src/app/core/user.state.service';
import { AuthLoginStateService } from 'src/app/domains/auth/auth-login.service';
import { LocalStorageService } from 'src/app/shared/local-storage';
import { AsyncPipe, NgIf } from '@angular/common';
import { ChosenShowingInfoComponent } from '../../movies/showings/chosen-showing-info/chosen-showing-info.component';
import { ShowingWithMovie } from '../../movies/movie.interface';
import { User } from '../../users/user.interface';
import { BookingForm } from '../booking-form';
import { BookingFormComponent } from '../booking-form';
import { ButtonComponent } from 'src/app/shared/components/button/button.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-booking-page',
  templateUrl: './booking-page.component.html',
  styleUrls: ['./booking-page.component.css'],
  standalone: true,
  imports: [
    AsyncPipe,
    NgIf,
    ChosenShowingInfoComponent,
    BookingFormComponent,
    ButtonComponent,
    FontAwesomeModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookingPageComponent {
  private authService = inject(AuthLoginStateService);
  private choosenMovieService = inject(ChoosenMovieShowingStateService);
  private orderItemsService = inject(SeatTicketsStateService);
  private router = inject(Router);
  private localStorageService = inject(LocalStorageService);
  private userService = inject(UserStateService);

  chosenMovieShowing$ = this.choosenMovieService.chosenMovieShowing$;
  seatTickets$ = this.orderItemsService.seatTickets$;
  sumOfTickets$ = this.orderItemsService.sumTicketsValues();
  arrowIcon = faArrowLeft;

  user$ = this.userService.user$.pipe(
    tap((user) => {
      user ? (this.user = user) : (this.user = null);
    })
  );

  vm$ = combineLatest([
    this.chosenMovieShowing$,
    this.seatTickets$,
    this.sumOfTickets$,
  ]).pipe(
    map(([v1, v2, v3]) => ({
      v1,
      v2,
      v3,
    }))
  );

  isLoggedInUser =
    this.authService.auth$ &&
    this.localStorageService.getData('role') === 'user';

  bookingForm: BookingForm | null = null;
  user: User;
  submitted = false;
  order: Order[];
  ticketPrice: number;

  navigateToHall(chosenShowing: ShowingWithMovie) {
    this.router.navigate([
      `booking/seats/${chosenShowing.movie.id}/${chosenShowing.movie.title}`,
    ]);
  }

  submitForm(bookingForm: BookingForm) {
    this.bookingForm = bookingForm;
  }
}
