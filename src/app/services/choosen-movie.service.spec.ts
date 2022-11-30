import { TestBed } from '@angular/core/testing';

import { ChoosenMovieService } from './choosen-movie.service';

describe('ChoosenMovieService', () => {
  let service: ChoosenMovieService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChoosenMovieService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
