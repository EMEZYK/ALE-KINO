import { Component, OnInit } from '@angular/core';
import { FormGroup, NonNullableFormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-booking-form-page',
  templateUrl: './booking-form-page.component.html',
  styleUrls: ['./booking-form-page.component.css'],
})
export class BookingFormPageComponent implements OnInit {
  bookingForm = this.createForm();
  submitted = false;

  constructor(private fb: NonNullableFormBuilder) {
  }

  ngOnInit(): void {}

  private createForm() {
    return this.fb.group({
      name: ['', Validators.required],
      surname: ['', Validators.required],
      phone: ['', Validators.pattern('^((\\+91-?)|0)?[0-9]{10}$')],
      email: ['', Validators.requiredTrue, Validators.email],
      repeatEmail: ['', Validators.requiredTrue, Validators.email],
      discount: [''],
    });
  }

  get message() {
    return this.bookingForm.controls;
  }

  onSubmit(form: FormGroup) {
    console.log("tu")

    this.bookingForm.markAllAsTouched();
    if (this.bookingForm.invalid) {
    this.submitted = true;
    console.log("błąd")

      return;
    }
    console.log(this.bookingForm.value);

    // //hand
    // if (this.bookingForm.valid) {
    //   alert('Yupi');
    // } else {
    //   alert('oh no');
    // }
    // console.log('name', form.value.name)
  }
}
