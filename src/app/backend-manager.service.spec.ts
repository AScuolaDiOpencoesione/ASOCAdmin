/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { BackendManagerService } from './backend-manager.service';

describe('Service: BackendManager', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BackendManagerService]
    });
  });

  it('should ...', inject([BackendManagerService], (service: BackendManagerService) => {
    expect(service).toBeTruthy();
  }));
});
