import { Injectable } from '@angular/core';
import { ChoosenMovieShowing } from '../models/Movie';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ChoosenMovieService {
  private choosenMovie$$ = new BehaviorSubject<ChoosenMovieShowing>(null);

  get chosenMovieShowing$() {
    return this.choosenMovie$$.asObservable();
  }

  constructor() {
    let storedShowing = localStorage.getItem('storedChoosenShowing');
    if (storedShowing !== '')
      this.setChoosenMovieShowing(JSON.parse(storedShowing), false);
  }

  setChoosenMovieShowing(
    choosenShowing: ChoosenMovieShowing,
    showingIsStored: boolean = true
  ) {
    if (showingIsStored)
      localStorage.setItem(
        'storedChoosenShowing',
        JSON.stringify(choosenShowing)
      );

    this.choosenMovie$$.next(choosenShowing);
  }
}
