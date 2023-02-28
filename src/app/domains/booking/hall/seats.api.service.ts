import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';

import { Seat } from './hall.interface';

@Injectable({
  providedIn: 'root',
})
export class SeatsApiService {
  private http = inject(HttpClient);

  fetchHallSeats(hallId: number) {
    return this.http.get<Seat[]>(`seats?hallId=${hallId}`).pipe(
      map((seats) => {
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
      })
    );
  }

  fetchAllSeats(): Observable<Seat[]> {
    return this.http.get<Seat[]>(`seats`);
  }
}
