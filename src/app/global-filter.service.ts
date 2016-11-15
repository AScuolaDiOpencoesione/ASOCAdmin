import { Injectable } from '@angular/core';
import { GlobalConfigurationService } from './global-configuration.service';

@Injectable()
export class GlobalFilterService {

  constructor(private gcs:GlobalConfigurationService) { 
      
  }
  
  filters:string[];
  
  setFilters(names:string[]){
      this.filters = names;
  }

}
