import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BeMapComponent } from "../be-map/be-map.component";
import { BeCardComponent } from "../be-card/be-card.component";
import { BeChartComponent } from "../be-chart/be-chart.component";
import { BeTableComponent } from "../be-table/be-table.component";
import { BeListComponent } from "../be-list/be-list.component";
import { BeCalendarComponent } from "../be-calendar/be-calendar.component";
import { BackendManagerService } from '../backend-manager.service';

@Component({
  selector: 'app-be-dashpage',
  templateUrl: './be-dashpage.component.html',
  styleUrls: ['./be-dashpage.component.css'],
  directives:[BeMapComponent, BeCardComponent, BeChartComponent, BeTableComponent, BeListComponent, BeCalendarComponent],
  providers:[BackendManagerService]
  
})
export class BeDashpageComponent implements OnInit {

  grid_unit:number = 65;
  grid_gutter:number = 5;
  
  visible_widgets:any = {};
  
  sub:any;
  
  widgets:any = []; 
  ss;

  constructor(private route: ActivatedRoute, private bms:BackendManagerService) {
    this.ss = route.snapshot;
  }


  isVisible(widget:string){
    return this.visible_widgets[widget];
  }

  data;

  ngOnInit() {
    console.log("route", this.ss.data);
    this.widgets = this.ss.data["components"];
    for (let w of this.widgets)
      this.visible_widgets[w["name"]] = w["toggle"] != undefined;
      
    this.bms.setActiveSpace("").setActiveApp("dashboard").getAll().then(x=>{
      this.data = x;
      for (let w of this.widgets){
        let d = w["datasource"];
        w["value"] = this.data[d];
      }
    });
  }

  ngOnDestroy() {
    
  }
  
  private getSize(u:number){
    if (u > 0)
      return u*this.grid_unit+(u-1)*2*this.grid_gutter;
    return 0;
  }
  
  datasets:any = {};
  
  prepareServiceData(){
    for(let w of this.widgets){
      if (w["type"]== "card"){
        this.datasets[w["name"]+"__v"] = {
          "datasource":w["datasource"],
          "dataspace":w["dataspace"],
          "operation":w["value"],
          "filter":w["filter"]
        }
        
        this.datasets[w["name"]+"__v1"] = {
          "datasource":w["datasource"],
          "dataspace":w["dataspace"],
          "operation":w["value"],
          "filter":w["filter"]
        }
        
        this.datasets[w["name"]+"__v2"] = {
          "datasource":w["datasource"],
          "dataspace":w["dataspace"],
          "operation":w["value"],
          "filter":w["filter"]
        }
      }
    }
  }

}