import { Injectable, NgZone } from '@angular/core';
import { HTTP_PROVIDERS, Http, Response, Request, RequestMethod, Headers } from '@angular/http';
import { Observable }     from 'rxjs/Observable';
import { Router, CanActivate } from '@angular/router';
//import { crudDataSource } from "crud-ng2";
import 'rxjs/add/operator/toPromise';

//import { AuthHttp, tokenNotExpired } from 'angular2-jwt';

import {IDRFService, DRFService, UserService} from "./drf.service";
import {JWTAuthService} from "./drf.jwt.service";

//@crudDataSource("becloud")
@Injectable()
export class BeCloudService extends DRFService{
    constructor (http: AuthHttp, baseconfig:any, resource:string){
        super(http);
        this.setBaseUrl("http://www.cityopensource.com:9087");
    }
}

@Injectable()
export class BeCloudAuthService extends JWTAuthService{
    constructor(authHttp:AuthHttp, http:Http, zone: NgZone, router: Router){
        super(authHttp, http, zone, router);
        this.setBaseUrl("http://www.cityopensource.com:9087");
        this.setSpecUrl("/api-token-auth/");
    }
}

@Injectable()
export class BeCloudUserService extends UserService{
    constructor(authHttp:AuthHttp, http:Http, zone: NgZone, router: Router){
        super(authHttp, http);
        this.setBaseUrl("http://www.cityopensource.com:9087/auth");
    }
}



