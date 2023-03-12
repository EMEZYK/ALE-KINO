import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Input,
  OnInit,
} from '@angular/core';
import { Observable, tap } from 'rxjs';
import { Moment } from 'moment';
import * as moment from 'moment';
import { MovieApiService } from './movie.api.service';
import { ChoosenMovieShowingStateService } from '../choosen-movie.state.service';
import {
  ChoosenMovieShowing,
  Movie,
  MovieWithShowingTime,
} from '../movie.interface';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePickerComponent } from 'src/app/shared/components/date-picker/date-picker.component';
import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { ManageMoviePanelComponent } from '../manage-movie-panel/manage-movie-panel.component';
import { SeatTicketsStateService } from '../../booking/order';
import { OrderStateService } from '../../booking/order/order.state.service';
import { LocalStorageService } from 'src/app/shared/local-storage';

@Component({
  selector: 'app-movie-list',
  standalone: true,
  imports: [
    DatePickerComponent,
    AsyncPipe,
    NgFor,
    NgIf,
    ManageMoviePanelComponent,
  ],
  templateUrl: './movie-list.component.html',
  styleUrls: ['./movie-list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MovieListComponent implements OnInit {
  private movieService = inject(MovieApiService);
  private choosenMovieService = inject(ChoosenMovieShowingStateService);
  private router = inject(Router);
  private seatTicketService = inject(SeatTicketsStateService);
  private orderService = inject(OrderStateService);
  private activeRoute = inject(ActivatedRoute);
  private localStorage = inject(LocalStorageService);

  @Input() selectedDate: string;
  date: Moment;
  dates: moment.Moment[] = [];

  expandedMovieIdDescriptions: number[] = [];
  allMovieShowings$: Observable<MovieWithShowingTime[]>;
  chosenShowingWithHall$: Observable<ChoosenMovieShowing>;

  ngOnInit(): void {
    const startDate = moment().startOf('isoWeek');
    const endDate = startDate.clone().add(6, 'days');

    this.activeRoute.params.subscribe((params) => {
      const day = params['day'];

      this.date = moment(day, 'YYYY-MM-DD');
      this.getMovies(day);
    });

    for (
      let m = moment(startDate);
      m.isSameOrBefore(endDate);
      m.add(1, 'days')
    ) {
      this.dates.push(m.clone());
    }
  }

  getMovies(dateString: string) {
    const date = moment(dateString, 'YYYY-MM-DD');
    this.allMovieShowings$ = this.movieService.getAllMoviesForDay(date);
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

  onMovieTimeClick(showingId: number, movie: Movie) {
    this.movieService
      .getShowingWithMovieAndHall(showingId, this.date)
      .pipe(
        tap((chosenShowing: ChoosenMovieShowing) => {
          this.choosenMovieService.setChoosenMovieShowing(chosenShowing);
        })
      )
      .subscribe();

    this.seatTicketService.clearSeatSelection();
    this.orderService.clearOrder();
    this.localStorage.removeData('order');

    this.seatTicketService.removeUnrelatedReservations(showingId);

    this.navigateToHall(movie);
  }

  navigateToHall(movie: Movie) {
    this.router.navigate([`booking/seats/${movie.id}/${movie.title}`]);
  }

  handleDateSelection(selectedDate: Moment) {
    const dateString = selectedDate.format('YYYY-MM-DD');
    this.getMovies(dateString);
  }
}
