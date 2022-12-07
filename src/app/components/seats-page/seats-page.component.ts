import { Component,  OnInit } from '@angular/core';
import { MovieService } from '../../services/movie.service';
import { ChoosenMovieService } from 'src/app/services/choosen-movie.service';
import { ChoosenMovieShowing } from 'src/app/models/Movie';
import { faArrowDown } from '@fortawesome/free-solid-svg-icons';
import { TicketService } from 'src/app/services/ticket.service';
import { Ticket } from 'src/app/models/Ticket';
import { ScreeningHall } from 'src/app/models/ScreeningHall';
import { Seat } from 'src/app/models/ScreeningHall';


@Component({
  selector: 'app-seats-page',
  templateUrl: './seats-page.component.html',
  styleUrls: ['./seats-page.component.css'],
})
export class SeatsPageComponent implements OnInit {
  seatNumbers: number[] = [];
  numberOfColumns: number = 16;
  numberOfRows: number;
  rowLetter: string;
  columnOfLetters: string[] = [];
  tickets: Ticket[];
  screeningHall: ScreeningHall;
  chosenMovieShowing: ChoosenMovieShowing;
  arrowIcon = faArrowDown;
  selectedTicket = null;	
  seats: Seat[];
  selected: string[] = [];

  constructor(
    private choosenMovieService: ChoosenMovieService,
    private service: MovieService,
    private ticketService: TicketService,

  ) {}

  ngOnInit(): void {
    this.choosenMovieService
      .getChoosenMovieShowing()
      .subscribe((result: ChoosenMovieShowing) => {
        console.log('wybrany seans o wybranej godz.', result);
        this.chosenMovieShowing = result;
      });


      this.ticketService.getAllTickets().subscribe((result: Ticket[]) => {
        console.log(result)
        this.tickets = result
      })


      this.numberOfRows = this.chosenMovieShowing.screeningHalls[0].rows;
      this.numberOfColumns = this.chosenMovieShowing.screeningHalls[0].columns;
this.seats = this.chosenMovieShowing.screeningHalls[0].seats;
  }

  getAllTickets() {
    this.service.getAllTickets().subscribe((response) => {
      console.log("bilety", response)

      this.tickets = response;
    });
  }

}
