import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, map, switchMap, tap } from 'rxjs';

import { DiscountCode } from './discount-codes.interface';

@Injectable({
  providedIn: 'root',
})
export class DiscountCodesStateService {
  private http = inject(HttpClient);

  private discountCode$$ = new BehaviorSubject<DiscountCode>(null);

  get discountCode$() {
    return this.discountCode$$.asObservable();
  }

  setDiscountCode(discountCode: string) {
    this.getDiscountCodes()
      .pipe(
        map((codes: DiscountCode[]) => {
          return codes.find((code) => code.name === discountCode);
        }),
        tap((code) => this.discountCode$$.next(code))
      )
      .subscribe();
  }

  getDiscountCodes() {
    return this.http.get<DiscountCode[]>('discountCodes');
  }

  markDiscountCodeAsUsed(): void {
    this.discountCode$
      .pipe(
        switchMap((code: DiscountCode) =>
          this.http.patch<DiscountCode>(`discountCodes/${code.id}`, {
            active: false,
          })
        )
      )
      .subscribe();
  }
}
