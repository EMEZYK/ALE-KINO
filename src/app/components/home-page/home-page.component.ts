import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { MovieService } from 'src/app/services/movie.service';
import { Showing, MovieWithShowingTime, Movie } from 'src/app/models/Movie';
import { Moment } from 'moment';
import * as moment from 'moment';

import { ChoosenMovieService } from 'src/app/services/choosen-movie.service';
import { ScreeningHall } from 'src/app/models/ScreeningHall';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css'],
})
export class HomePageComponent implements OnInit {
  dates: moment.Moment[] = [];

  currentDay = moment();
  disableDay = false;

  date: Moment;
  loading = false;
  expandedMovieIdDescriptions: Array<number> = [];
  allMovies: Observable<MovieWithShowingTime[]>;
  allShowings: Observable<Showing[]>;

  constructor(
    private movieService: MovieService,
    private choosenMovieService: ChoosenMovieService
  ) {
  }

  ngOnInit(): void {
    let startDate = moment().startOf('isoWeek');
    let endDate = startDate.clone().add(6, 'days');

    for (
      let m = moment(startDate);
      m.isSameOrBefore(endDate);
      m.add(1, 'days')
    ) {
      this.dates.push(m.clone());
    }

    this.date = this.dates[0]; //default day = today
    this.chooseDate(this.date)
  }

  isDisabled(date: Moment) {
    if (date.isBefore(moment(), 'day')) {
      return true;
    }
    return false;
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

  onMovieTimeClick(showing: Showing, movie: Movie, screenignHalls: ScreeningHall) {
 this.choosenMovieService.setChoosenMovieShowing(

      {
      ...showing,
      ...movie,
      ...screenignHalls
    }
    
    
    )
  }
}


