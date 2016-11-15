import { Component, OnInit } from '@angular/core';

@Component({
  selector: '[navbar]',
  templateUrl: './be-navbar.component.html',
  styleUrls: ['./be-navbar.component.css']
})
export class BeNavbarComponent {

  private navbaritems = [
    [{
    icon:"menu",
    action:"toggleSidebar"
  }],[{
    icon:"user",
    text:"username",
  }]];

  constructor() { }

}
