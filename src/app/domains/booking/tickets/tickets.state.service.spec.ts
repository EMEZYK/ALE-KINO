import { HttpClientTestingModule } from '@angular/common/http/testing';
import { EnvironmentInjector } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Observable, of } from 'rxjs';
import { TicketType } from './ticket.interface';
import { TicketsStateService } from './tickets.state.service';

describe('TicketsApiService', () => {
  jest.setTimeout(20000);

  const ticketTypesServiceMock = {
    fetchTickets(): Observable<TicketType[]> {
      return of([
        {
          id: 1,
          name: 'bilet ulgowy',
          price: 22,
          active: true,
          description: 'Bilet ulgowy przysługuje studentom i emerytom',
        },
        {
          id: 2,
          name: 'bilet normalny',
          price: 26,
          active: true,
          description: 'Bilet normalny nie posiada żadnych zniżek',
        },
      ]);
    },
  };
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        TicketsStateService,
        { provide: TicketsStateService, useValue: ticketTypesServiceMock },
      ],
      imports: [HttpClientTestingModule],
    });
  });

  it('get ticketTypes', (done) => {
    const service =
      TestBed.inject(EnvironmentInjector).get(TicketsStateService);

    service.fetchTickets().subscribe({
      next: (results) => {
        expect(results[0].name).toBe('bilet ulgowy');
        expect(results[1].name).toBe('bilet normalny');
        done();
      },
    });
  });
});

describe('TicketStateService', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [TicketsStateService],
      imports: [HttpClientTestingModule],
    });
  });

  it('initial state', (done) => {
    const tickets =
      TestBed.inject(EnvironmentInjector).get(TicketsStateService);

    tickets.ticketTypes$.subscribe((val) => {
      expect(val).toEqual([]);
      done();
    });
  });

  it('should add ticket to the list', (done) => {
    const tickets = TestBed.inject(TicketsStateService);

    const ticketType = tickets.setTicket({
      id: 3,
      name: 'bilet ulgowy',
      price: 22,
      active: true,
      description: 'Bilet ulgowy przysługuje studentom i emerytom',
    });

    tickets.ticketTypes$.subscribe((val) => {
      expect(val).toEqual(ticketType);
      done();
    });
  });
});
