import { TestBed } from '@angular/core/testing';

import { ModalProxyService } from './modal-proxy.service';

describe('ModalProxyService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ModalProxyService = TestBed.get(ModalProxyService);
    expect(service).toBeTruthy();
  });
});
