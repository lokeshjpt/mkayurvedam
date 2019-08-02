import { TestBed } from '@angular/core/testing';

import { LabResultsService } from './lab-results.service';

describe('LabResultsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LabResultsService = TestBed.get(LabResultsService);
    expect(service).toBeTruthy();
  });
});
