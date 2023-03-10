// import { inject, Injectable } from '@angular/core';
// import { ChoosenMovieShowing } from './movie.interface';
// import { BehaviorSubject } from 'rxjs';
// import { LocalStorageService } from 'src/app/shared/local-storage';

// @Injectable({
//   providedIn: 'root',
// })
// export class ChoosenMovieShowingStateService {
//   private localStorageService = inject(LocalStorageService);

//   private choosenMovie$$ = new BehaviorSubject<ChoosenMovieShowing>(null);

//   get chosenMovieShowing$() {
//     return this.choosenMovie$$.asObservable();
//   }

//   constructor() {
//     const storedShowing = this.localStorageService.getData(
//       'storedChoosenShowing'
//     );
//     if (storedShowing !== '')
//       this.setChoosenMovieShowing(JSON.parse(storedShowing), false);
//   }

//   setChoosenMovieShowing(
//     choosenShowing: ChoosenMovieShowing,
//     showingIsStored = true
//   ) {
//     if (showingIsStored)
//       this.localStorageService.saveData(
//         'storedChoosenShowing',
//         JSON.stringify(choosenShowing)
//       );

//     this.choosenMovie$$.next(choosenShowing);
//   }
// }

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { LocalStorageService } from 'src/app/shared/local-storage';
import { ChoosenMovieShowing } from './movie.interface';

@Injectable({
  providedIn: 'root',
})
export class ChoosenMovieShowingStateService {
  private choosenMovie$$ = new BehaviorSubject<ChoosenMovieShowing>(null);

  constructor(private localStorageService: LocalStorageService) {
    const storedShowing = this.localStorageService.getData(
      'storedChoosenShowing'
    );
    if (storedShowing) {
      this.setChoosenMovieShowing(JSON.parse(storedShowing), false);
    }
  }

  get chosenMovieShowing$() {
    return this.choosenMovie$$.asObservable();
  }

  setChoosenMovieShowing(
    choosenShowing: ChoosenMovieShowing,
    showingIsStored = true
  ) {
    if (showingIsStored) {
      this.localStorageService.saveData(
        'storedChoosenShowing',
        JSON.stringify(choosenShowing)
      );
    }

    console.log(choosenShowing);
    this.choosenMovie$$.next(choosenShowing);
  }
}
