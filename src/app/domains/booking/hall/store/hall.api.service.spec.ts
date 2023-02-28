import { EnvironmentInjector } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Hall } from '../hall.interface';
import { Observable, of } from 'rxjs';
import { HallApiService } from './hall.api.service';

jest.useRealTimers();
describe('HallApiService', () => {
  const hallApiServiceMock = {
    getHalls(): Observable<Hall[]> {
      return of([
        {
          id: 1,
          name: 'Duza sala',
          number: 3,
          rows: 12,
          columns: 10,
        },
        {
          id: 2,
          name: 'Mała sala',
          number: 4,
          rows: 18,
          columns: 12,
        },
      ]);
    },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        HallApiService,
        { provide: HallApiService, useValue: hallApiServiceMock },
      ],
      imports: [HttpClientTestingModule],
    });
  });

  it('get halls', (done) => {
    const service = TestBed.inject(EnvironmentInjector).get(HallApiService);

    service.getHalls().subscribe({
      next: (results) => {
        expect(results[0].number).toBe(3);
        expect(results[1].number).toBe(4);
        expect(results[0].name).toBe('Duza sala');
        expect(results[1].name).toBe('Mała sala');
        done();
      },
    });
  });
});
