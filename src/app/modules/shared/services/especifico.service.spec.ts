import { TestBed } from '@angular/core/testing';

import { EspecificoService } from './especifico.service';

describe('EspecificoService', () => {
  let service: EspecificoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EspecificoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
