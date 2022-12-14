import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, map } from 'rxjs';
import { Seat } from '../models/Hall';

@Injectable({
  providedIn: 'root',
})
export class SeatsService {
  private seatsBehaviorSubject$$ = new BehaviorSubject<any>({});

  constructor(private http: HttpClient) {}

  fetchSeats(hallId: number) {
    const observableResult = this.http
      .get<Seat[]>(`seats?hallId=${hallId}`)
      .pipe(
        map((seats) => {
          console.log(seats);

          const seatsMap = {} as {
            [key: string]: { [key: number]: typeof seats[number] };
          };

          seats.forEach((seat) => {
            if (seatsMap[seat.row]) {
              seatsMap[seat.row][seat.column] = seat;
            } else {
              seatsMap[seat.row] = {
                [seat.column]: seat,
              };
            }
          });
          return seatsMap;
        }),
        tap((response) => {
          this.seatsBehaviorSubject$$.next(response);
        })
      );

    return observableResult;
  }
}
