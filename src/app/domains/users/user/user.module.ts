import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { USER_ROUTES } from './user.routes';
import { UserHomePageComponent } from './user-home-page.component';
import { RouterModule } from '@angular/router';
import { MoviesToWatchComponent } from '../../movies/movies-watchlist/movies-watchlist.component';
import { MovieListComponent } from '../../movies/movie-list';

@NgModule({
  declarations: [UserHomePageComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(USER_ROUTES),
    MoviesToWatchComponent,
    MovieListComponent,
  ],
  providers: [],
})
export class UserModule {}
