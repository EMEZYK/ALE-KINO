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

@Component({
  selector: 'app-date-picker',
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.css'],
})
export class DatePickerComponent implements OnInit {
  private router = inject(Router);
  @Input() dates: Moment[];

  @Output() dateClick = new EventEmitter<Moment>();

  date = moment();

  ngOnInit(): void {
    this.chooseDate(this.date);
  }

  chooseDate(currentDay: Moment) {
    const formatedDate = currentDay.format('YYYY-MM-DD');

    this.dateClick.emit(currentDay);
    this.router.navigate([`/home/${formatedDate}`]);
  }

  isDisabled(date: Moment) {
    if (date.isBefore(moment(), 'day')) {
      return true;
    }
    return false;
  }
}
