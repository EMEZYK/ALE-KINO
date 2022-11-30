import { Component,  OnInit } from '@angular/core';
import { RestapiService } from '../../services/restapi.service';
import { ChoosenMovieService } from 'src/app/services/choosen-movie.service';
import { ChoosenMovieShowing } from 'src/app/models/Movie';

@Component({
  selector: 'app-hall-page',
  templateUrl: './hall-page.component.html',
  styleUrls: ['./hall-page.component.css'],
})
export class HallPage implements OnInit {
  seatNumbers: number[] = [];
  numberOfColumns: number = 16;
  numberOfRows: number = 10;
  rowLetter: string;
  columnOfLetters: string[] = [];
  tickets: any;
  chosenMovieShowing: ChoosenMovieShowing;

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

      this.tickets.forEach((ticket) => {
        for (let key in ticket) {
          console.log(`${key}: ${ticket[key]}`);
        }
      });

      this.tickets.forEach((ticket) => console.log(ticket));
    });
  }
}
