import { TestBed } from '@angular/core/testing';

import { TopicValidatorService } from './topic-validator.service';

describe('TopicValidatorService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TopicValidatorService = TestBed.get(TopicValidatorService);
    expect(service).toBeTruthy();
  });
});
