import { Component, OnInit } from '@angular/core';
import { RestapiService } from '../../services/restapi.service';

@Component({
  selector: 'app-seat-reservation-page',
  templateUrl: './seat-reservation-page.component.html',
  styleUrls: ['./seat-reservation-page.component.css']
})
export class SeatReservationPageComponent implements OnInit {

  constructor(private service: RestapiService) { }

  ngOnInit(): void {
    this.getAllTickets()
  }

  tickets: any;


  getAllTickets() {
    this.service.getAllTickets().subscribe(response => {
      this.tickets = response;

      this.tickets.forEach(ticket => {for (let key in ticket) {
        console.log(`${key}: ${ticket[key]}`)
      }});
  
      this.tickets.forEach(ticket => console.log(ticket));

    })
  }
}


