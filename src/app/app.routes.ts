import { Routes } from '@angular/router';
import { AuthGuard } from './domains/auth';
import { LoginComponent } from './domains/auth/login';
import { BookingFormComponent } from './domains/booking/booking-form';
import { HallComponent } from './domains/booking/hall';
import { SummaryComponent } from './domains/booking/order/summary';
import { AdminModule } from './domains/users/admin/admin.module';
import { UserModule } from './domains/users/user/user.module';
import { HomeComponent } from './home/home.component';

export const APP_ROUTES: Routes = [
  { path: '', component: HomeComponent },
  {
    path: 'booking',
    children: [
      { path: 'seats/:id/:title', component: HallComponent },
      { path: 'reservation/:id/:title', component: BookingFormComponent },
      { path: 'summary/:id/:title', component: SummaryComponent },
    ],
  },
  {
    path: 'user',
    loadChildren: () => UserModule,
    data: {role: 'user'},
    canActivate: [AuthGuard]
  },
  { path: 'admin', loadChildren: () => AdminModule, data: {role: 'admin'}, canActivate: [AuthGuard] },

  { path: 'login', component: LoginComponent  },
];