import { Component, OnInit, Input, Directive, Pipe, PipeTransform } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BackendManagerService } from '../backend-manager.service';

@Pipe({
  name: 'ashtml'
})
export class AsHtml implements PipeTransform {
  transform(value: string): string {
    let r = JSON.parse(value);
    console.log(r);
    let ret = "";
    for (let m of r["metas"]){
      let k = Object.keys(m)[0];
      if (k == "la_ricerca_in_140_caratteri")
        ret+=m[k];
    }
    return ret;
  }
}

@Component({
  selector:"[display-report]",
  templateUrl: './display-report.component.html'
})
export class DisplayReport{
  @Input() report:any;
  parsedReport:any;
  
  keys:string[];
  
  constructor(){
    console.log(this.report);
    this.parsedReport = JSON.parse(this.report.raw);
    if(this.parsedReport["metas"] != null)
    this.keys= Object.keys(this.parsedReport.metas);
    
  }
  
}

@Component({
  selector: '[asoc-report]',
  templateUrl: './asoc-report.component.html',
  styleUrls: ['./asoc-report.component.css'],
  directives:[DisplayReport],
  pipes:[AsHtml],
  providers:[BackendManagerService] 
})
export class AsocReportComponent implements OnInit {

  @Input() section:number = 2;
  @Input() form:number;
  
  total:number;
  current_page:number = 1;
  
  config;
  sub;
  data:any[] = [];

  private regions:any[] = [];
  private provinces:any[] = [];
  private sections:any[] = [];
  private test:any[] = [];
  private years:any[] = [];
  private cities:any[] = [];
  private schools:any[] = [];
  private topics:any[] = [];
  
  private forms = [];
  
  private f_regions:any[] = [];
  private f_provinces:any[] = [];
  private f_sections:any[] = [];
  private f_test:any[] = [];
  private f_years:any[] = [];
  private f_cities:any[] = [];
  private f_schools:any[] = [];
  private f_topics:any[] = [];
  
  constructor(private bms:BackendManagerService, private route: ActivatedRoute){ }
  
  ngOnInit() {
    console.log(this.route.snapshot.data)
    this.config = this.route.snapshot.data;
    this.sub = this.route.params.subscribe(params => {
       this.current_page=1;
       this.prepare();
     });
  }
  
  prepare(){
    this.bms.setActiveSpace("").setActiveApp("core/section").getAll().then(x=>{
      this.years = x;
    });
    this.bms.setActiveSpace("").setActiveApp("region").getAll().then(x=>{
      this.regions=x;
    });
    this.bms.setActiveSpace("").setActiveApp("province").getAll().then(x=>{
      this.provinces=x;
    });
    this.bms.setActiveSpace("").setActiveApp("partner/school").getAll().then(x=>{
      this.schools=x;
    });
    this.bms.setActiveSpace("").setActiveApp("octopic").getAll().then(x=>{
      this.topics=x;
    });
    this.bms.setActiveSpace("").setActiveApp("meta/asocform").getAll().then(x=>{
      this.forms=x;
    });
    this.getData();
  }
  
  getData(){
    this.bms.setActiveSpace("").setActiveApp("extract").getAll({"filters":JSON.stringify({}),"cols":JSON.stringify([])}).then(x=>{
      this.data = x["results"];
      this.total = x["count"];
    }); 
  }     

  onChange(newValue) {
    console.log(newValue);
    this.section = newValue;
    this.getData();
  }
  
  nextPage(){
    this.current_page++;
    this.getData();
  }
  
  prevPage(){
    this.current_page = Math.max(this.current_page-1, 1);
    this.getData();
  }

}
