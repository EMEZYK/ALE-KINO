import { Component, OnInit } from '@angular/core';
import { ChoosenMovieService } from 'src/app/services/choosen-movie.service';
import { ChoosenMovieShowing } from 'src/app/models/Movie';
import { TicketService } from 'src/app/services/ticket.service';
import { Ticket } from 'src/app/models/Ticket';
import { Observable, tap } from 'rxjs';
import { chosenTicketsData } from 'src/app/models/Ticket';
import { SeatsService } from 'src/app/services/seats.service';
import { Seat, chosenSeatsAndTickets } from 'src/app/models/Hall';
import { faArrowDown, faTrash } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-seats-page',
  templateUrl: './seats-page.component.html',
  styleUrls: ['./seats-page.component.css'],
})
export class SeatsPageComponent implements OnInit {
  chosenShowing$: Observable<ChoosenMovieShowing>;
  tickets$: Observable<Ticket[]>;
  chosenTicketsData$: Observable<chosenTicketsData>;
  rows$: Observable<any>;
  unavailableSeats: { column: number; row: string }[];
  chosenSeatsAndTickets: chosenSeatsAndTickets[] = [];
  tickets: Ticket[];
  chosenTicket: Ticket;
  seat: Seat;
  statusOfSeat: boolean = false;
  selectedTicket: any;
  arrowIcon = faArrowDown;
  trashIcon = faTrash

  constructor(
    private choosenMovieService: ChoosenMovieService,
    private ticketService: TicketService,
    private seatsService: SeatsService
  ) {}

  ngOnInit(): void {
    this.chosenShowing$ = this.choosenMovieService
      .getChoosenMovieShowing()
      .pipe(
        tap((chosenShowing) => {
          this.unavailableSeats = [
            ...chosenShowing.bookedSeats,
            ...chosenShowing.paidSeats,
          ]
          .map((unavailableSeat) => {
            return { column: unavailableSeat.column, row: unavailableSeat.row };
          });
          const hallId = chosenShowing.hallId;
          this.rows$ = this.fetchSortedSeats(hallId);
        })
      );

    this.tickets$ = this.ticketService.getAllTickets();
    this.tickets$.pipe(
      tap((listOfTickets) => {
        this.tickets = listOfTickets;
      })
    );
  }

  fetchSortedSeats(hallId: number) {
    return this.seatsService.fetchSeats(hallId);
  }

  checkIfSeatIsAvailable(seat: Seat): boolean {
    return this.unavailableSeats.some(
      (el) => el.column === seat.column && el.row === seat.row
    )
  }

  clickChosenSeat(seat: Seat) {
    const indexOfSeat = this.chosenSeatsAndTickets.findIndex(
      (el) => el.seat.column === seat.column && el.seat.row === seat.row
    );
    if (indexOfSeat === -1) {
      this.chosenSeatsAndTickets.push({
        seat: seat,
        ticket: this.tickets ? this.tickets[0] : null,
      });
    } else {
      this.chosenSeatsAndTickets.splice(indexOfSeat, 1);
    }
  }

  checkIfSeatIsChosen(seat: Seat) {
    return this.chosenSeatsAndTickets.some((el) =>
      el.seat === seat
    );
  }


  selectTicket(seat: chosenSeatsAndTickets) {
    const foundSeat = this.chosenSeatsAndTickets.find((el) => {
      return el.seat === seat.seat;
    });
    foundSeat.ticket = this.selectedTicket;
    // console.log('chosenSeatsAndTickets', this.chosenSeatsAndTickets);
  }

  deleteChosenTicket(ticket: chosenSeatsAndTickets) {
    const indexOfTicket = this.chosenSeatsAndTickets.indexOf(ticket);
    this.chosenSeatsAndTickets.splice(indexOfTicket, 1);
  }
}
