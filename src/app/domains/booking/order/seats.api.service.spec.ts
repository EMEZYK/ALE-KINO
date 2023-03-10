import { HttpErrorResponse } from '@angular/common/http';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { EnvironmentInjector } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { SeatsApiService } from './seats.api.service';

describe('SeatsApiService', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [SeatsApiService],
      imports: [HttpClientTestingModule],
    });
  });

  it('getSeats', (done) => {
    const expectedUrl = 'seats';
    const service = TestBed.inject(EnvironmentInjector).get(SeatsApiService);
    const httpController = TestBed.inject(HttpTestingController);

    service.fetchAllSeats().subscribe({
      next: (res) => {
        expect(res).toEqual([]);
        done();
      },
      error: (err: HttpErrorResponse) => {
        expect(err.statusText).toEqual('Error');
        done();
      },
    });

    const req = httpController.expectOne(expectedUrl);

    req.flush([]);
  });
});
