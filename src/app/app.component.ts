import { Component } from '@angular/core';
import { BeSidebarComponent } from './be-sidebar/be-sidebar.component';
import { BeNavbarComponent } from './be-navbar/be-navbar.component';
import { BeDashpageComponent } from './be-dashpage/be-dashpage.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  directives:[BeNavbarComponent, BeSidebarComponent, BeDashpageComponent]
})
export class AppComponent {
  title = 'app works!';
  
  winheight:number
  winwidth:number;
  
  onWindowLoadOrResize(event){
    this.resize(event.target);
  }
  
  resize(win){
    this.winheight = win.innerHeight-18;
    this.winwidth = win.innerWidth-352;
  }
  
  constructor(){
    this.resize(window);
  }
  
}

