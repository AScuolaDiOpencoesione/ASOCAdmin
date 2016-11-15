/// <reference path="../../../typings/leaflet/leaflet.d.ts" />
import { ViewChild, ContentChildren, Component,Directive, AfterViewInit, Input, Output, EventEmitter, QueryList, ElementRef } from '@angular/core';

/**
 * Prepresents the generic layer
 */
export interface LeafLayer{
  getLayer():L.ILayer;
  getName():string;
  isBase():boolean;
}

export abstract class LeafLayerBase implements LeafLayer{
  abstract getLayer():L.ILayer;
  abstract isBase():boolean;

  protected name:string;
  getName():string{
    return this.name;
  }
}

/**
 * Marker for Marker Layer
 * @param lon: Longitude of the marker
 */
@Directive({
  selector: '[marker]',
})
export class Marker{
  @Input() lon:number;
  @Input() lat:number;
  @Input() icon:string;
  @Input() color:string;
  @Input() size:string;

} 

/**
 * Marker Layer 
 * @param lon: Longitude of the marker
 */
@Directive({
  selector: '[markers]',
})
export class MarkerLayer extends LeafLayerBase{
  @Input() name:string;
  @ContentChildren(Marker) dataLayers: QueryList<Marker>;
  getLayer(){
    let l =  new L.FeatureGroup();
    this.dataLayers.forEach(element => {
      l.addLayer(L.marker([element.lat, element.lon]))
    });
    return l;
  }
  isBase(){
    return false;
  }
} 

/**
 * Tile Layer 
 * @param lon: Longitude of the marker
 */
@Directive({
  selector: '[mapboxlayer]',
})
export class MapboxLayer extends LeafLayerBase{
  @Input() name:string;
  @Input() owner:string;
  @Input() id:string;
  @Input() token:string;
  @Input() minzoom:number = 1;
  @Input() maxzoom:number = 20;

  getLayer(){
    let url = "https://api.mapbox.com/styles/v1/"+this.owner+"/"+this.id+"/tiles/256/{z}/{x}/{y}?access_token="+this.token;
    console.log(url);
    let attribution = "";
    return new L.TileLayer(url, {minZoom: this.minzoom, maxZoom: this.maxzoom, attribution: attribution});
  }
  isBase(){
    return true;
  }
} 


/**
 * Tile Layer 
 * @param lon: Longitude of the marker
 */
@Directive({
  selector: '[tilelayer]',
})
export class BaseLayer extends LeafLayerBase{
  @Input() name:string;
  @Input() url:string;
  @Input() attribution:string;
  @Input() minzoom:number = 1;
  @Input() maxzoom:number = 20;

  getLayer(){
    return new L.TileLayer(this.url, {minZoom: this.minzoom, maxZoom: this.maxzoom, attribution: this.attribution});
  }
  isBase(){
    return true;
  }
} 

/**
 * Standard Tile Layer 
 * @param name: one of "osm", "bing", "google", ""
 */
@Directive({
  selector: '[namedlayer]',
})
export class NamedLayer extends LeafLayerBase {
  @Input() layer:string;

  configs = {
    osms:{name:"OpenStreetMap", url:"https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", attribution:"&copy; <a href=\"http://www.openstreetmap.org/copyright\">OpenStreetMap</a> contributors, &copy; <a href=\"https://carto.com/attributions\">CARTO</a>", minzoom:1, maxzoom:19},
    osm:{name:"OpenStreetMap", url:"http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", attribution:"Map data © <a href=\"http://openstreetmap.org\">OpenStreetMap</a> contributors", minzoom:1, maxzoom:19},
    positron:{name:"CartoDB Positron", url:"'http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png'", attribution:"Map data © <a href=\"http://openstreetmap.org\">OpenStreetMap</a> contributors", minzoom:1, maxzoom:19},
    positrons:{name:"CartoDB Positron", url:"'https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png'", attribution:"Map data © <a href=\"http://openstreetmap.org\">OpenStreetMap</a> contributors", minzoom:1, maxzoom:19}
  };

