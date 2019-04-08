import { TestBed } from '@angular/core/testing';

import { PeriodicTasksService } from './periodic-tasks.service';

describe('PeriodicTasksService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PeriodicTasksService = TestBed.get(PeriodicTasksService);
    expect(service).toBeTruthy();
  });
});
