import { MapServiceProvider } from './../../providers/map-service/map-service';
import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the ListDetailsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-list-details',
  templateUrl: 'list-details.html',
})
export class ListDetailsPage {
  ObjectRes
  constructor(public navCtrl: NavController, public navParams: NavParams, public mapRes: MapServiceProvider) {
    this.ObjectRes = this.mapRes.ObjectRes
  }


}
