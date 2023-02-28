import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { NewShowing, Showing } from '../../movie.interface';

@Injectable({
  providedIn: 'root',
})
export class ShowingApiService {
  private http = inject(HttpClient);

  getShowings() {
    return this.http.get<Showing[]>(`showings?_expand=movie&_expand=hall`);
  }

  addShowing(showing: NewShowing) {
    const { movieId, date, timeFrom, timeTo, hallId, movieBreak } = showing;

    return this.http.post<Showing>('showings', {
      movieId,
      date,
      timeFrom,
      timeTo,
      hallId,
      movieBreak,
    });
  }
}
