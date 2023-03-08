import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { USER_ROUTES } from './user.routes';
import { UserHomePageComponent } from './user-home-page.component';
import { RouterModule } from '@angular/router';
import { MoviesToWatchComponent } from '../../movies/movie-watchlist/movies-watchlist.component';
import { MovieListComponent } from '../../movies/movie-list';
import { OrderListComponent } from '../../booking/order/orders-list/order-list.component';
import { OrderDetailsComponent } from '../../booking/order/order-details/order-details.component';
import { HomeComponent } from '../../home/home.component';
import { SeatTicketsStateService } from '../../booking/order';

@NgModule({
  declarations: [UserHomePageComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(USER_ROUTES),
    MoviesToWatchComponent,
    MovieListComponent,
    OrderListComponent,
    OrderDetailsComponent,
  ],

  providers: [HomeComponent, SeatTicketsStateService],
})
export class UserModule {}
