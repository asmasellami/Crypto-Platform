import { TestBed } from '@angular/core/testing';

import { GlobalDataTableService } from './global-data-table.service';

describe('GlobalDataTableService', () => {
  let service: GlobalDataTableService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GlobalDataTableService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
