import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, NonNullableFormBuilder, Validators } from '@angular/forms';
import { CustomValidators } from 'src/app/shared/validators';
import { Observable, switchMap, tap } from 'rxjs';
import { Router } from '@angular/router';
import { EmailConfirmationService } from '../../users/guest/email-confirmation.service';
import { ChoosenMovieShowingStateService } from '../../movies';
import { SeatTicket } from '../hall/hall.interface';
import { Order } from '../order/order.interface';
import { SeatTicketsStateService } from '../order';
import { ChoosenMovieShowing } from '../../movies/movie.interface';
import { UserStateService } from 'src/app/core/user.state.service';
import { AuthLoginStateService } from 'src/app/domains/auth/auth-login.service';
import { Guest, User } from '../../users/user.interface';
// import { DiscountCodesStateService } from 'src/app/domains/booking/order/discountCodes/discount.-codes.state.service';
// import { Discount } from '../order/discountCodes/discount-codes.interface';
import { GuestApiService } from '../../users/guest/guest-api.service';
import { OrderStateService } from '../order/order.service';
import { ShowingWithMovie } from '../../movies/movie.interface';
import { LocalStorageService } from 'src/app/shared/local-storage';

@Component({
  selector: 'app-booking-form-page',
  templateUrl: './booking-form.component.html',
  styleUrls: ['./booking-form.component.css'],
})
export class BookingFormComponent implements OnInit, OnDestroy {
  private authService = inject(AuthLoginStateService);
  private builder = inject(NonNullableFormBuilder);
  private choosenMovieService = inject(ChoosenMovieShowingStateService);
  private orderItemsService = inject(SeatTicketsStateService);
  private emailService = inject(EmailConfirmationService);
  private router = inject(Router);
  private localStorageService = inject(LocalStorageService);
  // private discounts$: Observable<Discount[]> = inject(DiscountCodesStateService)
  //   .discounts$;
  private guestApiService = inject(GuestApiService);
  private orderService = inject(OrderStateService);

  user$ = inject(UserStateService).user$.subscribe((user) => {
    if (user) {
      this.user = user;
    } else {
      this.user = null;
    }
  });

  isLoggedInUser =
    this.authService.auth$ &&
    this.localStorageService.getData('role') === 'user';

  chosenMovieShowing$: Observable<ChoosenMovieShowing>;
  seatTickets$: Observable<SeatTicket[]>;
  user: User;
  bookingForm: FormGroup;
  submitted = false;
  order: Order[];
  ticketPrice: number;
  sumOfTickets = 0;
  setSeatTicketPairs: SeatTicket[];

  ngOnInit(): void {
    this.chosenMovieShowing$ = this.choosenMovieService.chosenMovieShowing$;
    this.seatTickets$ = this.orderItemsService.seatTickets$;
    this.order;

    this.orderItemsService
      .sumTicketsValues()
      .pipe(
        tap((value) => {
          this.sumOfTickets = value;
        })
      )
      .subscribe();

    this.createForm();

    if (this.isLoggedInUser) {
      this.bookingForm.patchValue({
        name: this.user.firstName,
        surname: this.user.lastName,
        phone: this.user.phoneNumber,
        emailInfo: {
          email: this.user.email,
          confirmEmail: this.user.email,
        },
      });
    }
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
          Validators.maxLength(9),
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

  onSubmit(chosenShowing: ShowingWithMovie, orderItems: SeatTicket[]) {
    this.bookingForm.markAllAsTouched();

    if (this.bookingForm.invalid) {
      return;
    }

    const formValue = this.bookingForm.value;

    const guest: Guest = {
      id: null,
      firstName: formValue.name,
      lastName: formValue.surname,
      phoneNumber: formValue.phone,
      email: formValue.emailInfo.email,
    };

    this.guestApiService
      .createGuestAccount(guest)
      .pipe(
        switchMap((guest) =>
          this.orderService.updateOrder({
            userId: guest.id,
            orderItems: orderItems.map((orderItem: SeatTicket) => {
              return {
                seatId: orderItem.seat.id,
                ticketId: orderItem.ticket.id,
              };
            }),
            showingId: chosenShowing.id,
            status: 'reserved',
          })
        )
      )
      .subscribe();

    this.emailService.setEmail(this.bookingForm.value.emailInfo.email);
    this.router.navigate([
      '/booking/payment',
      chosenShowing.id,
      chosenShowing.movie.title,
    ]);
    this.bookingForm.reset();
  }

  navigateToHall(chosenShowing: ShowingWithMovie) {
    this.router.navigate([
      `booking/seats/${chosenShowing.movie.id}/${chosenShowing.movie.title}`,
    ]);
  }

  ngOnDestroy() {
    this.user$.unsubscribe();
  }
}
