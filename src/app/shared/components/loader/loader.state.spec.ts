import { EnvironmentInjector } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { LoadingStateService } from './loader.state.service';

describe('LoadingStateService', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [LoadingStateService],
    });
  });

  it('initial state', (done) => {
    const loader = TestBed.inject(EnvironmentInjector).get(LoadingStateService);

    loader.loading$.subscribe((val) => {
      expect(val).toEqual(false);
      done();
    });
  });

  it('should return true for loading$ after setLoading(true)', (done) => {
    const loader = TestBed.inject(EnvironmentInjector).get(LoadingStateService);

    loader.setLoading(true);

    loader.loading$.subscribe((val) => {
      expect(val).toEqual(true);
      done();
    });
  });
});
