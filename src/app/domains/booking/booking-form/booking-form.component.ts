import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  inject,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import {
  FormGroup,
  FormsModule,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CustomValidators } from 'src/app/shared/validators';
import { switchMap, tap } from 'rxjs';
import { Router } from '@angular/router';
import { EmailConfirmationService } from '../../users/guest/email-confirmation.service';
import { ChoosenMovieShowingStateService } from '../../movies';
import { SeatTicket } from '../hall/hall.interface';
import { Order } from '../order/order.interface';
import { SeatTicketsStateService } from '../order';
import { UserStateService } from 'src/app/core/user.state.service';
import { AuthLoginStateService } from 'src/app/domains/auth/auth-login.service';
import { Guest, User } from '../../users/user.interface';
import { GuestApiService } from '../../users/guest/guest-api.service';
import { OrderStateService } from '../order/order.state.service';
import {
  ChoosenMovieShowing,
  ShowingWithMovie,
} from '../../movies/movie.interface';
import { LocalStorageService } from 'src/app/shared/local-storage';
import { debounceInput } from 'src/app/shared/facades/debounce-input.facade';
import { DiscountCodesStateService } from '../order/discountCodes/discount-codes.state.service';
import { AsyncPipe, NgIf } from '@angular/common';
import { ChosenShowingInfoComponent } from '../../movies/showings/chosen-showing-info/chosen-showing-info.component';
import { NumberDirective } from 'src/app/shared/directives/numbers-only.directive';
import { ButtonComponent } from 'src/app/shared/components/button/button.component';

export interface BookingForm {
  name: string;
  surname: string;
  phone?: string;
  emailInfo: {
    email: string;
    confirmEmail: string;
  };
  acceptNewsletter: '';
  discountCode: '';
}

export interface VM {
  v1: ChoosenMovieShowing;
  v2: SeatTicket[];
  v3: number;
}

@Component({
  selector: 'app-booking-form',
  templateUrl: './booking-form.component.html',
  styleUrls: ['./booking-form.component.css'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AsyncPipe,
    NgIf,
    ReactiveFormsModule,
    FormsModule,
    ChosenShowingInfoComponent,
    NumberDirective,
    ButtonComponent,
  ],
})
export class BookingFormComponent implements OnInit, OnDestroy {
  @Input() vm;
  @Output() submitBookingForm = new EventEmitter<BookingForm>();

  private authService = inject(AuthLoginStateService);
  private builder = inject(NonNullableFormBuilder);
  private choosenMovieService = inject(ChoosenMovieShowingStateService);
  private seatTicketsService = inject(SeatTicketsStateService);
  private emailService = inject(EmailConfirmationService);
  private router = inject(Router);
  private localStorageService = inject(LocalStorageService);
  private guestApiService = inject(GuestApiService);
  private orderService = inject(OrderStateService);
  private customValidators = inject(CustomValidators);
  private discountCodeService = inject(DiscountCodesStateService);

  chosenMovieShowing$ = this.choosenMovieService.chosenMovieShowing$;
  sumOfTickets$ = this.orderService.sumTicketsValues();

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

  user: User;
  bookingForm: FormGroup;
  submitted = false;
  order: Order[];
  ticketPrice: number;

  ngOnInit(): void {
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
      name: ['', [Validators.minLength(2), Validators.required]],
      surname: ['', [Validators.required, Validators.minLength(2)]],
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
      discountCode: [
        '',
        [
          this.customValidators.discountCodeValidator.bind(
            this.customValidators
          ),
        ],
      ],
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

    this.discountCode.valueChanges
      .pipe(
        debounceInput(),
        tap((value) => {
          if (value !== '') {
            this.discountCode.setAsyncValidators(
              this.customValidators.discountCodeValidator.bind(
                this.customValidators
              )
            );
            this.discountCode.updateValueAndValidity({ emitEvent: false });
          }
          this.discountCode.setValidators([]);
        })
      )
      .subscribe();
  }

  onSubmit(chosenShowing: ShowingWithMovie, orderItems: SeatTicket[]) {
    this.submitBookingForm.emit(this.bookingForm.value);

    this.bookingForm.markAllAsTouched();

    this.discountCodeService.setDiscountCode(this.discountCode.value);

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
            userId: this.user ? this.user.id : guest.id,
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

  ngOnDestroy() {
    this.user$.unsubscribe();
  }
}
