import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Movie } from '../movie.interface';

@Injectable({
  providedIn: 'root',
})
export class MovieService {
  private http = inject(HttpClient);

  getAllMovies() {
    return this.http.get<Movie[]>('movies');
  }

  addMovie(movie: Movie, isActive: boolean) {
    return this.http.post<Movie>('movies', {
      ...movie,
      isActive,
    });
  }
}
