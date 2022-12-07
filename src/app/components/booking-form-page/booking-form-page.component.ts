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
      .getChoosenMovieShowing()
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
  }

  get name() {
    return this.bookingForm.get('name');
  }
  get surname() {
    return this.bookingForm.get('surname');
  }
  get phone() {
    let phoneControl = this.bookingForm.get('phone');
console.log(phoneControl)
    if (phoneControl.value !== '' ) {
      phoneControl.setValidators([
        CustomValidators.phoneNumberValidator,
        Validators.minLength(9),
      ]);
    }
    return phoneControl;
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
    let discountCodeControl = this.bookingForm.get('discountCode');
    if (discountCodeControl.value !== '') {
      discountCodeControl.setValidators([CustomValidators.discountCodeValidator]);
    }
    return discountCodeControl;
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
