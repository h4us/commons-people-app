import { TestBed } from '@angular/core/testing';

import { SigninValidatorService } from './signin-validator.service';

describe('SigninValidatorService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SigninValidatorService = TestBed.get(SigninValidatorService);
    expect(service).toBeTruthy();
  });
});
