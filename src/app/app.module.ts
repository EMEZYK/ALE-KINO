import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { HeaderComponent } from './shared/components/header';
import { FooterComponent } from './shared/components/footer/footer.component';
import { PreloadAllModules, RouterModule } from '@angular/router';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule } from '@angular/forms';
import { BookingFormComponent } from './domains/booking/booking-form';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpErrorInterceptor } from './shared/interceptors/http-error.interceptor';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginComponent } from './domains/auth/login-component';
import { HomeComponent } from './domains/home/home.component';
import { QRCodeModule } from 'angularx-qrcode';
import { SummaryComponent } from './domains/booking/order/summary';
import { APP_ROUTES } from './app.routes';
import { LoadingSpinnerComponent } from './shared/components/loader/loader.component';
import { LoadingInterceptor } from './shared/interceptors';
import { SharedModule } from './shared/shared.module';
import { PaymentComponent } from './domains/booking/payment';
import { NumberDirective } from './shared/directives/numbers-only.directive';
import { CancelPaymentComponent } from './domains/booking/payment/cancel-payment/cancel-payment.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    BookingFormComponent,
    LoginComponent,
    HomeComponent,
    SummaryComponent,
    LoadingSpinnerComponent,
    PaymentComponent,
    NumberDirective,
    CancelPaymentComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FontAwesomeModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    QRCodeModule,
    RouterModule.forRoot(APP_ROUTES, {
      preloadingStrategy: PreloadAllModules,
    }),
    SharedModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: LoadingInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: HttpErrorInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
