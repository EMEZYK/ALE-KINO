import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { Moment } from 'moment';
import * as moment from 'moment';
import { Router } from '@angular/router';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-date-picker',
  standalone: true,
  imports: [NgFor, NgIf],
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.css'],
})
export class DatePickerComponent implements OnInit {
  private router = inject(Router);

  @Input() dates: Moment[];
  @Output() dateClick = new EventEmitter<Moment>();

  date = moment();
  selectedDate: Moment;

  ngOnInit(): void {
    this.chooseDate(this.date);
    this.selectedDate = this.date;
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
