import { Component, Input, Inject } from '@angular/core';
import { IDRFService } from '../drf.service';
import { Http, Response } from '@angular/http';
import { ActivatedRoute, Router } from '@angular/router';

import { DRFServiceComponent } from './drf.component';
import { BackendManagerService } from '../backend-manager.service';

@Component({
  selector:"[card-item]",
  templateUrl:"./card.component.html",
})
export class DRFCardItemComponent extends DRFServiceComponent{
  @Input() public item:any;
  
  prepare(){

  }
}

@Component({
  selector:"[cards]",
  templateUrl:"./cards.component.html",
  directives:[DRFCardItemComponent],
  providers:[BackendManagerService]
})
export class DRFCardListComponent extends DRFServiceComponent{
  public items:any[]|Promise<any[]>;

  config:any;

  constructor(private bms:BackendManagerService, private route: ActivatedRoute){
   super();
    this.config = this.route.snapshot.data;
    this.setService(bms.setActiveSpace(this.config.dataspace).setActiveApp(this.config.datasource));

  }

  ngOnInit(){
    this.prepare();

  }

  prepare(){
    this._service.getAll().then(x=>this.items=x);
  }
}