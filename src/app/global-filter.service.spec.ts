/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { GlobalFilterService } from './global-filter.service';

describe('Service: GlobalFilter', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GlobalFilterService]
    });
  });

  it('should ...', inject([GlobalFilterService], (service: GlobalFilterService) => {
    expect(service).toBeTruthy();
  }));
});
