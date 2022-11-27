import { TestBed } from '@angular/core/testing';

import { RestapiService } from './restapi.service';

describe('RestapiService', () => {
  let movieService: RestapiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    movieService = TestBed.inject(RestapiService);
  });

  it('should be created', () => {
    expect(movieService).toBeTruthy();
  });
});
