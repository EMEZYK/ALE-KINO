import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/home-page/header/header.component';
import { FooterComponent } from './components/home-page/footer/footer.component';
import { MainComponent } from './components/home-page/main/main.component';
import { HomePageComponent } from './components/home-page/home-page.component';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app.routing-module';
import { AdminPanelPageComponent } from './components/admin-panel-page/admin-panel-page.component';
import {HttpClientModule} from "@angular/common/http"
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@NgModule({
  declarations: [
    AppComponent,
    HomePageComponent,
    HeaderComponent,
    FooterComponent,
    MainComponent,
    AdminPanelPageComponent,
  ],
  imports: [BrowserModule, RouterModule, AppRoutingModule, HttpClientModule, FontAwesomeModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
