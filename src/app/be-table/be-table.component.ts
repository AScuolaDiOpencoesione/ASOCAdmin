import { Component, Input, OnInit } from '@angular/core';

/*
"name":"preventivi",
"label":"Ultimi Preventivi",
"width":8,
"height":4,
"type":"table",
"datasource":"it.beinternet.preventivo",
"limit":10
*/

let temp:any = {};

@Component({
  selector: '[be-table]',
  templateUrl: './be-table.component.html',
  styleUrls: ['./be-table.component.css'],
})
export class BeTableComponent {

  @Input() conf:any;
  
  cols:any = [];
  items = [];
  
  constructor() { 
   
  }

  ngOnChanges() {
    this.cols = this.conf["cols"];
  }

}
