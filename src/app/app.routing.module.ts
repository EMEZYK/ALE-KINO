import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HallComponent } from './domains/booking/hall/hall.component';
import { BookingFormComponent } from './domains/booking/booking-form';
import { LoginComponent } from './domains/auth/login';
import { HomeComponent } from './home/home.component';
import { AdminPanelPageComponent } from './domains/users/admin/admin-panel-page';
import { UserHomePageComponent } from './domains/users/user/user-home-page';
import { SummaryComponent } from './domains/booking/order/summary/summary.component';

const routes: Routes = [
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
    children:[
  {
    path: 'home', component: UserHomePageComponent}
]
},
  { path: 'admin', component: AdminPanelPageComponent },
  {path: 'login', component: LoginComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
