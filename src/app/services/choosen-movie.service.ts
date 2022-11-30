import { Injectable } from '@angular/core';
import { ChoosenMovieShowing } from '../models/Movie';
import {BehaviorSubject, Observable} from "rxjs"


@Injectable({
  providedIn: 'root'
})
export class ChoosenMovieService {
  constructor() { }

 private choosenMovie$$ = new BehaviorSubject<ChoosenMovieShowing>(null);

 getChoosenMovieShowing(): Observable<ChoosenMovieShowing> {
     return this.choosenMovie$$.asObservable();
 }

 setChoosenMovieShowing(choosenShowing: ChoosenMovieShowing) {
  this.choosenMovie$$.next(choosenShowing)
 }

}
