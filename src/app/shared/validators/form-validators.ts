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
import { DiscountCodesStateService } from 'src/app/domains/booking/order/discountCodes/discount-codes.state.service';

export const URL_REGEXP =
  /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/;

@Injectable({
  providedIn: 'root',
})
export class CustomValidators {
  private discountCodesService: DiscountCodesStateService;

  constructor(discountCodesService: DiscountCodesStateService) {
    this.discountCodesService = discountCodesService;
  }

  static emailValidator(control: AbstractControl) {
    const emailRegex = /^[\w-\\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    const isValid = emailRegex.test(control.value);
    return isValid ? null : { email: true };
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
    const PHONE_REGEXP =
      /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{3}$/;
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
