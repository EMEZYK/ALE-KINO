import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { OrderStateService } from '../order.service';
import { NgFor, NgIf } from '@angular/common';
import { OrderDisplay, UserOrder } from '../order.interface';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { tap } from 'rxjs';

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.css'],
  standalone: true,
  imports: [MatTableModule, MatPaginatorModule, NgFor, NgIf, RouterModule],
})
export class OrderListComponent implements OnInit {
  private orderService = inject(OrderStateService);
  private router = inject(Router);

  userOrders: UserOrder[] = [];
  dataSource = new MatTableDataSource<OrderDisplay>([]);
  displayedColumns: string[] = [
    'orderDate',
    'movieTitle',
    'numberOfTickets',
    'details',
  ];
  columnHeaders: { [key: string]: string } = {
    orderDate: 'Data zamówienia',
    movieTitle: 'Nazwa filmu',
    numberOfTickets: 'Liczba biletów',
    details: 'Szczegóły',
  };

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngOnInit(): void {
    this.orderService
      .getOrdersByUser()
      .pipe(
        tap((userOrders) => {
          this.userOrders = userOrders;
          const orders = userOrders.map((order: UserOrder) => ({
            orderDate: order.showingWithMovie.date,
            movieTitle: order.showingWithMovie.movie.title,
            numberOfTickets: order.seatTickets.length,
            details: { id: 1, text: 'Zobacz szczegóły' },
            // details: { id: order.id, text: 'Zobacz szczegóły' },
          }));
          this.dataSource.data = orders;
          this.dataSource.paginator = this.paginator;
        })
      )
      .subscribe();
  }

  viewOrderDetails(orderId: string): void {
    this.router.navigate(['/order', orderId]);
  }
}
