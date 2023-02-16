import { Routes } from '@angular/router';

import { BookingFormComponent } from '../../booking/booking-form';
import { HallComponent } from '../../booking/hall';
import { SummaryComponent } from '../../booking/order/summary';
import { UserHomePageComponent } from './user-home-page.component';
import { MoviesToWatchComponent } from '../../movies/movies-watchlist/movies-watchlist.component';
import { OrderListComponent } from '../../booking/order/order-list/order-list.component';

export const USER_ROUTES: Routes = [
  {
    path: '',
    component: UserHomePageComponent,
  },
  {
    path: '',
    children: [
      {
        path: 'orders',
        component: OrderListComponent,
      },
      {
        path: 'wishlist',
        component: MoviesToWatchComponent,
      },
      {
        path: 'settings',
        component: UserHomePageComponent,
      },
    ],
  },
  {
    path: 'booking',
    children: [
      { path: 'seats/:id/:title', component: HallComponent },
      { path: 'reservation/:id/:title', component: BookingFormComponent },
      { path: 'summary/:id/:title', component: SummaryComponent },
    ],
  },
];
