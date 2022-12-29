import { Component, OnInit } from '@angular/core';
import { FormGroup, NonNullableFormBuilder, Validators } from '@angular/forms';
import { CustomValidators } from 'src/app/shared/validators';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { EmailConfirmationService } from '../../users/guest/email-confirmation.service';
import { ChoosenMovieStateService } from '../../movies';
import { ChosenSeatsAndTickets } from '../hall/hall.interface';
import { Order } from '../order/order.interface';
import { OrderStateService } from '../order';
import { ChoosenMovieShowing } from '../../movies/movie.interface';


@Component({
  selector: 'app-booking-form-page',
  templateUrl: './booking-form.component.html',
  styleUrls: ['./booking-form.component.css'],
})
export class BookingFormComponent implements OnInit {
  public bookingForm: FormGroup;
  submitted = false;
  chosenMovieShowing$: Observable<ChoosenMovieShowing>;
  order: Order[];
  reservedSeatsAndTickets$: Observable<ChosenSeatsAndTickets[]>;
  ticketPrice: number;
  sumOfTickets = 0;
  setSeatTicketPairs:ChosenSeatsAndTickets[];

  constructor(
    private builder: NonNullableFormBuilder,
    private choosenMovieService: ChoosenMovieStateService,
    private orderService: OrderStateService,
    private emailService: EmailConfirmationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.chosenMovieShowing$ = this.choosenMovieService.chosenMovieShowing$;

    this.reservedSeatsAndTickets$ = this.orderService.orderItems$.pipe(
      tap((seatTicketPairs) => {
        console.log(seatTicketPairs)
        this.sumTicketsValues(seatTicketPairs);
      })
    );

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

  sumTicketsValues(seatTicketPairs: ChosenSeatsAndTickets[]) {
    this.sumOfTickets = seatTicketPairs
      .map((pair) => pair.ticket.price)
      .reduce((acc, value) => acc + value, 0);
  }

  onSubmit(chosenMovieShowing) {
    this.bookingForm.markAllAsTouched();
    if (this.bookingForm.invalid) {
      return;
    }
    // console.log(this.bookingForm.value);
    this.emailService.userEmail = this.bookingForm.value.emailInfo.email;
    this.router.navigate(['/booking/summary', chosenMovieShowing.id,  chosenMovieShowing.movie.title]);
    this.bookingForm.reset();
  }
}

