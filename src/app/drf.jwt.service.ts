import { Injectable, NgZone, EventEmitter } from '@angular/core';
import { Router, CanActivate } from '@angular/router';

import { HTTP_PROVIDERS, Http, Response, Request, RequestMethod, Headers } from '@angular/http';

import { AuthHttp, tokenNotExpired } from 'angular2-jwt';

import {DRFResourceServiceBase} from './drf.service';

import { BehaviorSubject  }    from 'rxjs/BehaviorSubject';

/**
 * Provides the base Authentication Service functionalities
 */
export interface IAuthService {
    login(user: string, pass: string);
    authenticated(): boolean | Promise<boolean>;
    refresh();
    logout(user: string);
}

/**
 * Implements the base authentication service. To be extended in specialized situations.
 */
@Injectable()
export abstract class AuthService extends DRFResourceServiceBase implements IAuthService {
    constructor(authHttp: AuthHttp) {
        super(authHttp);
    }

    abstract login(user: string, pass: string);
    abstract logout(user: string);
    abstract authenticated(): boolean | Promise<boolean>;
    abstract refresh();
}

@Injectable()
export class JWTAuthService extends AuthService {
    refreshSubscription: any;
    user: Object;
    zoneImpl: NgZone;
    authHttp: AuthHttp;
    http: Http;
    router: Router;

    constructor(authHttp: AuthHttp, http: Http, zone: NgZone, router: Router) {
        super(authHttp)

        this.authHttp = authHttp;
        this.zoneImpl = zone;
        this.router = router;
        this.http = http;

        this.user = localStorage.getItem('id_token');
        this.setUserName(localStorage.getItem("username"));
        this.setUserType(localStorage.getItem("user_type"));
        this.setIsAdmin(localStorage.getItem("is_admin"));
        this.setIsAdmin(localStorage.getItem("user_id"));
    }

    private loggedInSource: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(localStorage.getItem("id_token") != null);

    public loggedIn = this.loggedInSource.asObservable();

    public user_name
    public user_type
    public is_admin
    public user_id

    get is_loggedin():boolean{
        return localStorage.getItem('id_token') != ""; 
    }

    setUserName(username: string) {
        this.user_name = username;
    }

    setUserType(usertype: string) {
        this.user_type = usertype;
    }

    setIsAdmin(is_admin: boolean) {
        this.is_admin = is_admin;
    }

    setUserID(user_id: string) {
        this.user_id = user_id;
    }

    login(user: string, pass: string, error:Function) {
        let headers = new Headers();
        headers.append('Accept', 'application/json');
        headers.append('Content-Type', 'application/json');
        //headers.append('X-CSRFToken', this.getCookie('csrftoken'));
        let auth = { "username": user, "password": pass };
        return this.http.post(this._base_url + "/api-token-auth/", JSON.stringify(auth), { headers: headers })
            .toPromise()
            .then(res => {
                let data = res.json();
                let token = data.token;
                localStorage.setItem("id_token", token);
                localStorage.setItem("username", data.user);
                localStorage.setItem("user_id", data.id);
                this.setUserName(data.user);
                this.setUserID(data.id);
                console.log(data);

                try {
                    localStorage.setItem("user_type", data.type);
                } catch (e) {
                    localStorage.setItem("user_type", "admin");
                }
                this.setUserType(data.type);

                try {
                    localStorage.setItem("is_admin", data.is_admin);
                } catch (e) {
                    localStorage.setItem("is_admin", "false");
                }
                this.setIsAdmin(localStorage.getItem("is_admin"));

                this.is_admin = localStorage.getItem('is_admin');
                this.user_name = localStorage.getItem("username");
                this.user_type = localStorage.getItem("user_type");

                this.loggedInSource.next(true);
                return;
            }, err =>{
                error(err.json().non_field_errors[0]);
            });
            
    }

    authenticated() {
        let headers = new Headers();
        headers.append('Accept', 'application/json');
        headers.append('Content-Type', 'application/json');
        this.user = localStorage.getItem('id_token');
        return this.http.post(this._base_url + "/api-token-verify/", JSON.stringify(this.user), { headers: headers })
            .toPromise()
            .then(function (res) {
                return true;
            })
            .catch(function (er) {
                return false;
            });
    }

    

    refresh() {
        let headers = new Headers();
        headers.append('Accept', 'application/json');
        headers.append('Content-Type', 'application/json');
        this.user = localStorage.getItem('id_token');
        return this.http.post(this._base_url + "/api-token-refresh/", JSON.stringify(this.user), { headers: headers })
            .toPromise()
            .then(function (res) {
                let token = res.json().token;
                localStorage.setItem("id_token", token);
                return;
            })
            .catch(this.handleError);
    }

    logout() {
        localStorage.removeItem('id_token');
        localStorage.removeItem('is_admin');
        localStorage.removeItem("username");
        localStorage.removeItem("user_type");

        this.user = "";
        this.is_admin = false;
        this.user_name = "";
        this.user_type = "";

        this.loggedInSource.next(false);
    }
}