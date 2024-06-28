import { TestBed } from '@angular/core/testing';

import { EspecificosService } from './especificaciones.service';

describe('EspecificosService', () => {
  let service: EspecificosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EspecificosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
