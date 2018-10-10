import { TestBed, inject } from '@angular/core/testing';

import { AdminApiService } from './admin-api.service';

describe('AdminApiService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AdminApiService]
    });
  });

  it('should be created', inject([AdminApiService], (service: AdminApiService) => {
    expect(service).toBeTruthy();
  }));
});
