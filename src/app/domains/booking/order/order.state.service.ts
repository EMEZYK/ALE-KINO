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
import { Seat, SeatTicket } from '../hall/hall.interface';
import { LocalStorageService } from 'src/app/shared/local-storage';
import { OrderItem } from '../hall';

@Injectable({
  providedIn: 'root',
})
export class OrderStateService {
  private http = inject(HttpClient);
  private user$ = inject(UserStateService).user$;
  private tickets$ = inject(TicketsStateService).ticketTypes$;
  private showings$ = inject(ShowingStateService).showings$;
  private seats$ = inject(SeatsApiService).fetchAllSeats();
  private localStorage = inject(LocalStorageService);

  private order$$ = new BehaviorSubject<Order>({
    orderItems: [],
    status: 'reserved',
  });

  constructor() {
    if (!this.localStorage.getData('order')) {
      this.localStorage.saveData(
        'order',
        JSON.stringify({ orderItems: [], status: 'reserved' })
      );
    }

    const order: Order = JSON.parse(this.localStorage.getData('order'));
    if (order) {
      this.updateOrder(order);
      this.order$$.next(order);
    }
  }

  get order$() {
    return this.order$$.asObservable();
  }

  changeOrderPaidStatus(orderId: number) {
    this.http
      .patch<Order>(`orders/${orderId}`, {
        status: 'paid',
      })
      .subscribe();
  }

  sumTicketsValues() {
    return this.order$.pipe(
      switchMap((order) => {
        return this.tickets$.pipe(
          map((tickets) => {
            return order.orderItems.reduce((acc, orderItem) => {
              const ticket = tickets.find((t) => t.id === orderItem.ticketId);
              if (ticket) {
                return acc + ticket.price;
              } else {
                return acc;
              }
            }, 0);
          })
        );
      })
    );
  }

  addOrder(order: Order, shouldStore = true) {
    return this.http.post<Order>('orders', order).pipe(
      tap((order) => {
        if (shouldStore) {
          this.localStorage.saveData('order', JSON.stringify(order));
        }
        this.order$$.next(order);
      })
    );
  }

  updateOrder(newOrder: Order, shouldStore = true) {
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

        return this.http.put<Order>(`orders/${order.id}`, order).pipe(
          tap((order: Order) => {
            if (shouldStore) {
              this.localStorage.saveData('order', JSON.stringify(order));
            }
            this.order$$.next(order);
          })
        );
      })
    );
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
          this.seats$,
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
    return this.user$.pipe(
      switchMap((user: User) =>
        this.http.get<Order[]>(`orders?userId=${user.id}`)
      ),
      switchMap((orders: Order[]) =>
        this.getOrdersByIds(orders.map((order) => order.id))
      )
    );
  }

  checkIfSeatIsChosen(seat: Seat) {
    const currentOrderItems = this.order$$.getValue().orderItems;

    return currentOrderItems.some((el) => el.seatId === seat.id);
  }

  deleteOrderItem(seatTicket: SeatTicket) {
    const order: Order = this.order$$.getValue();
    const currentOrderItems = order.orderItems;

    currentOrderItems.forEach((item, index) => {
      if (item.seatId === seatTicket.seat.id) {
        currentOrderItems.splice(index, 1);
      }
    });

    this.updateOrder(order)
      .pipe(tap((order: Order) => this.order$$.next(order)))
      .subscribe();
  }

  clearOrder() {
    this.order$$.next({
      orderItems: [],
      status: 'reserved',
    });
  }
}
