import { Component, OnInit } from '@angular/core';
import { ChoosenMovieService } from 'src/app/services/choosen-movie.service';
import { ChoosenMovieShowing } from 'src/app/models/Movie';
import { TicketService } from 'src/app/services/ticket.service';
import { Ticket } from 'src/app/models/Ticket';
import { Observable } from 'rxjs';
import { tap } from 'rxjs';
import { chosenTicketsData } from 'src/app/models/Ticket';

@Component({
  selector: 'app-seats-page',
  templateUrl: './seats-page.component.html',
  styleUrls: ['./seats-page.component.css'],
})
export class SeatsPageComponent implements OnInit {
  chosenShowing$: Observable<ChoosenMovieShowing>;

  chosenTicketsData$: Observable<chosenTicketsData>;
  tickets$: Ticket[];
  chosenTicket: Ticket;

  constructor(
    private choosenMovieService: ChoosenMovieService,
    private ticketService: TicketService
  ) {}

  ngOnInit(): void {
    this.chosenShowing$ = this.choosenMovieService
      .getChoosenMovieShowing()
      .pipe(
        tap((result) => {
          console.log('wybrany seans', result);
        })
      );

    // this.tickets$ = this.ticketService.getAllTickets();

    // this.chosenTicketsData$ = combineLatest([this.chosenShowing$, this.tickets$])

    // this.ticketService.getAllTickets().subscribe((result: Ticket[]) => {
    //   this.tickets$ = result
    // })
  }

  get selectedTicket() {
    return this.chosenTicket;
  }

  set selectedTicket(value: Ticket) {
    this.chosenTicket = value;
    this.ticketService.setTicket(this.chosenTicket);
  }
}
