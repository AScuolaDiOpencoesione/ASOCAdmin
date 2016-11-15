import { Component, OnInit, trigger, state, style, transition, animate } from '@angular/core';
import { GlobalConfigurationService } from '../global-configuration.service';
import { BeSidebarTabComponent } from '../be-sidebar-tab/be-sidebar-tab.component';
import { GlobalFilterService } from '../global-filter.service';






@Component({
  selector: '[sidebar]',
  templateUrl: './be-sidebar.component.html',
  styleUrls: ['./be-sidebar.component.css'],
  providers: [GlobalConfigurationService, GlobalFilterService],
  directives: [BeSidebarTabComponent],
})
export class BeSidebarComponent {
    private head:string = "http://www.ascom.bo.it/flex/TemplatesUSR/assets/img/70-Confcommercio.png";
    private title:string = "ASOC ADMIN";
 
private tabs = [{
    "name":"Dashboard",
    "icon":"home",
    "id":"home",
    "tabtype":"custom",
    "start":true,
    "components":[
        {
            "name":"docenti_totali",
            "label":"DOCENTI",
            "color": "#5d8fc2",
            "value":"{{}} ({{}})",
            "icon":"graduation-cap",
            "width":6,
            "height":2,
            "type":"card",
            "datasource":"teacherprofile",
            "mode":"global",
        },{
            "name":"preventivi_mese",
            "label":"EDIC",
            "color": "#c2b35d",
            "value":"{{}} ({{}})",
            "icon":"building",
            "width":6,
            "height":2,
            "type":"card",
            "datasource":"edicprofile",
            "mode":"global",
        },{
            "name":"contratti_totali",
            "label":"ASSOCIAZIONI",
            "color": "#5dc4bf",
            "value":"{{}} ({{}})",
            "icon":"users",
            "width":6,
            "height":2,
            "type":"card",
            "datasource":"it.beinternet.contratto",
            "mode":"global",
        },{
            "name":"candidature",
            "label":"Ultime candidature",
            "width":18,
            "height":6,
            "type":"list",
            "datasource":"applyingteam",
            "limit":10,
        }]
},{
    "name":"Blog Scuole",
    "op_create":false,
    "icon":"log",
    "id":"blog/scuole",
    "tabtype":"component",
    "datasource":"blogscuole",
},{
    "name":"Blog Comunità",
    "op_create":false,
    "icon":"log",
    "id":"blog/community",
    "tabtype":"component",
    "datasource":"blogscuole",
},{
    "name":"Report",
    "op_create":false,
    "icon":"document-o",
    "id":"report",
    "tabtype":"report",
    "datasource":"metaform",
    "reports": [{
        "id": 1,
        "name": "Lezione 1 - Progettare"
    },
    {
        "id": 2,
        "name": "Lezione 2 - Approfondire"
    },
    {
        "id": 3,
        "name": "Lezione 3 - Analizzare"
    },
    {
        "id": 4,
        "name": "Lezione 3 - Evento Open Data Day"
    },
    {
        "id": 5,
        "name": "Lezione 3 - Resoconto Open Data Day"
    },
    {
        "id": 6,
        "name": "Lezione 4 - Esplorare"
    },
    {
        "id": 7,
        "name": "Lezione 5 - Raccontare"
    }]
},{
    "name":"Eventi",
    "op_create":false,
    "icon":"calendar",
    "id":"calendar",
    "tabtype":"admin",
    "list_mode":"table",
    "datasource":"core/events",
},{
    "name":"Scuole",
    "icon":"government",
    "id":"list_tab",
    "tabtype":"admin",
    "list_mode":"table",
    "datasource":"partner/school",
},{
    "name":"Associazioni",
    "icon":"users",
    "id":"list_tab",
    "tabtype":"admin",
    "list_mode":"table",
    "datasource":"partner/association",
},{
    "name":"EDIC",
    "op_create":false,
    "icon":"building",
    "id":"prev_tab",
    "tabtype":"admin",
    "list_mode":"table",
    "datasource":"partner/edic",
    "list_template":"/assets/edic.html",
},{
    "name":"Docenti",
    "op_create":false,
    "icon":"graduation-cap",
    "id":"cont_tab",
    "tabtype":"admin",
    "list_mode":"table",
    "datasource":"profileadmin/teacher",
    "list_template":"/assets/docente.html",
},{
    "name":"Candidature",
    "op_create":false,
    "icon":"file-o",
    "id":"cont_tab",
    "tabtype":"admin",
    "list_mode":"table",
    "datasource":"applyingteam",
}];

    
    constructor(private gc:GlobalConfigurationService) { }
}
