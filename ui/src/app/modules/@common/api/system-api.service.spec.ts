import { TestBed, inject } from '@angular/core/testing';

import { SystemApiService } from './system-api.service';

describe('SystemApiService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SystemApiService]
    });
  });

  it('should be created', inject([SystemApiService], (service: SystemApiService) => {
    expect(service).toBeTruthy();
  }));
});
