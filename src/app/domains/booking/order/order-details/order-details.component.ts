import { Component, inject, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { Observable, tap } from 'rxjs';
import { ChoosenMovieShowingStateService } from 'src/app/domains/movies';
import { ChoosenMovieShowing } from 'src/app/domains/movies/movie.interface';
import { AsyncPipe, NgIf, NgFor } from '@angular/common';
import { SeatTicketsStateService } from '../seat-tickets.state.service';
import { SeatTicket } from '../../hall';
import { OrderStateService } from '../order.service';
import { ActivatedRoute } from '@angular/router';
import { UserOrder } from '../order.interface';
import { AuthLoginStateService } from 'src/app/domains/auth/auth-login.service';
import { LocalStorageService } from 'src/app/shared/local-storage';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.css'],
  standalone: true,
  imports: [MatCardModule, NgIf, AsyncPipe, NgFor],
})
export class OrderDetailsComponent implements OnInit {
  private chosenMovieService = inject(ChoosenMovieShowingStateService);
  private seatTicketService = inject(SeatTicketsStateService);
  private orderService = inject(OrderStateService);
  private route = inject(ActivatedRoute);
  private authService = inject(AuthLoginStateService);
  private localStorageService = inject(LocalStorageService);

  chosenMovieShowing$: Observable<ChoosenMovieShowing>;
  seatTickets$: Observable<SeatTicket[]>;
  orderItem$: Observable<SeatTicket>;
  userOrder: UserOrder;
  sumOfTickets: number;

  isLoggedInUser =
    this.authService.auth$ &&
    this.localStorageService.getData('role') === 'user';

  ngOnInit() {
    const orderId = this.route.snapshot.paramMap.get('id');

    this.chosenMovieShowing$ = this.chosenMovieService.chosenMovieShowing$;
    this.seatTickets$ = this.seatTicketService.seatTickets$;
    this.orderService.getUserOrders();

    this.orderService
      .getUserOrders()
      .pipe(
        tap((userOrders) => {
          if (userOrders.length !== 0) {
            this.userOrder = userOrders.find(
              (el) => el.orderId.toString() === orderId.toString()
            );

            // console.log(this.userOrder);
          }
        })
      )
      .subscribe();

    this.seatTicketService
      .sumTicketsValues()
      .pipe(
        tap((value) => {
          this.sumOfTickets = value;
        })
      )
      .subscribe();
  }
}
