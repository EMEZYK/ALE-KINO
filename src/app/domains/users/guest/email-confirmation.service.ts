import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EmailConfirmationService {
  private userEmail$$ = new BehaviorSubject<string>('');

  get email$() {
    return this.userEmail$$.asObservable();
  }

  setEmail(confirmedEmail: string) {
    this.userEmail$$.next(confirmedEmail);
  }
}
