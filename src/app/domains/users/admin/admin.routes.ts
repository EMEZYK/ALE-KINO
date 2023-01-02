import { Routes } from '@angular/router';
import { AdminPanelPageComponent } from './admin-panel-page.component';
import { AuthGuard } from '../../auth';

export const ADMIN_ROUTES: Routes = [
  { path: '', component: AdminPanelPageComponent },
  // { path: '', component: AdminPanelPageComponent, canActivate: [AuthGuard] },
];
