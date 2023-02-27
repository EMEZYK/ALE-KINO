import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { DiscountCode } from './discount-codes.interface';
@Injectable({
  providedIn: 'root',
})
export class DiscountCodesApiService {
  private http = inject(HttpClient);

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
