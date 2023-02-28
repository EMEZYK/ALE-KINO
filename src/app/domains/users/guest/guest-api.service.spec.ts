import { EnvironmentInjector } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { GuestApiService } from './guest-api.service';
import { Guest } from '../user.interface';
import { Observable, of } from 'rxjs';

describe('GuestApiService', () => {
  const guestApiServiceMock = {
    createGuestAccount(): Observable<Guest> {
      return of({
        id: 1,
        firstName: 'Ania',
        lastName: 'Wojno',
        phoneNumber: 444333555,
        email: 'ania@gmail.com',
      });
    },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        GuestApiService,
        { provide: GuestApiService, useValue: guestApiServiceMock },
      ],
      imports: [HttpClientTestingModule],
    });
  });

  it('add guest', (done) => {
    const service = TestBed.inject(EnvironmentInjector).get(GuestApiService);

    const guest: Guest = {
      id: 2,
      firstName: 'Ania',
      lastName: 'Wojno',
      phoneNumber: 555444333,
      email: 'ania@gmail.com',
    };

    service.createGuestAccount(guest).subscribe((result) => {
      expect(result.firstName).toBe('Ania');
      expect(result.email).toBe('ania@gmail.com');
      done();
    });
  });
});
