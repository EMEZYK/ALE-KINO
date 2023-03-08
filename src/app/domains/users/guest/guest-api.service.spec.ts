import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { GuestApiService } from './guest-api.service';
import { Guest } from '../user.interface';

describe('GuestApiService', () => {
  let service: GuestApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [GuestApiService],
    });
    service = TestBed.inject(GuestApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create guest account', (done) => {
    const dummyGuest: Guest = {
      id: 2,
      firstName: 'Ania',
      lastName: 'Wojno',
      phoneNumber: 555444333,
      email: 'ania@gmail.com',
    };

    service.createGuestAccount(dummyGuest).subscribe((data) => {
      expect(data).toEqual(dummyGuest);
      done();
    });

    const req = httpMock.expectOne('guests');
    expect(req.request.method).toEqual('POST');
    expect(req.request.body).toEqual(dummyGuest);

    req.flush(dummyGuest);
  });
});
