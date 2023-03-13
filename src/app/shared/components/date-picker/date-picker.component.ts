import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  inject,
  Input,
  Output,
} from '@angular/core';
import { Moment } from 'moment';
import * as moment from 'moment';
import { Router } from '@angular/router';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { RouterLinkActive } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-date-picker',
  standalone: true,
  imports: [NgFor, NgIf, MatButtonModule, RouterLinkActive, NgClass],
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DatePickerComponent {
  private router = inject(Router);

  @Input() dates: Moment[];
  @Output() dateClick = new EventEmitter<Moment>();

  date = moment();
  selectedDate: Moment;

  isActive(date: Moment) {
    return date === this.selectedDate;
  }

  chooseDate(currentDay: Moment) {
    this.selectedDate = currentDay;

    this.dateClick.emit(currentDay);

    this.router.navigate([`/home/${currentDay.format('YYYY-MM-DD')}`]);
  }

  isDisabled(date: Moment) {
    if (date.isBefore(moment(), 'day')) {
      return true;
    }
    return false;
  }
}
