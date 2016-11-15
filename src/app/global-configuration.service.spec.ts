/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { GlobalConfigurationService } from './global-configuration.service';

describe('Service: GlobalConfiguration', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GlobalConfigurationService]
    });
  });

  it('should ...', inject([GlobalConfigurationService], (service: GlobalConfigurationService) => {
    expect(service).toBeTruthy();
  }));
});
