import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import {
  BehaviorSubject,
  tap,
  combineLatest,
  switchMap,
  map,
  Observable,
  of,
  take,
} from 'rxjs';
import { Order, UserOrder } from './order.interface';
import { UserStateService } from 'src/app/core/user.state.service';
import { User } from '../../users/user.interface';
import { TicketType, TicketsStateService } from '../tickets';
import { ShowingStateService } from '../../movies/showing.state.service';
import { Showing } from '../../movies/movie.interface';
import { SeatsApiService } from './seats.api.service';
import { Seat } from '../hall/hall.interface';

@Injectable({
  providedIn: 'root',
})
export class OrderStateService {
  private http = inject(HttpClient);
  private userService = inject(UserStateService);
  private ticketService = inject(TicketsStateService);
  private showingService = inject(ShowingStateService);
  private hallService = inject(SeatsApiService);

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

  changeOrderPaidStatus(orderId: number) {
    this.http
      .patch<Order>(`orders/${orderId}`, {
        status: 'paid',
      })
      .subscribe();
  }

  updateOrder(newOrder: Order) {
    return this.order$.pipe(
      take(1),
      switchMap((order: Order) => {
        const itemsMap = new Map();

        newOrder.orderItems.forEach((item) => {
          const key = item.seatId;
          const value = itemsMap.get(item.seatId);

          if (!value) {
            itemsMap.set(key, item);
            return;
          }

          if (!value.ticketId) {
            itemsMap.set(key, item);
          }
        });

        order.orderItems = Array.from(itemsMap.values());

        return this.http
          .put<Order>(`orders/${order.id}`, order)
          .pipe(tap((order: Order) => this.order$$.next(order)));

      })
    );
  }

  getOrdersByShowingId(showingId: number) {
    return this.http.get<Order[]>(`orders?showingId=${showingId}`);
  }

  getOrdersByIds(orderIds: number[]): Observable<UserOrder[]> {
    const idsPath = orderIds
      .map((el) => el.toString())
      .reduce((prev, curr) => {
        return prev + `&id=` + curr;
      });

    return this.http.get<Order[]>(`orders?id=${idsPath}`).pipe(
      switchMap((order: Order[]) => {
        return combineLatest([
          of(order),
          this.tickets$,
          this.showings$,
          this.hallService.fetchAllSeats(),
        ]);
      }),
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
    );
  }

  getUserOrders(): Observable<UserOrder[]> {
    return this.userService.user$.pipe(
      switchMap((user: User) =>
        this.http.get<Order[]>(`orders?userId=${user.id}`)
      ),
      switchMap((orders: Order[]) =>
        this.getOrdersByIds(orders.map((order) => order.id))
      )
    );
  }
}
