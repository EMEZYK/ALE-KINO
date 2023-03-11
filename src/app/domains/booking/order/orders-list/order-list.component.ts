import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { tap } from 'rxjs';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { OrderStateService } from '../order.service';
import { OrderDisplay, UserOrder } from '../order.interface';

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.css'],
  standalone: true,
  imports: [MatTableModule, MatPaginatorModule, NgFor, NgIf, RouterModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderListComponent implements OnInit {
  private orderService = inject(OrderStateService);
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);

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
    numberOfTickets: 'Ilość biletów',
    details: 'Szczegóły',
  };

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngOnInit(): void {
    this.orderService
      .getUserOrders()
      .pipe(
        tap((userOrders) => {
          this.userOrders = userOrders;
          const orders = userOrders.map((order: UserOrder) => ({
            orderDate: order.showingWithMovie.date,
            movieTitle: order.showingWithMovie.movie.title,
            numberOfTickets: order.seatTickets.length,
            details: { id: order.orderId, text: 'Zobacz szczegóły' },
          }));
          this.dataSource.data = orders;
          this.dataSource.paginator = this.paginator;
        })
      )
      .subscribe();
  }

  viewOrderDetails(orderId: string): void {
    this.router.navigate(['../orders', orderId], {
      relativeTo: this.activatedRoute,
    });
  }
}
