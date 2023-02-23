import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { Showing } from '../../movie.interface';

@Injectable({
  providedIn: 'root',
})
export class ShowingApiService {
  private http = inject(HttpClient);

  getShowings() {
    return this.http.get<Showing[]>(
      `showings?_expand=movie&_expand=hall`
      // `showings?_expand=movie&_expand=hall&movieId=${movieId}`
    );
  }

  addShowing(showing: Showing) {
    return this.http.post<Showing>('showings', { showing });
  }
}
