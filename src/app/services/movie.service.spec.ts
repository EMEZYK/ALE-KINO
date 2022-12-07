import { TestBed } from '@angular/core/testing';

import { MovieService } from './movie.service';

describe('RestapiService', () => {
  let movieService: MovieService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    movieService = TestBed.inject(MovieService);
  });

  it('should be created', () => {
    expect(movieService).toBeTruthy();
  });
});
