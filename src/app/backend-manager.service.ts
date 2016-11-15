import { Injectable } from '@angular/core';
import { ICRUDService, CRUDResourceServiceBase } from "./crud-ng2";
import { HTTP_PROVIDERS, Http, Response, Request, RequestMethod, Headers } from '@angular/http';
import { Observable }     from 'rxjs/Observable';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class BackendManagerService extends CRUDResourceServiceBase implements ICRUDService{
  datasources:any = {
    "ContrattiCEDASCOM":{
      "name":"ContrattiCEDASCOM",
      "type":"becloud",
      "token":"cabb6f7d-ef83-4f0c-b4a5-e2554f8ef0d8",
    }
  };

  fields:any = ["it.beinternet.anagrafica", "it.beinternet.preventivo", "it.beinternet.listino", "it.beinternet.contratto"];

  active_space:string;
  active_source:string;
  paged = false;
  headers = new Headers();

  base_url = "";

  constructor(private http:Http){
    super(http);
    this.headers.append('Accept','application/json');
  }
  
  setActiveSpace(space:string):BackendManagerService{
    this.active_space = space;
    this.base_url = "http://api.ascuoladiopencoesione.it/";//+this.active_space+"/"
    //this.headers.append('X-BeCloud', this.datasources[this.active_space]["token"]);
    return this;
  }
  
  setActiveApp(app:string):BackendManagerService{
    this.active_source = app;
    return this;
  }

  setPaged(paged:boolean=false){
    this.paged = paged;
    return this;
  }

  getOptions(){
    console.log("getting options");
    return new Promise((resolve, reject)=>{
      let r_url = this.base_url+this.active_source+"/";
      console.log(r_url);
      this.http.request(new Request({
        method: RequestMethod.Options,
        url: r_url,
        headers: this.headers
        }))
          .toPromise()
          .then(res=>resolve(res.json()))
    });
  }
  getAll(params:any={}):Promise<any>{
    return new Promise((resolve, reject)=>{
      let r_url = this.base_url+this.active_source+"/";
      if (params)
        r_url+="?"+this.encodeData(params);
      console.log(r_url);
      this.http.get(r_url, {headers:this.headers})
          .toPromise()
          .then(res=>{
            let r = res.json();
            if(this.paged)
              r = r["results"];
              
            resolve(r);
          });
    });
  }
  
  addOne(item:any): Promise<any>{
    return new Promise((resolve, reject)=>{
      let headers = new Headers();
      headers.append('Content-Type','application/json');
      headers.append('Accept','application/json');
      let r_url = this.base_url+this.active_source+"/";
      this.http.post(r_url, JSON.stringify(item), {headers:headers})
          .toPromise()
          .then(res=>resolve(res.json()))
    });
  }
  getOne(id:number):Promise<any>{
    return new Promise((resolve, reject)=>{
      let r_url = this.base_url+this.active_source+"/"+id+"/";
      this.http.get(r_url, this.headers)
          .toPromise()
          .then(res=>resolve(res.json()))
    });
  }
  updateOne(item:any){
    return new Promise((resolve, reject)=>{
      let r_url = this.base_url+this.active_source+"/"+item["id"]+"/";
      this.http.put(r_url, JSON.stringify(item), {headers:this.headers})
          .toPromise()
          .then(res=>resolve(res.json()))
    });
  }
  removeOne(id:number){
    
    return new Promise((resolve, reject)=>{
      let r_url = this.base_url+this.active_source+"/";
      this.http.post(r_url, {headers:this.headers})
          .toPromise()
          .then(res=>resolve(res.json()))
    });
  }
  
  encodeData(data) {
    return Object.keys(data).map(function(key) {
        return [key, data[key]].map(encodeURIComponent).join("=");
    }).join("&");
  }   

}
