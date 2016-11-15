import { Injectable }     from '@angular/core';
import { HTTP_PROVIDERS, Http, Response, Request, RequestMethod, Headers } from '@angular/http';
//import { Http, tokenNotExpired } from 'angular2-jwt';
import { Observable }     from 'rxjs/Observable';
import 'rxjs/add/operator/toPromise';
import { IGenericCRUDService, ICRUDService, CRUDResourceServiceBase } from "./crud-ng2";


export interface IGenericDRFService<T> extends IGenericCRUDService<T>{}
export interface IDRFService extends ICRUDService{}

@Injectable()
export abstract class DRFService<T> extends CRUDResourceServiceBase implements IGenericDRFService<T> {
  constructor (protected http: Http) {
    super(http);
    this.http = http;
  }

  protected extractData(res: Response) {
    let body = res.json();
    return body.data || { };
  }
  
  getAll(params=null){
    let headers = new Headers();
    headers.append('Accept','application/json');
    let furl = this._res_url;
    if (params != null)
      furl+="?"+this.serializeParams(params);
    return this.http.get(furl,
                          {headers: headers})
        .toPromise()
        .then(res=><T[]> res.json(), this.handleError)
        .then(items => {
            console.log(items);
            return items;
        })
  }

  getOne (id:number) {
    let headers = new Headers();
    headers.append('Accept','application/json');
    return this.http.get(this._res_url+id+"/",
                          {headers: headers})
      .toPromise()
      .then(res => <T> res.json(), this.handleError)
      .then(item => {
                      console.log(item);
                      return item;
                  });  
  }
  
  getOptions() {
    let headers = new Headers();
    headers.append('Accept','application/json');
    return this.http.request(new Request({
        method: RequestMethod.Options,
        url: this._res_url,
        headers: headers
      }))
      .toPromise()
      .then(res => res.json(), this.handleError)
      .then(options => {
          console.log(options);
          return options;
      }); 
    }

  removeOne(id:number){
    let headers = new Headers();
    headers.append('Accept','application/json');
    return ;
  }

  addOne(item: T, error:Function=null) {
    let headers = new Headers();
    headers.append('Content-Type','application/json');
    headers.append('Accept','application/json');
    headers.append('X-CSRFToken', this.getCookie('csrftoken'));
    return this.http.post(this._res_url, JSON.stringify(item),
                          {headers: headers})
      .toPromise()
      .then(res => res.json(), err=>{
        if (error != null)
          error(err);
      });
  }
}

export class UserService extends CRUDResourceServiceBase{

  noHttp:Http;
  headers = new Headers();

  constructor (protected authHttp: Http, protected http:Http) {
    super(http);
    this.http = http;
    this.noHttp = http;

    
    this.headers.append('Content-Type','application/json');
  }
  getMe(){
    let url = this._base_url+"/me/";
    this.http.get(url, {headers:this.headers})
      .toPromise()
      .then(usr => {
        return usr.json();
      })
      .catch(this.handleError);
  }

  changeUsername(){}

  changePassword(){}

  register(user:string, pass:string, email:string){
    let url = this._base_url+"/register/";
    this.noHttp.post(url, JSON.stringify({"username":user, "password":pass, "email":email}), {headers:this.headers})
      .toPromise()
      .then(content => {
        console.log(content);
      })
      .catch(this.handleError);
  }
  
  activate(uid:string, token:string) {
    let url = this._base_url+"/activate/";
    return this.noHttp.post(url, JSON.stringify({"uid":uid, "token":token}), { headers: this.headers })
      .toPromise()
      .then(content => {
        console.log(content);
      });
    }

  hasProfile(){
    let isnn = localStorage.getItem("user_type") != null;
    let isnu = localStorage.getItem("user_type") != "undefined";
    return isnn && isnu;
  }
}


