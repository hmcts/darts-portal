import { TestBed } from '@angular/core/testing';

import { TableCustomSortFunctionsService } from './table-custom-sort-functions.service';

describe('TableCustomSortFunctionsService', () => {
  let service: TableCustomSortFunctionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TableCustomSortFunctionsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
