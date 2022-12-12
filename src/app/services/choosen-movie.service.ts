import { Injectable } from '@angular/core';
import { ChoosenMovieShowing } from '../models/Movie';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ChoosenMovieService {
  private choosenMovie$$ = new BehaviorSubject<ChoosenMovieShowing>(null);

  constructor() {
    let storedShowing = localStorage.getItem('storedChoosenShowing');
    if (storedShowing !== "") this.setChoosenMovieShowing(JSON.parse(storedShowing), false);
  }

  getChoosenMovieShowing(): Observable<ChoosenMovieShowing> {
    return this.choosenMovie$$.asObservable();
  }

  setChoosenMovieShowing(
    choosenShowing: ChoosenMovieShowing,
    storedProp: boolean = true
  ) {
    if (storedProp)
      localStorage.setItem(
        'storedChoosenShowing',
        JSON.stringify(choosenShowing)
      );

    this.choosenMovie$$.next(choosenShowing);
  }
}
