import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoadingStateService {
  private isLoading$$ = new BehaviorSubject<boolean>(false);

  get loading$() {
    return this.isLoading$$.asObservable();
  }

  setLoading(isLoading: boolean) {
    this.isLoading$$.next(isLoading);
  }
}
