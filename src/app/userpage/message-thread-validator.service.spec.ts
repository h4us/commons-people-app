import { TestBed } from '@angular/core/testing';

import { MessageThreadValidatorService } from './message-thread-validator.service';

describe('MessageThreadValidatorService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MessageThreadValidatorService = TestBed.get(MessageThreadValidatorService);
    expect(service).toBeTruthy();
  });
});
