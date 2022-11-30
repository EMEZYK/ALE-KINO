import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { RestapiService } from 'src/app/services/restapi.service';
import {
  Showing,
  MovieWithShowingTime,
  Movie,
  ChoosenMovieShowing,
} from 'src/app/models/Movie';
import { Input } from '@angular/core';
import { Moment } from 'moment';
import { ChoosenMovieService } from 'src/app/services/choosen-movie.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css'],
})
export class MainComponent implements OnInit {
  @Input() dates: Moment[];

  date: Moment;
  loading = false;

  expandedMovieIdDescriptions: Array<number> = [];

  allMovies: Observable<MovieWithShowingTime[]>;
  allShowings: Observable<Showing[]>;

  constructor(
    private movieService: RestapiService,
    private choosenMovieService: ChoosenMovieService
  ) {}

  ngOnInit(): void {
    this.date = this.dates[0]; //default day = today
    this.getMovies(this.date);
  }

  toggleOpen(movieId: number) {
    let movieIndex = this.expandedMovieIdDescriptions.indexOf(movieId);
    if (movieIndex !== -1) {
      this.expandedMovieIdDescriptions.splice(movieIndex, 1);
    } else {
      this.expandedMovieIdDescriptions.push(movieId);
    }
  }

  isDescriptionExpanded(movieId: number): boolean {
    return this.expandedMovieIdDescriptions.indexOf(movieId) !== -1;
  }

  chooseDate(date: Moment) {
    this.date = date;
    this.getMovies(this.date);
  }

  getMovies(date: Moment) {
    this.loading = true;
    this.allMovies = this.movieService.getAllMoviesForDay(date);
    this.allMovies.subscribe({ complete: () => (this.loading = false) });
  }

  onMovieTimeClick(showing: Showing, movie: Movie) {
    // console.log("klik")
    this.choosenMovieService.setChoosenMovieShowing({
      ...showing,
      ...movie,
    });
  }
}
