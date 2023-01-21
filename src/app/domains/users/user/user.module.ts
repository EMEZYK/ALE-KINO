import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { USER_ROUTES } from './user.routes';
import { UserHomePageComponent } from './user-home-page.component';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { MoviesToWatchComponent } from './movies-watchlist/movies-watchlist.component';

@NgModule({
  declarations: [UserHomePageComponent, MoviesToWatchComponent],
  imports: [CommonModule, RouterModule.forChild(USER_ROUTES), SharedModule],
})
export class UserModule {}
