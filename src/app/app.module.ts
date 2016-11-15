import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { BeSidebarComponent } from './be-sidebar/be-sidebar.component';
import { BeNavbarComponent } from './be-navbar/be-navbar.component';
import { BeDashpageComponent } from './be-dashpage/be-dashpage.component';

import { routing, appRoutingProviders } from './app.routing';
import { BeSidebarTabComponent } from './be-sidebar-tab/be-sidebar-tab.component';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { GlobalConfigurationService } from './global-configuration.service';

import { DataTableModule,SharedModule,ChartModule, ScheduleModule, DialogModule, ButtonModule, FieldsetModule } from 'primeng/primeng';
import { DRFNewComponent } from './objectcomponents/new.component';
import { DRFEditComponent } from './objectcomponents/edit.component';
import { DRFListComponent } from './objectcomponents/list.component';
import { DRFDetailComponent } from './objectcomponents/detail.component';

@NgModule({
  declarations: [
    AppComponent,
    BeSidebarComponent,
    BeNavbarComponent,
    BeDashpageComponent,
    BeSidebarTabComponent,
    DRFNewComponent,
    DRFEditComponent,
    DRFListComponent,
    DRFDetailComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    DataTableModule, 
    SharedModule, 
    ChartModule, 
    ScheduleModule, 
    DialogModule, 
    ButtonModule,
    FieldsetModule,
    routing
  ],
  providers: [
    {provide: LocationStrategy, useClass: HashLocationStrategy},
    appRoutingProviders,
    GlobalConfigurationService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
