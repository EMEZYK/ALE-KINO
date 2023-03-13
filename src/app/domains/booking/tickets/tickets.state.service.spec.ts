import { HttpClientTestingModule } from '@angular/common/http/testing';
import { EnvironmentInjector } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { TicketsStateService } from './tickets.state.service';

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
    const state = TestBed.inject(EnvironmentInjector).get(TicketsStateService);

    const ticket = state.setTicket({
      id: 3,
      name: 'bilet ulgowy',
      price: 22,
      active: true,
      description: 'Bilet ulgowy przysługuje studentom i emerytom',
    });

    state.ticketTypes$.subscribe((val) => {
      expect(val).toEqual(ticket);
      done();
    });
  });
});
