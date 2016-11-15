import { Component, Input, OnInit } from '@angular/core';

/*

    "name":"preventivi_totali",
    "label":"PREVENTIVI TOTALI",
    "value":"count",
    "label1":"Firmati",            
    "value1":"count",   
    "filter1":"it.beinternet.preventivi:stato=='FIRMATO'",         
    "label2":"%",
    "value2":"percent",
    "icon":"pencil",
    "width":2,
    "height":1,
    "type":"card",
    "datasource":"it.beinternet.preventivo",
    "mode":"global"

*/

@Component({
  selector: '[be-card]',
  templateUrl: './be-card.component.html',
  styleUrls: ['./be-card.component.css']
})
export class BeCardComponent implements OnInit {

  @Input() conf:any;

  constructor() { }

  ngOnInit() {
  }
  
  isHidden(){
    return Object.keys(this.conf).indexOf("toggle") >= 0;
  }

}
