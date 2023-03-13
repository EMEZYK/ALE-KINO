import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { TicketsApiService } from './tickets.api.service';

describe('TicketsApiService', () => {
  let service: TicketsApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TicketsApiService],
    });

    service = TestBed.inject(TicketsApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should return expected data when getTickets is called', (done) => {
    const dummyTickets = [
      {
        id: 1,
        name: 'bilet normalny',
        price: 26,
        active: true,
        description: 'Bilet normalny przysługuje normalnej osobie',
      },
      {
        id: 2,
        name: 'bilet ulgowy',
        price: 16,
        active: true,
        description: 'Bilet ulgowy przysługuje studenciakowi',
      },
    ];

    service.getTickets().subscribe((data) => {
      expect(data).toEqual(dummyTickets);
      done();
    });

    const req = httpMock.expectOne('ticketsTypes');
    expect(req.request.method).toEqual('GET');

    req.flush(dummyTickets);
  });
});
