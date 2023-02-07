import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MovieListComponent } from '../domains/movies/movie-list';
import { RouterModule } from '@angular/router';
import { HallComponent } from '../domains/booking/hall';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { DropdownMenuComponent } from './components/dropdown-menu/dropdown-menu.component';
import { ButtonComponent } from './components/button/button.component';
import { ManageMoviePanelComponent } from '../domains/users/user/manage-movie-panel/manage-movie-panel.component';
import { DatePickerComponent } from './components/date-picker/date-picker.component';

@NgModule({
  declarations: [
    MovieListComponent,
    HallComponent,
    DropdownMenuComponent,
    ButtonComponent,
    ManageMoviePanelComponent,
    DatePickerComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    FontAwesomeModule,
    HttpClientModule,
    FormsModule,
  ],
  exports: [
    MovieListComponent,
    HallComponent,
    DropdownMenuComponent,
    ButtonComponent,
    ManageMoviePanelComponent,
  ],
})
export class SharedModule {}
