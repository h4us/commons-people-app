import { TestBed } from '@angular/core/testing';

import { PointValidatorService } from './point-validator.service';

describe('PointValidatorService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PointValidatorService = TestBed.get(PointValidatorService);
    expect(service).toBeTruthy();
  });
});
