import { ActivatedRoute  }       from '@angular/router';


export interface DRFGenericServiceSetter<T>{
  setService<T>(service:T);
}

export interface DRFRouteSetter{
  setRoute(route:ActivatedRoute);
}

export abstract class DRFGenericServiceComponent<T> implements DRFGenericServiceSetter<T>, DRFRouteSetter{
  protected _service:T;
  protected _route:ActivatedRoute ;

  setService(service:T){
    this._service = service;
  }

  setRoute(route:ActivatedRoute ){
    this._route = route;
  }

  abstract prepare();

}

export interface DRFServiceSetter{
  setService(service);
}

export abstract class DRFServiceComponent implements DRFServiceSetter, DRFRouteSetter{
  protected config:any;
  protected _service;
  protected _route:ActivatedRoute;
  
  setService(service){
    this._service = service;
  }
  
  setConfig(config){
    this.config = config;
  }
  
  setRoute(route:ActivatedRoute){
    this._route = route;
  }
  
  abstract prepare()
}