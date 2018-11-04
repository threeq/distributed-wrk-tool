import { TestBed } from '@angular/core/testing';

import { ScenesApiService } from './scenes-api.service';

describe('ScenesApiService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ScenesApiService = TestBed.get(ScenesApiService);
    expect(service).toBeTruthy();
  });
});
