import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePageComponent } from './components/home-page/home-page.component';
import { AdminPanelPageComponent } from './components/admin-panel-page/admin-panel-page.component';
import { UserPanelPageComponent } from './user-panel-page/user-panel-page.component';
import { SummaryPageComponent } from './components/summary-page/summary-page.component';
import { SeatReservationPageComponent } from './components/seat-reservation-page/seat-reservation-page.component';
import { BookingFormPageComponent } from './components/booking-form-page/booking-form-page.component';

const routes: Routes = [
  { path: '', component: HomePageComponent },
  { path: 'admin', component: AdminPanelPageComponent },
  { path: 'user', component: UserPanelPageComponent },
  { path: 'form', component: BookingFormPageComponent },
  { path: 'hall', component: SeatReservationPageComponent },
  { path: 'summary', component: SummaryPageComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
