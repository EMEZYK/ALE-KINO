import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import * as moment from 'moment';
import { Movie, Showing } from '../movie.interface';
import { ShowingFormValue } from './add-showing/add-showing-form.component';
import { ShowingsState } from './store/showing.store';

@Injectable({
  providedIn: 'root',
})
export class ShowingTimeValidationService {
  canAddShowing(
    res: ShowingFormValue,
    showingSt: ShowingsState,
    movie: Movie
  ): Observable<boolean> {
    const timeToInMinutes =
      moment.duration(res.hour).asMinutes() + movie.duration;

    const formattedDate = moment(res.date).format('YYYY-MM-DD');

    const canAddShowing = !showingSt.showings.some((showing: Showing) => {
      if (
        res.hall.id === showing.hallId &&
        formattedDate === showing.date &&
        ((moment.duration(res.hour).asMinutes() >=
          moment.duration(showing.timeFrom).asMinutes() &&
          moment.duration(res.hour).asMinutes() <
            moment.duration(showing.timeTo).asMinutes() + showing.movieBreak) ||
          (timeToInMinutes >
            moment.duration(showing.timeFrom).asMinutes() - res.break &&
            timeToInMinutes <= moment.duration(showing.timeTo).asMinutes()))
      ) {
        console.log('Nie mogę dodać, sala zajęta');
        return true;
      }
      return false;
    });
    return of(canAddShowing);
  }
}
