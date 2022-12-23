import { Component, OnInit } from '@angular/core';
import { FormGroup, NonNullableFormBuilder, Validators } from '@angular/forms';
import { CustomValidators } from 'src/app/shared/validators';
import { Observable, tap } from 'rxjs';
import { ChoosenMovieService } from '../../movies';
import { LocalStorageService } from 'src/app/shared/storage';
import { ChosenSeatsAndTickets } from '../hall/hall.interface';
import { Order } from '../order/order.interface';
import { OrderService } from '../order';
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
  sumOfTickets: number = 0;

  constructor(
    private builder: NonNullableFormBuilder,
    private choosenMovieService: ChoosenMovieService,
    private orderService: OrderService,
    private localStoreService: LocalStorageService
  ) {}

  ngOnInit(): void {
    this.chosenMovieShowing$ = this.choosenMovieService.chosenMovieShowing$;

    this.reservedSeatsAndTickets$ = this.orderService.orderItems$.pipe(
      tap((seatTicketPairs) => {
        this.sumTicketsValues(seatTicketPairs);
      })
    );

    this.createForm();

    let storedSeatTicketPairs = this.localStoreService.getData('seatTicketPairs');
    // if(storedSeatTicketPairs !== '') {
    // }

//     let storedSeatTicketPairs = localStoreService.getData('seatTicketPairs');
//     if (storedSeatTicketPairs) {
//       this.setSeatTicketPairs(JSON.parse(storedSeatTicketPairs));
// console.log("Stored",JSON.parse(storedSeatTicketPairs))
//       // this.seat = storedSeatTicketPairs;
//     }
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

  onSubmit() {
    this.bookingForm.markAllAsTouched();
    if (this.bookingForm.invalid) {
      return;
    }
    console.log(this.bookingForm.value);
    this.bookingForm.reset();
  }
}
