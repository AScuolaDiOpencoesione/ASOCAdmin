
import { Component, Input, EventEmitter, AfterViewInit,AfterViewChecked } from '@angular/core';
import { DRFServiceComponent} from './drf.component';

import { ActivatedRoute, Router } from '@angular/router';
import { BackendManagerService } from '../backend-manager.service';

declare var $;

@Component({
  templateUrl:"./form.component.html",
  directives:[],
  providers:[BackendManagerService]
})
export class DRFNewComponent extends DRFServiceComponent implements AfterViewChecked{
  public fields:Object[] = [];

  public name:string;
  private description:string;
  private sections:any = {};
  private ret_sections:any = [];
  private activeSection:string;
  private pre_fields:any = {};
  private selected_values:any = {};
  private loaded_files:any = {};
  private loaded_files_a:any = {};
  
  private dependencies:any = {};
  private dependencies_inv:any = {};
  private dirty_vals:any = {};

  private chains:any = {};

  public done:EventEmitter<any> = new EventEmitter<any>();

  public server_errors:any = {};

  constructor(private route: ActivatedRoute, private router: Router, private bms:BackendManagerService){
    super();
    this.setRoute(this.route);
  }
  
  ngOnInit(){
    this.setConfig(this._route.snapshot.data);
    this.setService(this.bms.setActiveSpace("").setActiveApp(this.config.datasource));
    this.prepare();
  }

  prepare(params:any=null){
    return new Promise((resolve,reject)=>{  
      this.getFields(params).then(()=>resolve());
    });
  }

  postSave(item:any){
  }

  protected getFields(params:any={}){
    return new Promise((resolve, reject) => {
      this._service.getOptions().then(v => {
        this.name = v.name; 
        this.description = v.description;
        this.sections = v.datasections;
        this.activeSection = this.startSection();
        this.getSections();  
        this.dependencies = v.conditions;
        for (var j in this.dependencies){
          let x = this.dependencies[j];
          for (let y in x.toggles)
            this.dependencies_inv[x.toggles[y]] = j;
        }
        //console.log(this.dependencies, this.dependencies_inv);
        this.chains = v.chains;
        this.pre_fields = v.actions.POST;
        v = v.actions.POST;
        let old_name = "";
        let number = 1;
        for (let x in v){
          if(!v[x].read_only){
            var t = v[x];
            t["name"] = x;
            if (params != null)
              if(params.hasOwnProperty(x)) 
                t["value"] = params[x]; 
            if (this.sections != {}){
              for(let j in this.sections){
                if (this.sections[j].fields.indexOf(x) >= 0){
                  t["section"] = j; 
                }
              }
            }
            if(t["label"] != " "){
              t["index"] = number;
              number++;
            } else {
              t["index"] = "";
            }
            if(Object.keys(t).indexOf("choices")){
              for (let l in t.choices){
                let c = t.choices[l];
                let a = c.additionals;
                let str = "";
                for(let w in Object.keys(a)){
                  let ww = Object.keys(a)[w];
                  str += ww + "::" + a[ww] + " ";
                }
                c.reldata = str;
              }
            }
              
            this.fields.push(t);
          }
        }
      });
      resolve();
    })
  }

  public startSection(){
    if (this.sections != {})
      return Object.keys(this.sections)[0];
    return "";
  }

  public hasSections(){
    return Object.keys(this.sections).length > 0;
  }

  public errormsg(name:string){
    return Object.keys(this.server_errors).indexOf(name) >= 0;
  }

  public sectionKeys(){
    return Object.keys(this.sections);
  }

  public sectionIndex(sec:string){
    return Object.keys(this.sections).indexOf(sec);
  }
  public sectionLast(sec:string){
    let a = Object.keys(this.sections);
    return (a.indexOf(sec)+1) == a.length;
  }

  isVisible(sec){
    return this.activeSection == sec;
  }

  isVisibleStack(sec){
    let x = this.sectionIndex(this.activeSection);
    let t = this.sectionIndex(sec);
    return t<=x;
  }

  isItemVisible(item:any){
    let sv = this.isVisible(item.section);
    let pv = this.hiddenForConditions(item.name);
    //console.log(pv);
    return sv && !pv;
  }

  public stepsCount(){
    return Object.keys(this.sections).length;
  }


