import { TestBed, inject } from '@angular/core/testing';

import { ProjectsApiService } from './projects-api.service';

describe('ProjectsApiService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ProjectsApiService]
    });
  });

  it('should be created', inject([ProjectsApiService], (service: ProjectsApiService) => {
    expect(service).toBeTruthy();
  }));
});