  getLayer(){
    if(this.layer in this.configs){
      let lyr = this.configs[this.layer];
      return new L.TileLayer(lyr.url, {minZoom: lyr.minzoom, maxZoom: lyr.maxzoom, attribution: lyr.attribution});
    }
    return null;
  } 
  isBase(){
    return true;
  }
  getName(){
    if(this.layer in this.configs){
      return this.configs[this.layer].name;
    }
    return "";
  }
} 

@Directive({
  selector: '[datalayer]',
})
export class DataLayer extends LeafLayerBase {
  @Input() type:string;
  @Input() mode:string;
  @Input() src:string;

  getLayer(){
   return null;
  } 
  isBase(){
    return false;
  }
} 


@Component({
  selector: '[be-map]',
  templateUrl: './be-map.component.html',
  styleUrls: ['./be-map.component.css'],
  directives: [BaseLayer, NamedLayer, DataLayer] 
})
export class BeMapComponent implements AfterViewInit {

  private makeid()
  {
      var text = "";
      var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      for( var i=0; i < 5; i++ )
          text += possible.charAt(Math.floor(Math.random() * possible.length));
      return text;
  }
  @Input() conf:any;
  @Input() map_id:string = this.makeid();
  
  @Input() center:number[] = [51.505, -0.09];
  @Input() minzoom:number;
  @Input() maxzoom:number;
  @Input() startzoom:number=13;
  
  @Input() noscroll:boolean=true;
  @Input() height:number=300;

  @ContentChildren(BaseLayer) baseLayers: QueryList<LeafLayer>;
  @ContentChildren(NamedLayer) namedLayers: QueryList<LeafLayer>;
  @ContentChildren(DataLayer) dataLayers: QueryList<LeafLayer>;
  @ContentChildren(MarkerLayer) markerLayers: QueryList<LeafLayer>;
  @ContentChildren(MapboxLayer) mapboxLayers: QueryList<LeafLayer>;

  @Output() click:EventEmitter<any> = new EventEmitter();
  @Output() movestart:EventEmitter<any> = new EventEmitter();
  @Output() moveend:EventEmitter<any> = new EventEmitter();
 
  public map;
  
  layers:Array<LeafLayer> = [];

  private addLayer(layer:LeafLayer){
    this.layers.push(layer);
  }
  
  constructor(private elementRef: ElementRef){}

  protected prepareLayers(){
    this.baseLayers.forEach(element => {
      this.addLayer(element);
    });
	  this.namedLayers.forEach(element => {
      this.addLayer(element);
    });
    this.dataLayers.forEach(element => {
      this.addLayer(element);
    });
    this.markerLayers.forEach(element => {
      this.addLayer(element);
    });
    this.mapboxLayers.forEach(element => {
      this.addLayer(element);
    });
  }

  ngAfterViewInit() {
    this.map = L.map(this.map_id).setView(this.center, this.startzoom);
    
    this.prepareLayers();

    let bls = {};
    let dls = {};

    for(let i in this.layers){
      let l = this.layers[i].getLayer();
      this.map.addLayer(l);
      if(this.layers[i].isBase())
        bls[this.layers[i].getName()] = l;
      else
        dls[this.layers[i].getName()] = l;
    }

    L.control.layers(bls, dls).addTo(this.map);
    
  }

 onEachFeature(feature, layer) {
	var popupContent = "<p>I started out as a GeoJSON " + feature.geometry.type + ", but now I'm a Leaflet vector!</p>";
	if (feature.properties && feature.properties.popupContent) {
		popupContent += feature.properties.popupContent;
	}
	layer.bindPopup(popupContent);
	var label = L.marker(layer.getBounds().getCenter(), {
      icon: L.divIcon({
        className: 'label',
        html: feature.properties.COMUNE,
        iconSize: [100, 40]
      })
    }).addTo(this.map);	
  }
  
  
}

