import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.css'],
  standalone: true,
})
export class OrderDetailsComponent implements OnInit {
  ngOnInit() {
    console.log('jestem');
  }
}
