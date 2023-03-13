import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, tap } from 'rxjs';

import { Showing } from './movie.interface';

@Injectable({
  providedIn: 'root',
})
export class ShowingStateService {
  private http = inject(HttpClient);

  private showings$$ = new BehaviorSubject<Showing[]>([]);

  get showings$() {
    return this.showings$$.asObservable();
  }

  constructor() {
    this.fetchShowings();
  }

  fetchShowings() {
    return this.http
      .get<Showing[]>(`showings?_expand=movie`)
      .pipe(
        tap((val) => {
          this.showings$$.next(val);
        })
      )
      .subscribe();
  }
}
