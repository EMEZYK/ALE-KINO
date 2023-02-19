import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { ADMIN_ROUTES } from './admin.routes';
import { AdminPanelPageComponent } from './admin-panel-page.component';
import { MovieReducer } from '../../movies/store/repertoire.reducers';
import { MovieEffects } from '../../movies/store/repertoire.effects';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    AdminPanelPageComponent,
    RouterModule.forChild(ADMIN_ROUTES),
    StoreModule.forFeature('movies', MovieReducer),
    EffectsModule.forFeature([MovieEffects]),
  ],
})
export class AdminModule {}
