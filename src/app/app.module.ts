import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header-component/header.component';
import { FooterComponent } from './components/footer-component/footer.component';
import { HomePageComponent } from './components/home-page/home-page.component';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app.routing.module';
import { AdminPanelPageComponent } from './components/admin-panel-page/admin-panel-page.component';
import {HttpClientModule, HTTP_INTERCEPTORS} from "@angular/common/http"
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { SeatsPageComponent } from './components/seats-page/seats-page.component';
import { FormsModule } from '@angular/forms';
import { BookingFormPageComponent } from './components/booking-form-page/booking-form-page.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpErrorInterceptor } from './interceptors/htttp.interceptor';

@NgModule({
  declarations: [
    AppComponent,
    HomePageComponent,
    HeaderComponent,
    FooterComponent,
    AdminPanelPageComponent,
    SeatsPageComponent,
    BookingFormPageComponent
  ],
  imports: [BrowserModule, RouterModule, AppRoutingModule, HttpClientModule, FontAwesomeModule, FormsModule, ReactiveFormsModule,  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: HttpErrorInterceptor, multi: true}
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
