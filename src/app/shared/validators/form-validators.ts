import { Injectable } from '@angular/core';
import {
  ValidatorFn,
  ValidationErrors,
  AbstractControl,
  AsyncValidatorFn,
  FormControl,
} from '@angular/forms';
import { catchError, map, of } from 'rxjs';
import { DiscountCode } from 'src/app/domains/booking/order/discountCodes/discount-codes.interface';
import { DiscountCodesApiService } from 'src/app/domains/booking/order/discountCodes/discount-codes.service';

@Injectable({
  providedIn: 'root',
})
export class CustomValidators {
  private discountCodesService: DiscountCodesApiService;

  constructor(discountCodesService: DiscountCodesApiService) {
    this.discountCodesService = discountCodesService;
  }

  static emailMatchValidator: ValidatorFn = (
    formGroup: AbstractControl
  ): ValidationErrors | null => {
    const email = formGroup.get('email').value;
    const confirmEmail = formGroup.get('confirmEmail').value;

    return email === confirmEmail ? null : { noEmailMatch: true };
  };

  static phoneNumberValidator: ValidatorFn = (
    AbstractControl: ValidationErrors | null
  ) => {
    const PHONE_REGEXP = /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s./0-9]*$/;
    return !PHONE_REGEXP.test(AbstractControl.value)
      ? { invalidNumber: true }
      : null;
  };

  discountCodeValidator: AsyncValidatorFn = (
    control: AbstractControl | null
  ) => {
    const discountCode = (control as FormControl).value;
    if (!discountCode || discountCode === '') {
      return null;
    }

    return this.discountCodesService.getDiscountCodes().pipe(
      map((discountCodes: DiscountCode[]) => {
        const matchingDiscountCode = discountCodes.find(
          (code) => code.name === discountCode
        );

        if (!matchingDiscountCode) {
          return { invalidDiscountCode: true };
        } else if (matchingDiscountCode.active === false) {
          return { usedDiscountCode: true };
        } else {
          return null;
        }
      }),
      catchError(() => of({ invalidDiscountCode: true }))
    );
  };
}
