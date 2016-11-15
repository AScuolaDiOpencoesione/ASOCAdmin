import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: '[be-graph]',
  templateUrl: './be-graph.component.html',
  styleUrls: ['./be-graph.component.css']
})
export class BeGraphComponent implements OnInit {

  @Input() conf:any;
  constructor() { }

  ngOnInit() {
  }

}
