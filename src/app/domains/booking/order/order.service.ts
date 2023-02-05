import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, tap } from 'rxjs';
import { Order } from './order.interface';

@Injectable({
  providedIn: 'root',
})
export class OrderStateService {
  private http = inject(HttpClient);

  private order$$ = new BehaviorSubject<Order>(null);

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

  getUserOrders(userId: number) {
    this.http.get<Order>(`orders?userId=${userId}`);
  }

  fetchOrders() {
    return this.http.get<Order[]>('orders');
  }
}
