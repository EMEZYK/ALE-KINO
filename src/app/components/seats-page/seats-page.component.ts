import { Component, OnInit } from '@angular/core';
import { MovieService } from '../../services/movie.service';
import { ChoosenMovieService } from 'src/app/services/choosen-movie.service';
import { ChoosenMovieShowing } from 'src/app/models/Movie';
import { faArrowDown } from '@fortawesome/free-solid-svg-icons';
import { TicketService } from 'src/app/services/ticket.service';
import { Ticket } from 'src/app/models/Ticket';
import { ScreeningHall } from 'src/app/models/ScreeningHall';
import { Seat } from 'src/app/models/ScreeningHall';
import { combineLatest, Observable } from 'rxjs';
import { tap } from 'rxjs';
import { chosenTicketsData } from 'src/app/models/Ticket';

@Component({
  selector: 'app-seats-page',
  templateUrl: './seats-page.component.html',
  styleUrls: ['./seats-page.component.css'],
})
export class SeatsPageComponent implements OnInit {
  chosenShowing$: Observable<ChoosenMovieShowing>;
  // tickets$: Observable<Ticket[]>;
  chosenTicketsData$: Observable<chosenTicketsData>
  tickets$: Ticket[];
  chosenTicket: Ticket;
  chosenMovieShowing: ChoosenMovieShowing;
  screeningHall: ScreeningHall;
  seats: Seat[];
  numberOfColumns: number;
  numberOfRows: number;


  constructor(
    private choosenMovieService: ChoosenMovieService,
    // private service: MovieService,
    private ticketService: TicketService
  ) {}

  ngOnInit(): void {
    this.chosenShowing$ = this.choosenMovieService
      .getChoosenMovieShowing()
      .pipe(
        tap((result) => {
          this.numberOfRows = result.screeningHalls[0].rows;
          this.numberOfColumns = result.screeningHalls[0].columns;
          this.seats = result.screeningHalls[0].seats;
        })
      );


      // this.tickets$ = this.ticketService.getAllTickets();

      // this.chosenTicketsData$ = combineLatest([this.chosenShowing$, this.tickets$])

      this.ticketService.getAllTickets().subscribe((result: Ticket[]) => {
        this.tickets$ = result
      })

  }

  get selectedTicket() {
    return this.chosenTicket;
  }

  set selectedTicket(value: Ticket) {
    this.chosenTicket = value;
    this.ticketService.setTicket(this.chosenTicket);
  }
}