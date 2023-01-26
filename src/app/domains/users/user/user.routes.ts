import { Routes } from '@angular/router';

import { BookingFormComponent } from '../../booking/booking-form';
import { HallComponent } from '../../booking/hall';
import { SummaryComponent } from '../../booking/order/summary';
import { MoviesToWatchComponent } from './movies-watchlist/movies-watchlist.component';
import { UserHomePageComponent } from './user-home-page.component';

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
        component: UserHomePageComponent,
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
