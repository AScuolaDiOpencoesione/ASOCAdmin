import { Component, Input, Inject, ViewContainerRef, ComponentResolver, ComponentMetadata, ComponentFactory, Directive, ReflectiveInjector  } from '@angular/core';
import { IDRFService } from '../drf.service';
import { Http, Response } from '@angular/http';
import { ActivatedRoute, Router } from '@angular/router';

import { Observable }     from 'rxjs/Observable';
import 'rxjs/add/operator/toPromise';

import { DRFServiceComponent } from './drf.component';
import { BackendManagerService } from '../backend-manager.service';

export function createComponentFactory(resolver: ComponentResolver, metadata: ComponentMetadata): Promise<ComponentFactory<any>> {
    const cmpClass = class DynamicComponent extends DRFServiceComponent { public item:any; prepare(){} };
    const decoratedCmp = Component(metadata)(cmpClass);
    return resolver.resolveComponent(decoratedCmp);
}

@Directive({
  selector:"[list-item]",
})
export class DRFListItemComponent extends DRFServiceComponent{
  @Input() public item:any|Promise<any>;
  @Input() public template:string;
  constructor(private vcRef: ViewContainerRef, private resolver: ComponentResolver) {
    super();
  }
  
  
  ngOnChanges() {
    
    
    
    const metadata = new ComponentMetadata({
        selector: '[spec-list-item]',
        template: this.template,
    });
    createComponentFactory(this.resolver, metadata)
      .then(factory => {
        const injector = ReflectiveInjector.fromResolvedProviders([], this.vcRef.parentInjector);
        let i = this.vcRef.createComponent(factory, 0, injector, []).instance;
        //console.log(this.item);
        i.item = this.item;
      });  
  }
  prepare(){};
  
}


@Component({
  selector:"[list]",
  templateUrl:"./list.component.html",
  directives:[DRFListItemComponent],
  providers:[BackendManagerService]
})
export class DRFListComponent extends DRFServiceComponent{
  public items:any[];
  public internal_items:any[];
  search:string;

  config:any;

  constructor(private bms:BackendManagerService, private route: ActivatedRoute, private http:Http){
    super();
    this.config = this.route.snapshot.data;
    this.setService(bms.setActiveSpace(this.config.dataspace).setActiveApp(this.config.datasource));

  }

   onChange(){
    this.items = [];
    for(let i of this.internal_items){
      let data = JSON.stringify(i).toLowerCase();
      let src = this.search.toLowerCase();
      if(data.indexOf(src) >= 0)
        this.items.push(i);
    }
   }

  ngOnInit(){
    //console.log(this.config);
    this.prepare();

  }

  template = "";

  template_url = "/assets/list-item.component.html";

  prepare(){
    if (this.config.list_template) 
      this.template_url = this.config.list_template;
    //console.log(this.template_url);
    
    this.http.get(this.template_url).toPromise().then(x=>{
      this.template = x.text();
    });
    
    this._service.getAll().then(x=>{
      this.internal_items=x;
      this.items = this.internal_items;
    });
  }
}