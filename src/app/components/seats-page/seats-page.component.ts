import { Component,  OnInit } from '@angular/core';
import { RestapiService } from '../../services/restapi.service';
import { ChoosenMovieService } from 'src/app/services/choosen-movie.service';
import { ChoosenMovieShowing } from 'src/app/models/Movie';
import { faArrowDown } from '@fortawesome/free-solid-svg-icons';


@Component({
  selector: 'app-seats-page',
  templateUrl: './seats-page.component.html',
  styleUrls: ['./seats-page.component.css'],
})
export class SeatsPageComponent implements OnInit {
  seatNumbers: number[] = [];
  numberOfColumns: number = 16;
  numberOfRows: number = 10;
  rowLetter: string;
  columnOfLetters: string[] = [];
  tickets: any;
  chosenMovieShowing: ChoosenMovieShowing;
  arrowIcon = faArrowDown;
  selectedTicket = null;	

  constructor(
    private choosenMovieService: ChoosenMovieService,
    private service: RestapiService,

  ) {}

  ngOnInit(): void {
    this.choosenMovieService
      .getChoosenMovieShowing()
      .subscribe((result: ChoosenMovieShowing) => {
        console.log('wybrany seans o wybranej godz.', result);
        this.chosenMovieShowing = result;
      });
    this.getAllTickets();
  }

  getAllTickets() {
    this.service.getAllTickets().subscribe((response) => {
      this.tickets = response;
      console.log("bilety", this.tickets)

      // this.tickets.forEach((ticket) => {
      //   for (let key in ticket) {
      //     console.log(`${key}: ${ticket[key]}`);
      //   }
      // });

      // this.tickets.forEach((ticket) => console.log(ticket));
    });
  }

  update(e) {
    console.log(e.target.value)
    this.selectedTicket = e.target.value;
  }
}
