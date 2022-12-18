import { Component, OnInit } from '@angular/core';
import { FormGroup, NonNullableFormBuilder, Validators } from '@angular/forms';
import { ChoosenMovieService } from 'src/app/services/choosen-movie.service';
import { ChoosenMovieShowing } from 'src/app/models/Movie';
import { Order } from 'src/app/models/Order';
import { CustomValidators } from 'src/app/validators/custom-validators';

@Component({
  selector: 'app-booking-form-page',
  templateUrl: './booking-form-page.component.html',
  styleUrls: ['./booking-form-page.component.css'],
})
export class BookingFormPageComponent implements OnInit {
  public bookingForm: FormGroup;
  submitted = false;
  chosenMovieShowing: ChoosenMovieShowing;
  order: Order[];

  constructor(
    private builder: NonNullableFormBuilder,
    private choosenMovieService: ChoosenMovieService
  ) {}

  ngOnInit(): void {
    this.choosenMovieService
      .chosenMovieShowing$
      .subscribe((result: ChoosenMovieShowing) => {
        this.chosenMovieShowing = result;
      });
    this.createForm();
  }

  private createForm() {
    this.bookingForm = this.builder.group({
      name: ['', Validators.required],
      surname: ['', Validators.required],
      phone: [''],
      emailInfo: this.builder.group(
        {
          email: ['', [Validators.required, Validators.email]],
          confirmEmail: ['', [Validators.required, Validators.email]],
        },
        {
          validators: [CustomValidators.emailMatchValidator],
        }
      ),
      acceptNewsletter: [''],
      discountCode: [''],
    });
    this.handleFormChanges();
  }

  get name() {
    return this.bookingForm.get('name');
  }
  get surname() {
    return this.bookingForm.get('surname');
  }
  get phone() {
    return this.bookingForm.get('phone');
  }

  get email() {
    return this.bookingForm.get('emailInfo').get('email');
  }
  get confirmEmail() {
    return this.bookingForm.get('emailInfo').get('confirmEmail');
  }
  get acceptNewsletter() {
    return this.bookingForm.get('acceptNewsletter');
  }
  get discountCode() {
    return this.bookingForm.get('discountCode');
  }

  handleFormChanges() {
    this.phone.valueChanges.subscribe((value) => {
      if (value !== '') {
        this.phone.setValidators([
          CustomValidators.phoneNumberValidator,
          Validators.minLength(9),
        ]);
        this.phone.updateValueAndValidity({ emitEvent: false });
      }
      this.phone.setValidators([]);
    });

    this.discountCode.valueChanges.subscribe((value) => {
      if (value !== '') {
        this.discountCode.setValidators([
          CustomValidators.discountCodeValidator,
        ]);
        this.discountCode.updateValueAndValidity({ emitEvent: false });
      }
      this.discountCode.setValidators([]);
    });
  }

  onSubmit() {
    this.bookingForm.markAllAsTouched();
    if (this.bookingForm.invalid) {
      return;
    }
    console.log(this.bookingForm.value);
    this.bookingForm.reset();
  }
}
