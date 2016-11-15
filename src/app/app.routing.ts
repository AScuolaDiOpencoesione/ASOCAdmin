import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BeDashpageComponent } from "./be-dashpage/be-dashpage.component";

import { DRFNewComponent } from './objectcomponents/new.component';
import { DRFEditComponent } from './objectcomponents/edit.component';
import { DRFListComponent } from './objectcomponents/list.component';
import { DRFDetailComponent } from './objectcomponents/detail.component';
import { DRFCardListComponent } from "./objectcomponents/cards.component";

import { AsocReportComponent } from './asoc-report/asoc-report.component';
import { AsocBlogscuoleComponent, AsocBlogscuoleAnnataComponent, AsocBlogscuoleAnnataTeamscuolaComponent, AsocBlogscuoleAnnataTeamscuolaPostComponent } from "./asoc-blogscuole/asoc-blogscuole.component";

export const tabs = [{
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
            "width":9,
            "height":2,
            "type":"card",
            "datasource":"teacherprofile",
            "mode":"global",
        },{
            "name":"contratti_totali",
            "label":"CANDIDATURE",
            "color": "#5dc4bf",
            "value":"{{}} ({{}})",
            "icon":"users",
            "width":9,
            "height":2,
            "type":"card",
            "datasource":"applications",
            "mode":"global",
        },{
            "name":"preventivi",
            "label":"Consegna dei report",
            "width":18,
            "height":6,
            "type":"table",
            "cols":[
                {"field":"id","header":"ID"},
                {"field":"team_name","header":"Team"},
                {"field":"docente","header":"Docente"},
                {"field":"lesson_1_form","header":"Lezione 1"},
                {"field":"lesson_2_form","header":"Lezione 2"},
                {"field":"lesson_3_form","header":"Lezione 3"},
                {"field":"lesson_3_form_event","header":"Organizzazione Open Data Day"},
                {"field":"lesson_3_form_post","header":"Resoconto Open Data Day"},
                {"field":"lesson_4_form","header":"Lezione 4"},
                {"field":"lesson_5_form","header":"Lezione 5"}
            ],
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
    "list_template":"/assets/evento.html",
},{
    "name":"Scuole",
    "icon":"government",
    "id":"list_tab",
    "tabtype":"admin",
    "list_mode":"table",
    "datasource":"partner/school",
    "list_template":"/assets/scuola.html",
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
    "list_template":"/assets/candidatura.html",
}];


let generateDashPaths = function(){
  let ret = [];
  for (let t of tabs){
      switch(t.tabtype){
        case "custom":
            ret.push({ path: t["id"], component: BeDashpageComponent, data:t });
            break;
        case "admin":
            if(t["list_mode"]=="table")
                ret.push({ path: t["datasource"], component: DRFListComponent, data:t });
            else 
                ret.push({ path: t["datasource"], component: DRFCardListComponent, data:t });
            ret.push({ path: t["datasource"]+"/new", component: DRFNewComponent , data:t });
            ret.push({ path: t["datasource"]+"/:id", component: DRFEditComponent , data:t });
            ret.push({ path: t["datasource"]+"/:id/edit", component: DRFEditComponent , data:t });
            break;
        case "report":
            ret.push({ path: t["datasource"]+"/:id", component: AsocReportComponent , data:t });
        case "component":
            break;
    }
    if (t["start"])
        ret.push({ path:'', redirectTo: t["id"], pathMatch: 'full'});
  }
  return ret;
}





let dashpaths = generateDashPaths();

const appRoutes: Routes = [
    ...dashpaths,
    {path:"blog/scuole", component:AsocBlogscuoleComponent, data:tabs[1]},
    {path:"blog/scuole/:idAnnata", component:AsocBlogscuoleAnnataComponent, data:tabs[1]},
    {path:"blog/scuole/:idAnnata/:idTeam", component:AsocBlogscuoleAnnataTeamscuolaComponent, data:tabs[1]},
    {path:"blog/scuole/:idAnnata/:idTeam/:idPost", component:AsocBlogscuoleAnnataTeamscuolaPostComponent, data:tabs[1]},
    
];

export const appRoutingProviders: any[] = [
];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);