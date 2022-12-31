import { Routes } from "@angular/router";
import { LoginComponent } from "./domains/auth/login";
import { BookingFormComponent } from "./domains/booking/booking-form";
import { HallComponent } from "./domains/booking/hall";
import { SummaryComponent } from "./domains/booking/order/summary";
import { AdminModule } from "./domains/users/admin/admin.module";
import { UserModule } from "./domains/users/user/user.module";
import { HomeComponent } from "./home/home.component";

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
      loadChildren: () => UserModule
  },
    { path: 'admin', loadChildren: () => AdminModule },
  
  
    {path: 'login', component: LoginComponent}

]
