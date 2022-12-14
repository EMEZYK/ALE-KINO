import { Component, OnInit } from '@angular/core';
import { ChoosenMovieService } from 'src/app/services/choosen-movie.service';
import { ChoosenMovieShowing } from 'src/app/models/Movie';
import { TicketService } from 'src/app/services/ticket.service';
import { Ticket } from 'src/app/models/Ticket';
import { Observable, pipe } from 'rxjs';
import { tap } from 'rxjs';
import { chosenTicketsData } from 'src/app/models/Ticket';
import { SeatsService } from 'src/app/services/seats.service';
import { Seat } from 'src/app/models/Hall';

@Component({
  selector: 'app-seats-page',
  templateUrl: './seats-page.component.html',
  styleUrls: ['./seats-page.component.css'],
})
export class SeatsPageComponent implements OnInit {
  chosenShowing$: Observable<ChoosenMovieShowing>;
  tickets$: Observable<Ticket[]>;
  rows$: Observable<any>;
  unavailableSeats: { column: number; row: string }[];
  chosenSeatsAndTickets: Seat[] = [];
  seat: Seat;
  statusOfSeat: boolean = false;

  chosenTicketsData$: Observable<chosenTicketsData>;
  chosenTicket: Ticket;



  constructor(
    private choosenMovieService: ChoosenMovieService,
    private ticketService: TicketService,
    private seatsService: SeatsService
  ) {}

  ngOnInit(): void {
    this.chosenShowing$ = this.choosenMovieService
      .getChoosenMovieShowing()
      .pipe(
        tap((result) => {
          console.log(result);
          this.unavailableSeats = [
            ...result.bookedSeats,
            ...result.paidSeats,
          ].map((el) => {
            return { column: el.column, row: el.row };
          });
          console.log(this.unavailableSeats);

          const hallId = result.hallId;
          this.rows$ = this.fetchSortedSeats(hallId);
        })
      );

    this.tickets$ = this.ticketService.getAllTickets();
  }

  fetchSortedSeats(hallId: number) {
    return this.seatsService.fetchSeats(hallId).pipe(
      tap((res) => {
        console.log(res);
      })
    );
  }

  checkIfAvailable(seat: Seat): boolean {
    return this.unavailableSeats.find(
      (el) => el.column === seat.column && el.row === seat.row
    )
      ? true
      : false;
  }

  chosenSeatClick(seat) {
    const indexOfSeat = this.chosenSeatsAndTickets.indexOf(seat);
    const foundSeat = this.chosenSeatsAndTickets.find(
      (el) => el.column === seat.column && el.row === seat.row
    );

    foundSeat
      ? this.chosenSeatsAndTickets.splice(indexOfSeat, 1)
      : this.chosenSeatsAndTickets.push( seat);
  }

  isChosen(seat) {
    return this.chosenSeatsAndTickets.find((el) => (el === seat ? true : false));
  }

  deleteChosenTicket(ticket) {
    const indexOfTicket = this.chosenSeatsAndTickets.indexOf(ticket);
    this.chosenSeatsAndTickets.splice(indexOfTicket, 1);
  }

  chosenTicketClick(ticket) {
    const indexOfTicket = this.chosenSeatsAndTickets.indexOf(ticket);

  }

}
