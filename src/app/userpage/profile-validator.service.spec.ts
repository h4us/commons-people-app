import { TestBed } from '@angular/core/testing';

import { ProfileValidatorService } from './profile-validator.service';

describe('ProfileValidatorService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ProfileValidatorService = TestBed.get(ProfileValidatorService);
    expect(service).toBeTruthy();
  });
});
