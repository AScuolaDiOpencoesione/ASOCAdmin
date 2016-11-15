import { Component, Input } from '@angular/core';
import { IDRFService, IGenericDRFService } from '../drf.service';
import { DRFServiceComponent, DRFGenericServiceComponent} from './drf.component';
import { Router, ActivatedRoute }       from '@angular/router';
import { BackendManagerService } from "../backend-manager.service"

@Component({
  templateUrl:"./detail.component.html",
  providers:[BackendManagerService]
})
export class DRFDetailComponent extends DRFServiceComponent {
  private sub: any|Promise<any>;
  
  constructor(private route: ActivatedRoute){
    super();
  }
  
  config:any;
  
  @Input() id;
  public item:any | Promise<any> = {};

  prepare(){
    this.get(this.id);
  }

  get(id:number){
    this._service.getOne(id).then(itm => {this.item = itm;});
  }

  ngOnInit() { 
    console.log(this.route.snapshot.data)
    this.config = this.route.snapshot.data;
    this.sub = this._route.params.subscribe(params => {
       let id = +params['id']; // (+) converts string 'id' to a number
       this.prepare();
     });
  }
}