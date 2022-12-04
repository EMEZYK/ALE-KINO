import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePageComponent } from './components/home-page/home-page.component';
import { AdminPanelPageComponent } from './components/admin-panel-page/admin-panel-page.component';
import { SummaryPageComponent } from './components/summary-page/summary-page.component';
import { SeatsPageComponent } from './components/seats-page/seats-page.component';
import { BookingFormPageComponent } from './components/booking-form-page/booking-form-page.component';

const routes: Routes = [
  { path: '', component: HomePageComponent },
  {
    path: 'booking',
    children: [
      { path: 'seats', component: SeatsPageComponent },
      { path: 'reservation', component: BookingFormPageComponent },
      { path: 'summary', component: SummaryPageComponent },
    ],
  },
  { path: 'admin', component: AdminPanelPageComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