  public prevSection(sec:string){
    let n = this.sectionIndex(sec);
    let x = Object.keys(this.sections)[n-1];
    return x;
  }
  public nextSection(sec:string){
    let n = this.sectionIndex(sec);
    let x =  Object.keys(this.sections)[n+1];
    return x;
  }

  save(item:any){
      this._service.addOne(item)
                   .then(x => {this.postSave(x); })
                   .catch(err => {this.handle_error(err); });
  }

  getSections(){
    this.ret_sections = [];
    for (let s in this.sections){
      let ss = this.sections[s];
      ss["sn"] = s;
      this.ret_sections.push(ss);
    }
  }

  handle_error(err){
    let e = JSON.parse(err._body);
    let s = Object.keys(this.server_errors);
    for (let i in s)
      delete this.server_errors[i];
    for (let i in e)
      this.server_errors[i] = e[i];
  }

  getBaseFields(){
    return {};
  }

  submitData(event){
      var s = this.getBaseFields();
      for (let f of event.target.form){
        for (let x of this.fields){
          if (f.name == x["name"]){
            switch (this.pre_fields[f.name].type){
              case "boolean":
                if (f.checked)
                  s[f.name] = eval(f.value);
              break;
              case "multiple choice":
                s[f.name] = this.selected_values[f.name];
              break;
              case "file upload":
                s[f.name] = this.loaded_files_a[f.name];
              break;
              default:
                s[f.name] = f.value==""?null:f.value;
            }
          }
        }
      }
      var a_s = <any>s;
      console.log(a_s);
      this.save(a_s);
  }

  setSelected(selectedelement, name){
    if (Object.keys(this.selected_values).indexOf(name) < 0)
      this.selected_values[name] = [];
    if (selectedelement.target.checked)
      this.selected_values[name].push(selectedelement.target.value);
  }

  hiddenForConditions(name){
    let dv = Object.keys(this.dirty_vals);
    let hk = Object.keys(this.dependencies_inv);

    let to_check = "";
    //console.log(name, dv, hk);
    if (hk.indexOf(name)>=0){
      if(this.dependencies[this.dependencies_inv[name]].for_value)
        to_check = this.dependencies[this.dependencies_inv[name]].for_value;
      if(dv.indexOf(this.dependencies_inv[name])>=0){
        if(to_check != ""){
          if(this.dirty_vals[this.dependencies_inv[name]].indexOf(to_check)>=0)
            return false;
        } else {
          if(this.dirty_vals[this.dependencies_inv[name]].indexOf(to_check)<0)
            return false;
        }
      }
      return true;
    }
    return false;
  }

  watchDependents(event, name){
    let tt = event.target.type;
    let tv = event.target.value;
    let ml = 1 
    if (tt=="checkbox"){
      tv = event.target.checked?event.target.value:"";
      ml = -1;
    }
    if (Object.keys(this.dirty_vals).indexOf(name)<0)
      this.dirty_vals[name] = []
    if(ml > 0)  
      this.dirty_vals[name] = [tv];
    else
      if (tv == "")
        this.dirty_vals[name] = this.removeItemFromArray(this.dirty_vals[name], event.target.value);
      else 
        this.dirty_vals[name].push(tv);     
  }

  removeItemFromArray(array, item){
    var tmp = [];
    for(var index in array){
      if(array[index] !== item){
        tmp.push(item);
      }
    }
    return tmp;
  }

  loadFile(event, name){
    this.loaded_files[name] = event.target.files[0];
    this.loaded_files_a[name] = {"filename":event.target.files[0].name}
    let fr = new FileReader();
    fr.onloadend = (e => {
      console.log(e);
      this.loaded_files_a[name]["content"] = e.target.result.split(",")[1];
      // e.target.result should contain the text
    });
    fr.readAsDataURL(this.loaded_files[name]);
  }

  setActive(sec:string){
    window.scrollTo(0, 0);
    window.document.getElementById("scrollable").scrollTop=0;
    this.activeSection = sec;
  }

   ngAfterViewChecked(){
     $('#sectionator').appendTo("sidebar");
  }

  ngOnDestroy(){
     $('#sectionator').remove();
  }
  
  targetOptions:any = {};
  
  isOptionVisible(item:string="", value:string, additionals:any){
    let x = this.chains[item];
    if (x) {
      //console.log(item, value, additionals);
      return additionals[x.filter.item] == this.dirty_vals[x.filter.field];
    } else 
    return true;
  }

}