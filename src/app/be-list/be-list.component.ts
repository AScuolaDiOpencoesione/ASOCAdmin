import { Component, OnInit, Input, SimpleChanges, Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'keys'})
export class KeysPipe implements PipeTransform {
  transform(value, args:string[]) : any {
    let keys = [];
    for (let key in value) {
      keys.push(key);
    }
    return keys;
  }
}

@Component({
  selector: '[be-list]',
  templateUrl: './be-list.component.html',
  styleUrls: ['./be-list.component.css'],
  pipes:[KeysPipe]
})
export class BeListComponent implements OnInit {

  cols:any[];

  @Input() conf:any;
  constructor() { }

  ngOnInit() {
    
  }
  
  ngOnChanges(changes: SimpleChanges){
    if (this.conf["value"] != null)
    this.cols = Object.keys(this.conf["value"][0]);
  }

}
