import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';

/*
  Generated class for the MapServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class MapServiceProvider {
  ObjectSrc;
  ObjectDes;
  ObjectRes
  constructor(public http: Http) {
    console.log('Hello MapServiceProvider Provider');
  }
  destroy(){
    this.ObjectSrc = null;
    this.ObjectDes = null;
  }
  setSrc(par){
    this.ObjectSrc = par;
  }
  setDes(par){
    this.ObjectDes = par;
  }
  setRes(par){
    this.ObjectRes = par;
  }

}
