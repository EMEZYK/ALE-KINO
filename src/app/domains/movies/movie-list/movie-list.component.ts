import { Component, inject, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Moment } from 'moment';
import * as moment from 'moment';
import { MovieService } from './movie.service';
import { ChoosenMovieShowingStateService } from '../choosen-movie.state.service';
import {
  ChoosenMovieShowing,
  Movie,
  MovieWithShowingTime,
} from '../movie.interface';
import { Router } from '@angular/router';

@Component({
  selector: 'app-movie-list',
  templateUrl: './movie-list.component.html',
  styleUrls: ['./movie-list.component.css'],
})
export class MovieListComponent implements OnInit {
  private movieService = inject(MovieService);
  private choosenMovieService = inject(ChoosenMovieShowingStateService);
  private router = inject(Router);

  @Input() selectedDate;
  date: Moment;
  dates: moment.Moment[] = [];

  expandedMovieIdDescriptions: number[] = [];
  allMovieShowings: Observable<MovieWithShowingTime[]>;
  chosenShowingWithHall$: Observable<ChoosenMovieShowing>;

  ngOnInit(): void {
    const startDate = moment().startOf('isoWeek');
    const endDate = startDate.clone().add(6, 'days');

    for (
      let m = moment(startDate);
      m.isSameOrBefore(endDate);
      m.add(1, 'days')
    ) {
      this.dates.push(m.clone());
    }

    this.date = moment();
  }

  toggleOpen(movieId: number) {
    const movieIndex = this.expandedMovieIdDescriptions.indexOf(movieId);
    if (movieIndex !== -1) {
      this.expandedMovieIdDescriptions.splice(movieIndex, 1);
    } else {
      this.expandedMovieIdDescriptions.push(movieId);
    }
  }

  isDescriptionExpanded(movieId: number): boolean {
    return this.expandedMovieIdDescriptions.indexOf(movieId) !== -1;
  }

  onMovieTimeClick(showingId: number, movie) {
    this.chosenShowingWithHall$ = this.movieService.getShowingWithMovieAndHall(
      showingId,
      this.date
    );

    this.chosenShowingWithHall$.subscribe({
      next: (value: ChoosenMovieShowing) => {
        this.choosenMovieService.setChoosenMovieShowing(value);
      },
    });

    this.navigateToHall(movie);
  }

  navigateToHall(movie: Movie) {
    this.router.navigate([`booking/seats/${movie.id}/${movie.title}`]);
  }

  handleDateSelection(selectedDate: Moment) {
    this.date = selectedDate;
    this.getMovies(this.date);
  }
  getMovies(date: Moment) {
    this.allMovieShowings = this.movieService.getAllMoviesForDay(date);
    this.allMovieShowings.subscribe();
  }
}
