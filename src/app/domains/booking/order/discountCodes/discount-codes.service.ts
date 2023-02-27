import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, tap } from 'rxjs';
import { DiscountCode } from './discount-codes.interface';

@Injectable({
  providedIn: 'root',
})
export class DiscountCodesApiService {
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
    return this.http
      .get<DiscountCode[]>('discountCodes')
      .pipe(tap((val) => console.log(val)));
  }

  markDiscountCodeAsUsed(discounName: string): Observable<void> {
    return this.http.patch<void>(`discountCodes?name=${discounName}`, {
      active: false,
    });
  }
}
