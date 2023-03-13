import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { combineLatest, map, tap } from 'rxjs';
import { Router } from '@angular/router';
import { AsyncPipe, NgIf } from '@angular/common';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { ChoosenMovieShowingStateService } from '../../movies';
import { SeatTicketsStateService } from '../order';
import { UserStateService } from 'src/app/core/user.state.service';
import { AuthLoginStateService } from 'src/app/domains/auth/auth-login.service';
import { LocalStorageService } from 'src/app/shared/local-storage';
import { ChosenShowingInfoComponent } from '../../movies/showings/chosen-showing-info/chosen-showing-info.component';
import { ShowingWithMovie } from '../../movies/movie.interface';
import { User } from '../../users/user.interface';
import { BookingForm } from '../booking-form';
import { BookingFormComponent } from '../booking-form';
import { ButtonComponent } from 'src/app/shared/components/button/button.component';
import { OrderStateService } from '../order/order.state.service';
import { Seat, SeatsApiService } from '../hall';
import { TicketsStateService, TicketType } from '../tickets';

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
  private seatTicketService = inject(SeatTicketsStateService);
  private orderItemsService = inject(OrderStateService);
  private seats$ = inject(SeatsApiService).fetchAllSeats();
  private tickets$ = inject(TicketsStateService).ticketTypes$;

  private router = inject(Router);
  private localStorageService = inject(LocalStorageService);
  private userService = inject(UserStateService);

  chosenMovieShowing$ = this.choosenMovieService.chosenMovieShowing$;

  isLoggedInUser =
    this.authService.auth$ &&
    this.localStorageService.getData('role') === 'user';

  bookingForm: BookingForm | null = null;
  user: User;

  orderItems$ = combineLatest([
    this.orderItemsService.order$,
    this.tickets$,
    this.seats$,
  ]).pipe(
    map(([order, tickets, seats]) => {
      return order.orderItems.map(({ seatId, ticketId }) => {
        const seat = seats.find((seat: Seat) => seat.id === seatId);
        const ticket = tickets.find(
          (ticket: TicketType) => ticket.id === ticketId
        );
        return { seat, ticket };
      });
    })
  );

  sumOfTickets$ = this.orderItemsService.sumTicketsValues();

  arrowIcon = faArrowLeft;

  user$ = this.userService.user$.pipe(
    tap((user) => {
      user ? (this.user = user) : (this.user = null);
    })
  );

  vm$ = combineLatest([
    this.chosenMovieShowing$,
    this.orderItems$,
    this.sumOfTickets$,
  ]).pipe(
    map(([v1, v2, v3]) => ({
      v1,
      v2,
      v3,
    }))
  );

  navigateToHall(chosenShowing: ShowingWithMovie) {
    this.router.navigate([
      `booking/seats/${chosenShowing.movie.id}/${chosenShowing.movie.title}`,
    ]);
  }

  submitForm(bookingForm: BookingForm) {
    this.bookingForm = bookingForm;
  }
}
