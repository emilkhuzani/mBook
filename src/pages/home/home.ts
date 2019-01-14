import { Component } from '@angular/core';
import { NavController, LoadingController, AlertController } from 'ionic-angular';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/timeout';

import { RoomPage } from '../room/room';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  rooms:any;
  constructor(public navCtrl: NavController, public loadingCtlr:LoadingController, private http:Http, private alertCtlr:AlertController) {
  	this.getRoom();
  }

  getRoom(){
  	let loading = this.loadingCtlr.create({
  		spinner : 'dots',
  		content : 'Retrieving room data...',
  	});
  	loading.present();
  	this.http.get('http://203.99.108.38/book/index.php/api/get_room')
  	.timeout(3*1000)
  	.map(res=>res.json())
  	.subscribe(data=>{
  	  loading.dismiss();
  	  this.rooms=data;
  	},err=>{
  	  loading.dismiss();
  	  let alert = this.alertCtlr.create({
  	  	title : 'Error',
  	  	message : 'Cannt retrieve room data from server',
  	  	buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            handler: () => {
              console.log('Cancel clicked');
            }
          },
          {
            text: 'Try Again',
            handler: () => {
              this.getRoom();
            }
          }
        ]
  	  });
  	  alert.present();
  	})
  }

  onChange(event){
  	this.navCtrl.push(RoomPage,{room_id:event},{animate:true, direction:'forward'});
  }

}
