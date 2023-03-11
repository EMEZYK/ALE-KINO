import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { Moment } from 'moment';

@Component({
  selector: 'app-home',
  template: `
    <div class="home-wrapper">
      <app-movie-list [selectedDate]="selectedDate"></app-movie-list>
    </div>
  `,
  styles: [
    `
      :host {
        width: 100%;
      }

      .home-wrapper {
        width: 100%;
        height: auto;
        margin: 0 auto;
        align-items: center;
        justify-content: center;
        background-color: #172032;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent implements OnInit {
  private activeRoute = inject(ActivatedRoute);
  selectedDate: Moment;

  ngOnInit() {
    this.activeRoute.params.subscribe((params) => {
      const day = params['day'];
      this.selectedDate = moment(day, 'YYYY-MM-DD');
    });
  }
}
