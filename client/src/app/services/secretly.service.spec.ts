import { TestBed } from '@angular/core/testing';

import { SecretlyService } from './secretly.service';

describe('SecretlyService', () => {
  let service: SecretlyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SecretlyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
