import { ListDetailsPage } from './../list-details/list-details';
import { MapServiceProvider } from './../../providers/map-service/map-service';
import { Component, ViewChild, ElementRef, NgZone } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
declare var google;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  @ViewChild('map') mapElement: ElementRef;
  @ViewChild('directionsPanel') directionsPanel: ElementRef;
  map: any;
  GoogleAutocomplete
  src;
  des;
  ObjectSrc;
  ObjectDes;
  autocompleteItemsSrc
  autocompleteItemsDes
  geocoder
  markers
  directionsService = new google.maps.DirectionsService;
  directionsDisplay = new google.maps.DirectionsRenderer;
  constructor(public navCtrl: NavController, public geolocation: Geolocation, private zone: NgZone, public mapSer: MapServiceProvider, public platform:Platform) {
      this.initData();
      this.mapSer.destroy();
  }
  
  initData(){
    this.GoogleAutocomplete = new google.maps.places.AutocompleteService();
    this.src = '';
    this.des = '';
    this.ObjectSrc = null;
    this.ObjectDes = null;
    this.autocompleteItemsSrc = [];
    this.autocompleteItemsDes = [];
    this.geocoder = new google.maps.Geocoder;
    this.markers = [];
  }
  ionViewDidLoad() {
    //this.loadMap();
    //this.startNavigating();
  }
  ngOnInit() {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.loadMap();
  }
  loadMap() {
    this.geolocation.getCurrentPosition().then((position) => {
      let latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
      //let latLng = new google.maps.LatLng(-34.9290, 138.6010);
      let mapOptions = {
        center: latLng,
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      }

      this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
      this.directionsDisplay.setMap(this.map);
    }, (err) => {
      console.log(err);
    });

  }
  clearMarkers() {
    for (var i = 0; i < Object.keys(this.markers).length; i++) {
      this.markers[i].setMap(null);
    }
    this.markers = []
  }
  //for source
  updateSearchResultsSrc() {
    if (this.src == '') {
      this.autocompleteItemsSrc = [];
      return;
    }
    this.GoogleAutocomplete.getPlacePredictions({ input: this.src, componentRestrictions: {country: 'ID'}},
      (predictions, status) => {
        this.autocompleteItemsSrc = [];
        this.zone.run(() => {
          predictions.forEach((prediction) => {
            this.autocompleteItemsSrc.push(prediction);
          });
        });
      });
  }
  selectSearchResultSrc(item) {
    this.clearMarkers();
    this.src = item.description
    this.ObjectSrc = item;
    this.mapSer.setSrc(item);
    this.autocompleteItemsSrc = [];
    this.geocoder.geocode({ 'placeId': item.place_id }, (results, status) => {
      if (status === 'OK' && results[0]) {
        let position = {
          lat: results[0].geometry.location.lat,
          lng: results[0].geometry.location.lng
        };
        let marker = new google.maps.Marker({
          position: results[0].geometry.location,
          map: this.map,
        });
        this.markers.push(marker);
        this.map.setCenter(results[0].geometry.location);
      }
    });
  
  }

  //for destination
  updateSearchResultsDes() {
    if (this.des == '') {
      this.autocompleteItemsDes = [];
      return;
    }
    this.GoogleAutocomplete.getPlacePredictions({ input: this.des, componentRestrictions: {country: 'ID'}},
      (predictions, status) => {
        this.autocompleteItemsDes = [];
        this.zone.run(() => {
          predictions.forEach((prediction) => {
            this.autocompleteItemsDes.push(prediction);
          });
        });
      });
  }
  selectSearchResultDes(item) {
    this.des = item.description
    this.ObjectDes = item
    this.mapSer.setDes(item);
    this.autocompleteItemsDes = [];

    this.geocoder.geocode({ 'placeId': item.place_id }, (results, status) => {
      if (status === 'OK' && results[0]) {
        let position = {
          lat: results[0].geometry.location.lat,
          lng: results[0].geometry.location.lng
        };
        let marker = new google.maps.Marker({
          position: results[0].geometry.location,
          map: this.map,
        });
        this.markers.push(marker);
        this.map.setCenter(results[0].geometry.location);

        this.calculateAndDisplayRoute(this.src, this.des)
      }
    });
  
  }

  calculateAndDisplayRoute(src, des) {
    this.clearMarkers();
    this.directionsService.route({
      origin: src,
      destination: des,
      travelMode: 'DRIVING'
    }, (response, status) => {
      if (status === 'OK') {
        this.mapSer.setRes(response)
        this.directionsDisplay.setDirections(response);
      } else {
        window.alert('Directions request failed due to ' + status);
      }
    });
  }

  clearDirection(){
    this.directionsDisplay.setMap(null);
  }

  generate(){
    this.navCtrl.push(ListDetailsPage)
    console.log(this.mapSer.ObjectRes)
  }

  //https://maps.googleapis.com/maps/api/directions/json?origin=place_id:ChIJZTvaN7iPaS4RCXUfAXJhffo&destination=place_id:ChIJWeQZ41uOaS4RyR595VbCt2Y&key=AIzaSyA-T2OjooChhPYPJngdizXg6FrLMuDB8YE
  ////For Navigasi direction
  // startNavigating() {
  //   let directionsService = new google.maps.DirectionsService;
  //   let directionsDisplay = new google.maps.DirectionsRenderer;

  //   directionsDisplay.setMap(this.map);
  //   directionsDisplay.setPanel(this.directionsPanel.nativeElement);
  //   //if using 
  //   // origin: {lat: 37.77, lng: -122.447},
  //   // destination: {lat: 37.768, lng: -122.511},
  //   directionsService.route({
  //     origin: 'adelaide',
  //     destination: 'adelaide oval',
  //     travelMode: google.maps.TravelMode['DRIVING']
  //   }, (res, status) => {

  //     if (status == google.maps.DirectionsStatus.OK) {
  //       directionsDisplay.setDirections(res);
  //     } else {
  //       console.warn(status);
  //     }

  //   });

  // }

  // tryGeolocation(){
  //   this.clearMarkers();
  //   this.geolocation.getCurrentPosition().then((resp) => {
  //     let pos = {
  //       lat: resp.coords.latitude,
  //       lng: resp.coords.longitude
  //     };
  //     let marker = new google.maps.Marker({
  //       position: pos,
  //       map: this.map,
  //       title: 'I am here!'
  //     });
  //     this.markers.push(marker);
  //     this.map.setCenter(pos);
  //   }).catch((error) => {
  //     console.log('Error getting location', error);
  //   });
  // }

  // addMarker() {
  //   let marker = new google.maps.Marker({
  //     map: this.map,
  //     animation: google.maps.Animation.DROP,
  //     position: this.map.getCenter()
  //   });

  //   let content = "<h4>Information!</h4>";

  //   this.addInfoWindow(marker, content);

  // }

  // addInfoWindow(marker, content) {

  //   let infoWindow = new google.maps.InfoWindow({
  //     content: content
  //   });

  //   google.maps.event.addListener(marker, 'click', () => {
  //     infoWindow.open(this.map, marker);
  //   });

  // }
}
