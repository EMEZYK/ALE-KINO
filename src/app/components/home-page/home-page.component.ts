import { Component, OnInit } from '@angular/core';
import * as moment from 'moment'

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {
  dates: moment.Moment[] = [];
  constructor() { }

  ngOnInit(): void {
    
let startDate = moment();
let endDate = startDate.clone().add(6, 'days');

for (let m = moment(startDate); m.isSameOrBefore(endDate); m.add(1, 'days')) {
  this.dates.push(m.clone());
}
  }


}
