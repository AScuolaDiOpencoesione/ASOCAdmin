import { Component, Input } from '@angular/core';
import {DRFNewComponent} from './new.component';
import { Subscription } from 'rxjs/Subscription';

import { ActivatedRoute, Router } from '@angular/router';
import { BackendManagerService } from '../backend-manager.service';

declare var $;

@Component({
  templateUrl:"./form.component.html",
  providers:[BackendManagerService]
})
export class DRFEditComponent extends DRFNewComponent{
  @Input() id;

  constructor(private eroute: ActivatedRoute, private erouter:Router, private ebms:BackendManagerService){
    super(eroute, erouter,ebms);
    this.setRoute(eroute);
  }

  ngOnInit(){
    super.ngOnInit();
    this.setService(this.ebms.setActiveSpace(this.config.dataspace).setActiveApp(this.config.datasource));
    
    this.sub = this._route.params.subscribe(params => {
      let id = +params['id']; // (+) converts string 'id' to a number
      this.id = id;
      this.prepare();
    });
  }

  public item:any;
  
  get(id:number){
    return new Promise((resolve,reject)=>{
      this._service.getOne(id).then(
          item => {
            this.item = item;
            resolve();
      });
    });
  }

  private sub:Subscription;


getBaseFields(){
  return {"id":this.id};
}

save(item:any){
  this._service.updateOne(item)
   .then(x => {this.postSave(x); })
   .catch(err => {this.handle_error(err); });
  }

  prepare(){  
    return new Promise((resolve,reject) =>{
      super.prepare().then(()=>{
        this.get(this.id)
        .then(() => {
          resolve();
          this.fillOut();
        });
      });
    });
  }


  fillOut(){
    console.log(this.item);
    for(let n of Object.keys(this.item)){
      let x = $("[name="+n+"]");
      if(x.length > 0){
        if (["radio","checkbox"].indexOf(x[0].getAttribute("type")) >= 0 ){
          x = $("[name="+n+"][value="+this.item[n]+"]");
          x[0].setAttribute("checked","checked");
        }
        else
          x.val(this.item[n]);
      }
    }
  }
}