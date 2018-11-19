import { TestBed } from '@angular/core/testing';

import { MachinesApiService } from './machines-api.service';

describe('MachinesApiService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MachinesApiService = TestBed.get(MachinesApiService);
    expect(service).toBeTruthy();
  });
});
