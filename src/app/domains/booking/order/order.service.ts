import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Order } from './order.interface';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private http = inject(HttpClient);

  fetchOrders() {
    return this.http.get<Order[]>('orders');
  }

  addOrder(order: Order) {
    return this.http.post<Order>('orders', order);
  }

  changeOrderStatus(orderId: number) {
    this.http.patch<Order>(`orders/${orderId}`, {
      status: 'paid',
    });
  }

  getUserOrders(userId: number) {
    this.http.get<Order>(`orders?userId=${userId}`);
  }
}
