import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { HeaderComponent } from './shared/ui/header/header.component';
import { FooterComponent } from './shared/ui/footer/footer.component';
import { MovieListComponent } from './domains/movies/movie-list';
import { PreloadAllModules, RouterModule } from '@angular/router';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { HallComponent } from './domains/booking/hall';
import { FormsModule } from '@angular/forms';
import { BookingFormComponent } from './domains/booking/booking-form';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpErrorInterceptor } from './shared/interceptors/http.interceptor';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginComponent } from './domains/auth/login';
import { HomeComponent } from './home/home.component';
import { QRCodeModule } from 'angularx-qrcode';
import { SummaryComponent } from './domains/booking/order/summary';
import { APP_ROUTES } from './app.routes';

@NgModule({
  declarations: [
    AppComponent,
    MovieListComponent,
    HeaderComponent,
    FooterComponent,
    HallComponent,
    BookingFormComponent,
    LoginComponent,
    HomeComponent,
    SummaryComponent
  ],
  imports: [
    BrowserModule,
    RouterModule,
    HttpClientModule,
    FontAwesomeModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    QRCodeModule,
    RouterModule.forRoot(APP_ROUTES, {
      preloadingStrategy: PreloadAllModules,
    }),
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: HttpErrorInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
