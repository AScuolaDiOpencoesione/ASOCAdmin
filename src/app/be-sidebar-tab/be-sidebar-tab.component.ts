import { Component, Input } from '@angular/core';

@Component({
  selector: '[sidebar-tab]',
  templateUrl: './be-sidebar-tab.component.html',
  styleUrls: ['./be-sidebar-tab.component.css']
})
export class BeSidebarTabComponent {

  @Input() tab:any;
  
  open:boolean = false;

  constructor() { }



  toggleContent(event, tab){
    this.open = !this.open;
  }


}
