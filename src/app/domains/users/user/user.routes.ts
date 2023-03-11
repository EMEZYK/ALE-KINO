import { Routes } from '@angular/router';

import { BookingPageComponent } from '../../booking/booking-page/booking-page.component';
import { HallComponent } from '../../booking/hall';
import { SummaryComponent } from '../../booking/order/summary';
import { UserHomePageComponent } from './user-home-page.component';
import { MoviesToWatchComponent } from '../../movies/movie-watchlist/movies-watchlist.component';
import { OrderListComponent } from '../../booking/order/orders-list/order-list.component';
import { OrderDetailsComponent } from '../../booking/order/order-details/order-details.component';
import * as moment from 'moment';

const date = moment().format('YYYY-MM-DD');

export const USER_ROUTES: Routes = [
  {
    path: '',
    children: [
      {
        path: 'home/:day',
        component: UserHomePageComponent,
      },
      {
        path: 'orders',
        component: OrderListComponent,
      },
      {
        path: 'orders/:id',
        component: OrderDetailsComponent,
      },
      {
        path: 'wishlist',
        component: MoviesToWatchComponent,
      },
      {
        path: 'settings',
        component: UserHomePageComponent,
      },
      {
        path: 'booking',
        children: [
          { path: 'seats/:id/:title', component: HallComponent },
          { path: 'reservation/:id/:title', component: BookingPageComponent },
          { path: 'summary/:id/:title', component: SummaryComponent },
        ],
      },
      {
        path: '**',
        redirectTo: `home/${date}`,
      },
    ],
  },
];
