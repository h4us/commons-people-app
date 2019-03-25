import { TestBed } from '@angular/core/testing';

import { MessageProxyService } from './message-proxy.service';

describe('MessageProxyService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MessageProxyService = TestBed.get(MessageProxyService);
    expect(service).toBeTruthy();
  });
});
