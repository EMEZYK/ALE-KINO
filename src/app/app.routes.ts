import { Routes } from '@angular/router';
import { AuthGuard } from './domains/auth';
import { LoginComponent } from './domains/auth/login-component';
import { BookingFormComponent } from './domains/booking/booking-form';
import { HallComponent } from './domains/booking/hall';
import { SummaryComponent } from './domains/booking/order/summary';
import { PaymentComponent } from './domains/booking/payment';
import { CancelPaymentComponent } from './domains/booking/payment/cancel-payment/cancel-payment.component';
import { HomeComponent } from './domains/home/home.component';
import * as moment from 'moment';

const date = moment().format('YYYY-MM-DD');

export const APP_ROUTES: Routes = [
  { path: 'home/:day', component: HomeComponent },
  {
    path: 'booking',
    children: [
      { path: 'seats/:id/:title', component: HallComponent },
      { path: 'reservation/:id/:title', component: BookingFormComponent },
      { path: 'payment/:id/:title', component: PaymentComponent },
      { path: 'payment/:id/:title/cancel', component: CancelPaymentComponent },
      { path: 'summary/:id/:title', component: SummaryComponent },
    ],
  },
  {
    path: 'user',
    loadChildren: () =>
      import('./domains/users/user/user.module').then(
        (module) => module.UserModule
      ),
    data: { role: 'user' },
    canActivate: [AuthGuard],
  },
  {
    path: 'admin',
    loadChildren: () =>
      import('./domains/users/admin/admin.module').then(
        (module) => module.AdminModule
      ),
    data: { role: 'admin' },
    canActivate: [AuthGuard],
  },

  { path: 'login', component: LoginComponent },
  {
    path: '**',
    redirectTo: `home/${date}`,
  },
];
