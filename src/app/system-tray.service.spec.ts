import { TestBed } from '@angular/core/testing';

import { SystemTrayService } from './system-tray.service';

describe('TrayService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SystemTrayService = TestBed.get(SystemTrayService);
    expect(service).toBeTruthy();
  });
});
