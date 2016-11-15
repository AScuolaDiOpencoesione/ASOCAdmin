import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class GlobalConfigurationService {
  private filename:string = "config.json";
  private conf:Promise<any> | any = {};
  
  constructor(private http: Http) {}
  
  ngOnInit(){
    console.log("loading configuration");
    this.loadConfigs();
  }

  public loadConfigs(){
    this.http.get(this.filename)
      .toPromise()
      .then(res=>{
        this.conf = res.json()});
  }

  public getConfiguration(variableName:string):any{
    if(Object.keys(this.conf).indexOf(variableName) >= 0)
      return this.conf[variableName];
    else
      return {};
  }
  
}