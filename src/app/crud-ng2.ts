import { HTTP_PROVIDERS, Http, Response, Request, RequestMethod, Headers } from '@angular/http';
//import { Http, tokenNotExpired } from 'angular2-jwt';
import { Observable }     from 'rxjs/Observable';
import 'rxjs/add/operator/toPromise';

export interface ICRUDServiceBase{
  setBaseUrl(url:string);
  handleError(error: Response);
}

export abstract class CRUDServiceBase implements ICRUDServiceBase{

  protected _base_url = "";
  protected _res_url:string;
  
  constructor(http:Http){}

  public setBaseUrl(base:string){
    this._base_url = base;
    this._res_url = base;
  }

  protected serializeParams(obj) {
    let str = [];
    for(let p in obj)
       str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
    return str.join("&");
  }

  protected getCookie(name) {
    let value = "; " + document.cookie;
    let parts = value.split("; " + name + "=");
    if (parts.length == 2) {
      return parts.pop().split(";").shift();
    }
  }
  public handleError(error: Response) {
    console.error(error);
    return Observable.throw(error.json() || 'Server error');
  }

}

export interface ICRUDResourceServiceBase extends ICRUDServiceBase{
  setSpecUrl(url:string);
}

export abstract class CRUDResourceServiceBase extends CRUDServiceBase implements ICRUDResourceServiceBase{
  constructor(http:Http){
    super(http);
  }

  public setSpecUrl(spec:string){
    this._spec_url = spec;
    this._res_url = this._base_url+this._spec_url;
  }

  protected _spec_url:string = "";  
  
}

export interface IGenericCRUDService<T> extends ICRUDResourceServiceBase{
   getAll(params:any):Promise<T[]>;
   getOne(id:number):Promise<T>;
   getOptions();

   removeOne(id:number);
   addOne(item:T, error:Function);
}

export interface ICRUDService extends ICRUDResourceServiceBase{
   getAll(params:any):Promise<any>;
   getOne(id:number):Promise<any>;
   getOptions();

   removeOne(id:number);
   addOne(item:any, error:Function);
}
