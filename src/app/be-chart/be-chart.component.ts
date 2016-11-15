import { Component, Input,  OnInit } from '@angular/core';

@Component({
  selector: '[be-chart]',
  templateUrl: './be-chart.component.html',
  styleUrls: ['./be-chart.component.css']
})
export class BeChartComponent implements OnInit {

  @Input() conf:any;
  
  data:any;
  options:any;
  
  constructor() { 
    
  }

  ngOnInit() {
    console.log(this.conf);
    let randomArray = (length, max) => [...new Array(length)]
    .map((_, i) => Math.round(Math.random() * max));
    
    let rarr = randomArray(7,50);
    let surarr =  []
    let sum = 0;
    for (let x of rarr){
        sum += x;
        surarr.push(sum);
    }
      this.data = {
            labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December' ],
            datasets: [
                {
                    label: 'Mese singolo',
                    borderColor: '#1E88E5',
                    fill: false,
                    tension: 0,
                    borderWidth:1,
                    data: rarr
                },
                {
                    label: 'Cumulativo',
                    borderColor: '#7CB342',
                    fill: false,
                    tension: 0,
                    borderWidth:1,
                    data: surarr
                }
            ]
      }
      
      this.options = {
            
            elements: {
                tension: 0,
                borderWidth:1,
                
            }
        };
  }

}
