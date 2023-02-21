import {
  AbstractControl,
  FormArray,
  FormControl,
  FormGroup,
  ValidationErrors,
} from '@angular/forms';
import { Injectable } from '@angular/core';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

interface FormArrayError {
  [controlName: string]: string;
}

const FormArrayError: { [controlName: string]: string }[] = [];

export interface FormErrors {
  [key: string]: string | FormArrayError[];
}

@Injectable({
  providedIn: 'root',
})
export class ErrorHandler {
  private form: FormGroup;
  private errorObject: TypeError;
  private message: string;

  private static hasError(control: AbstractControl): boolean {
    return control.invalid && (control.dirty || control.touched);
  }

  public handleErrors(form: FormGroup, errorObject: TypeError) {
    this.form = form;
    this.errorObject = errorObject;
    form.valueChanges
      .pipe(debounceTime(500), distinctUntilChanged())
      .subscribe(() => {
        if (form.invalid) {
          this.findErrors(form.controls);
        }
      });
  }

  private findErrors(controls: { [key: string]: AbstractControl }) {
    Object.keys(controls).forEach((control: string) => {
      if (controls[control] instanceof FormArray) {
        this.errorObject[control] = [];
        this.findErrorsOnFormArrays(controls[control] as FormArray, control);
      } else if (controls[control] instanceof FormControl) {
        this.findErrorsOnFormControls(controls, control);
      }
    });
  }

  private findErrorsOnFormControls(
    controls: { [key: string]: AbstractControl },
    control: string
  ) {
    if (ErrorHandler.hasError(controls[control])) {
      this.setErrorMessage(controls[control].errors);
      this.setErrorToErrorObject(control);
    }
  }

  private findErrorsOnFormArrays(formArray: FormArray, formArrayName: string) {
    const formArrayErrors: FormArrayError[] = [];

    for (const formControl of formArray.controls) {
      const formControlErrors = {};

      if (formControl.errors) {
        const form = Object.keys(formControl.errors);

        form.forEach((error) => {
          this.setErrorMessage(formControl.errors);
          formControlErrors[error] = this.message;
        });

        if (form) {
          formArrayErrors.push(formControlErrors);
        }
      }

      if (formArrayErrors) {
        const formattedErrors = formArrayErrors.map((error) => {
          const message = Object.values(error)[0];
          return message;
        });

        this.errorObject[formArrayName] = formattedErrors;
      }
    }
  }

  private setErrorMessage(errors: ValidationErrors) {
    if (errors.required) {
      this.message = 'Pole wymagane';
    } else if (errors.minlength) {
      this.message = `Minimalna ilośc znaków to ${errors.minlength.requiredLength}`;
    } else if (errors.maxlength) {
      this.message = `Maksymalna ilość znaków, to: ${errors.maxlength.requiredLength}`;
    } else if (errors.email) {
      this.message = 'Niepoprawny adres email';
    } else if (errors.min) {
      this.message = `Minimalna ilość znaków, to ${errors.min.min}, a aktualnie wprowadziłeś ${errors.min.actual}`;
    } else if (errors.max) {
      this.message = `Maksymalna ilość znaków, to ${errors.max.max}, a wprowadziłeś ${errors.max.actual}`;
    } else if (errors.pattern) {
      this.message = 'Niewłaściwy format';
    } else if (errors.emailMatchValidator) {
      this.message = 'Hasło nie jest zgodne';
    } else {
      this.message = '';
    }
  }

  private setErrorToErrorObject(field: string) {
    Object.defineProperty(this.errorObject, field, {
      value: this.message,
      writable: true,
    });
  }
}
