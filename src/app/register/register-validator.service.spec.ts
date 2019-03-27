import { TestBed } from '@angular/core/testing';

import { RegisterValidatorService } from './register-validator.service';

describe('RegisterValidatorService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RegisterValidatorService = TestBed.get(RegisterValidatorService);
    expect(service).toBeTruthy();
  });
});
