import { Component, OnInit } from '@angular/core';
import { BackendManagerService } from '../backend-manager.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { GlobalFilterService } from '../global-filter.service';
import {Observable} from 'rxjs/Observable';

@Component({
  selector: '[asoc-blogscuole]',
  templateUrl: './asoc-blogscuole.component.html',
  styleUrls: ['./asoc-blogscuole.component.css'],
  providers: [BackendManagerService]
})
export class AsocBlogscuoleComponent implements OnInit {
  
  private regions;
  private provinces;
  private sections;
  private schools;
  private test;
  private topics;
  private years;
  
  private section = 1;
  
  
  
  constructor(private bms:BackendManagerService, private route: ActivatedRoute, private router: Router) { }

  idAnnata;
  idTeam;
  idPost;

  teams;
  teamreports;
  reports;
  
  
  ngOnInit() {
     this.bms.setActiveSpace("").setActiveApp("region").getAll().then(x=>{
      this.regions=x;
    });
     this.bms.setActiveSpace("").setActiveApp("core/section").getAll().then(x=>{
      this.years=x;
    });
    this.bms.setActiveSpace("").setActiveApp("province").getAll().then(x=>{
      this.provinces=x;
    });
    this.bms.setActiveSpace("").setActiveApp("partner/school").getAll().then(x=>{
      this.schools=x;
    });
    this.bms.setActiveSpace("").setPaged(false).setActiveApp("octopic").getAll().then(x=>{
      this.topics=x;
    });
    this.bms.setActiveSpace("").setActiveApp("meta/asocform").getAll().then(x=>{
      this.sections=x;
    });
    
    
    this.route.params.forEach((params: Params) => {
      this.idAnnata = +params['idAnnata']; // (+) converts string 'id' to a number
      console.log(this.idAnnata,this.idTeam,this.idPost);
      this.idTeam = +params['idTeam']; // (+) converts string 'id' to a number
      console.log(this.idAnnata,this.idTeam,this.idPost);
      this.idPost = +params['idPost']; // (+) converts string 'id' to a number
      console.log(this.idAnnata,this.idTeam,this.idPost);
    });
    
    this.bms.setActiveSpace("").setActiveApp("team").getAll({section:this.section}).then(x=>{
      this.teams = x;
    });
    
    this.bms.setActiveSpace("").setActiveApp("meta/compiledform").getAll({section:this.section}).then(x=>{
      this.reports = x["results"];
    });
  }
}


@Component({
  selector: '[asoc-blogscuole-year]',
  templateUrl: './asoc-blogscuole.component.html',
  styleUrls: ['./asoc-blogscuole.component.css'],
  providers: [BackendManagerService]
})
export class AsocBlogscuoleAnnataComponent implements OnInit {

  private regions;
  private provinces;
  private sections;
  private test;
  
  private section = 1;
  
  
  idAnnata;
  idTeam;
  idPost;

  teams;
  teamreports;
  reports;
  constructor(private bms:BackendManagerService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
     this.bms.setActiveSpace("").setActiveApp("region").getAll().then(x=>{
      this.regions=x;
    });
    this.bms.setActiveSpace("").setActiveApp("province").getAll().then(x=>{
      this.provinces=x;
    });
    this.bms.setActiveSpace("").setActiveApp("meta/asocform").getAll().then(x=>{
      this.sections=x;
    });
    
    this.route.params.forEach((params: Params) => {
      this.idAnnata = +params['idAnnata']; // (+) converts string 'id' to a number
      console.log(this.idAnnata,this.idTeam,this.idPost);
      this.idTeam = +params['idTeam']; // (+) converts string 'id' to a number
      console.log(this.idAnnata,this.idTeam,this.idPost);
      this.idPost = +params['idPost']; // (+) converts string 'id' to a number
      console.log(this.idAnnata,this.idTeam,this.idPost);
    });
    
  }

}


@Component({
  selector: '[asoc-blogscuole-team]',
  templateUrl: './asoc-blogscuole.detail.component.html',
  styleUrls: ['./asoc-blogscuole.component.css'],
  providers: [BackendManagerService]
})
export class AsocBlogscuoleAnnataTeamscuolaComponent implements OnInit {

  private regions;
  private provinces;
  private sections;
  private test;
  
  private section = 1;
  
  
  idAnnata;
  idTeam;

  teams;
  teamreports;
  reports;
  
  
  ts;
  
  constructor(private bms:BackendManagerService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    
    this.route.params.forEach((params: Params) => {
      this.idAnnata = +params['idAnnata'];
      this.idTeam = +params['idTeam'];
    });
      this.bms.setActiveSpace("").setActiveApp("team").getOne(this.idTeam).then(x=>{
        this.ts = x;
        this.bms.setActiveSpace("").setActiveApp("teamprofile").getAll({school:x["school"]}).then(y=>{
          let user = y[0]["user"];
          this.bms.setActiveSpace("").setActiveApp("meta/compiledform").setPaged(true).getAll({author:user}).then(z=>{
            console.log(z);
            this.reports = z;
          });
        });
      });
    
  }
}


@Component({
  selector: '[asoc-blogscuole-post]',
  templateUrl: './asoc-blogscuole.report.component.html',
  styleUrls: ['./asoc-blogscuole.component.css'],
  providers: [BackendManagerService]
})
export class AsocBlogscuoleAnnataTeamscuolaPostComponent implements OnInit {

  private regions;
  private provinces;
  private sections;
  private test;
  
  private years;
  private cities;
  private schools;
  private topics;
  
  private section = 1;
  
  
  idAnnata;
  idTeam;
  idPost;

  ts;

  report;
  constructor(private bms:BackendManagerService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    this.route.params.forEach((params: Params) => {
      this.idAnnata = +params['idAnnata']; // (+) converts string 'id' to a number
      this.idTeam = +params['idTeam']; // (+) converts string 'id' to a number
      this.idPost = +params['idPost']; // (+) converts string 'id' to a number
    });
    this.bms.setActiveSpace("").setActiveApp("team").getOne(this.idTeam).then(x=>{
      this.ts = x;
    });
    this.bms.setActiveSpace("").setActiveApp("meta/compiledform").setPaged(true).getOne(this.idPost).then(z=>{
      console.log(z);
      this.report = z;
    });
  }
  
  getReportValueFor(field:any, index:number=0){
    let v = "";
    for(let f of this.report.fields){
      //console.log(field, index, f);
      if (field.id == f.field)
        v = f.value;
        break;
    }
    return this.renderField(field, v);
  }
  
  
  renderField(field, value){
    return value;
  }

}
