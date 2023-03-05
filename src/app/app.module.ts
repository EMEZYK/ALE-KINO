import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { QRCodeModule } from 'angularx-qrcode';
import { PreloadAllModules, RouterModule } from '@angular/router';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { HeaderComponent } from './shared/components/header';
import { FooterComponent } from './shared/components/footer/footer.component';
import { BookingFormComponent } from './domains/booking/booking-form';
import { HttpErrorInterceptor } from './core/interceptors/http-error.interceptor';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginComponent } from './domains/auth/login-component';
import { HomeComponent } from './domains/home/home.component';
import { SummaryComponent } from './domains/booking/order/summary';
import { APP_ROUTES } from './app.routes';
import { LoadingSpinnerComponent } from './shared/components/loader/loader.component';
import { LoadingInterceptor } from './core/interceptors';
import { PaymentComponent } from './domains/booking/payment';
import { NumberDirective } from './shared/directives/numbers-only.directive';
import { CancelPaymentComponent } from './domains/booking/payment/cancel-payment/cancel-payment.component';
import { DatePickerComponent } from './shared/components/date-picker/date-picker.component';
import { MovieListComponent } from './domains/movies/movie-list';
import { OrderDetailsComponent } from './domains/booking/order/order-details/order-details.component';
import { MovieEffects } from './domains/movies/store/movie.effects';
import { MovieReducer } from './domains/movies/store/movie.reducers';
import { NoWhiteSpaceDirective } from './shared/directives/no-white-space.directive';
import { SeatTicketsStateService } from './domains/booking/order';
import { MatButtonModule } from '@angular/material/button';
import { AlphabetOnlyDirective } from './shared/directives/alphabet-only.directive';
import { ToastFacadeService } from './shared/facades/toast.facade.service';
import { ToastrModule } from 'ngx-toastr';

@NgModule({
  declarations: [
    AppComponent,
    BookingFormComponent,
    LoginComponent,
    HomeComponent,
  ],
  imports: [
    EffectsModule.forRoot([MovieEffects]),
    StoreModule.forRoot({ movies: MovieReducer }),
    BrowserModule,
    OrderDetailsComponent,
    NumberDirective,
    AlphabetOnlyDirective,
    NoWhiteSpaceDirective,
    SummaryComponent,
    CancelPaymentComponent,
    PaymentComponent,
    HeaderComponent,
    MovieListComponent,
    FooterComponent,
    LoadingSpinnerComponent,
    HttpClientModule,
    FontAwesomeModule,
    DatePickerComponent,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    QRCodeModule,
    MatButtonModule,
    ToastrModule.forRoot(),
    RouterModule.forRoot(APP_ROUTES, {
      preloadingStrategy: PreloadAllModules,
    }),
  ],
  providers: [
    ToastFacadeService,

    { provide: HTTP_INTERCEPTORS, useClass: LoadingInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: HttpErrorInterceptor, multi: true },
    SeatTicketsStateService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
