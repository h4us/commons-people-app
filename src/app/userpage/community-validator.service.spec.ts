import { TestBed } from '@angular/core/testing';

import { CommunityValidatorService } from './community-validator.service';

describe('CommunityValidatorService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CommunityValidatorService = TestBed.get(CommunityValidatorService);
    expect(service).toBeTruthy();
  });
});
