import { Component, inject, Input } from '@angular/core';
import { AuthLoginService } from 'src/app/domains/auth/auth-login.service';
import { Movie } from 'src/app/domains/movies/movie.interface';
import { faEye } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-manage-movie-panel',
  templateUrl: './manage-movie-panel.component.html',
  styleUrls: ['./manage-movie-panel.component.css'],
})
export class ManageMoviePanelComponent {
  @Input() movie: Movie;
  addedToWatchlist = false;
  eyeIcon = faEye;

  private authService = inject(AuthLoginService);

  isLoggedInUser =
    this.authService.auth$ && this.authService.userRole === 'user';

  addToWatchList() {
    this.addedToWatchlist = true;
  }

  removeFromWatchList() {
    this.addedToWatchlist = false;
  }
}
