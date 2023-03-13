import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { Genre } from './genre.interface';

@Injectable({
  providedIn: 'root',
})
export class MovieGenresApiService {
  private http = inject(HttpClient);

  getMovieGenres$() {
    return this.http.get<Genre[]>('genres');
  }
}
