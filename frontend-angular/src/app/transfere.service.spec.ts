import { TestBed } from '@angular/core/testing';

import { TransfereService } from './transfere.service';

describe('TransfereService', () => {
  let service: TransfereService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TransfereService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
