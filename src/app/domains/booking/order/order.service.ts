import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import {
  BehaviorSubject,
  tap,
  combineLatest,
  switchMap,
  map,
  Observable,
} from 'rxjs';
import { Order, UserOrder } from './order.interface';
import { UserStateService } from 'src/app/core/user.state.service';
import { User } from '../../users/user.interface';
import { TicketType, TicketTypesStateService } from '../tickets';
import { ShowingStateService } from '../../movies/showing.state.service';
import { Showing } from '../../movies/movie.interface';
import { HallApiService } from '../hall/hall.api.service';
import { Seat } from '../hall/hall.interface';

@Injectable({
  providedIn: 'root',
})
export class OrderStateService {
  private http = inject(HttpClient);
  private userService = inject(UserStateService);
  private ticketService = inject(TicketTypesStateService);
  private showingService = inject(ShowingStateService);
  private hallService = inject(HallApiService);

  private order$$ = new BehaviorSubject<Order>(null);

  private tickets$ = this.ticketService.ticketTypes$;
  private showings$ = this.showingService.showings$;

  get order$() {
    return this.order$$.asObservable();
  }

  addOrder(order: Order) {
    return this.http
      .post<Order>('orders', order)
      .pipe(tap((order) => this.order$$.next(order)));
  }

  changeOrderStatus(orderId: number) {
    this.http
      .patch<Order>(`orders/${orderId}`, {
        status: 'paid',
      })
      .subscribe();
  }

  getOrdersByUser(): Observable<UserOrder[]> {
    return this.userService.user$.pipe(
      switchMap((user: User) => {
        const orders$ = this.http.get<Order[]>(`orders?userId=${user.id}`);

        return combineLatest([
          orders$,
          this.tickets$,
          this.showings$,
          this.hallService.fetchAllSeats(),
        ]);
      }),
      // tap((val) => console.log(val)),
      map(([userOrders, tickets, showings, seats]): UserOrder[] => {
        return userOrders.map((order: Order) => {
          const showing: Showing = showings.find(
            (showing: Showing) => showing.id === order.showingId
          );

          const seatTickets = order.orderItems.map(({ seatId, ticketId }) => {
            return {
              seat: seats.find((seat: Seat) => seat.id === seatId),
              ticket: tickets.find(
                (ticket: TicketType) => ticket.id === ticketId
              ),
            };
          });

          return {
            showingWithMovie: { ...showing, movie: showing.movie },
            seatTickets: seatTickets,
            orderId: order.id,
          };
        });
      })
      // tap((val) => console.log('wynik', val))
    );
  }

  fetchOrders() {
    return this.http.get<Order[]>('orders');
  }
}
