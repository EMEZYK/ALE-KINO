import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Discount } from './discount-codes.interface';

@Injectable({
  providedIn: 'root',
})
export class DiscountCodesStateService {
  private http = inject(HttpClient);

  private discountCodes$$ = new BehaviorSubject<Discount[]>([]);

  get discounts$() {
    return this.discountCodes$$.asObservable();
  }

  constructor() {
    this.getDiscounts();
  }

  private getDiscounts() {
    return this.http
      .get<Discount[]>('discountCodes')
      .subscribe((discounts: Discount[]) =>
        this.discountCodes$$.next(discounts)
      );
  }

  setDiscount(discount: Discount) {
    this.discountCodes$$.next({ ...this.discountCodes$$.value, ...discount });
  }
}
