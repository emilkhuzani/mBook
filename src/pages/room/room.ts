import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/timeout';
import { Insomnia } from '@ionic-native/insomnia';


@IonicPage()
@Component({
  selector: 'page-room',
  templateUrl: 'room.html',
})
export class RoomPage {
  clock:any;
  roomId:any;
  events:any;
  upcoming:any;
  roomName:any;
  event_name:string;
  event_start_time:string;
  event_end_time:string;
  upcoming_event_name:string;
  upcoming_start_time:string;
  upcoming_end_time:string;
  constructor(public navCtrl: NavController, public navParams: NavParams, private http:Http, private alertCtlr:AlertController, private insomnia:Insomnia) {
    this.keepAwake();
    this.roomId=this.navParams.get('room_id');
  	this.tick();
  	this.refreshClock();
    this.getRoomName();
  	this.getEvent();
    this.getUpcoming();
  	this.refreshEvent();
  }

  keepAwake(){
    this.insomnia.keepAwake().then();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RoomPage');
  }

  tick(){
  	this.clock=Date.now();
  }

  refreshClock(){
  	setInterval(() => {
  		this.tick();
    }, 1000);
  }

  getRoomName(){
    this.http.get('http://203.99.108.38/book/index.php/api/get_room_name/'+this.roomId)
   .timeout(3*1000)
   .map(res=>res.json())
   .subscribe(data=>{
     this.roomName=data.room_name;
     console.log(this.roomName);
   },err=>{

   })
  }

  getEvent(){
    this.event_name = '';
    this.event_start_time = '';
    this.event_end_time = '';
  	this.http.get('http://203.99.108.38/book/index.php/api/get_event/'+this.roomId)
  	.timeout(3*1000)
  	.map(res=>res.json())
  	.subscribe(data=>{
      if(data){
        this.event_name = data.event_name;
        this.event_start_time = data.start_time;
        this.event_end_time = data.end_time;
      }else{
      }
      this.events=data;
  	},err=>{
  	  let alert = this.alertCtlr.create({
  	  	title : 'Error',
  	  	message : 'Cannt retrieve event data from server',
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
              this.getEvent();
            }
          }
        ]
  	  });
      alert.present();
  	})
  }

  getUpcoming(){
    this.upcoming_event_name='';
    this.upcoming_start_time='';
    this.upcoming_end_time='';
    this.http.get('http://203.99.108.38/book/index.php/api/get_upcoming/'+this.roomId)
    .timeout(3*1000)
    .map(res=>res.json())
    .subscribe(data=>{
      if(data){
        this.upcoming_event_name = data.event_name;
        this.upcoming_start_time = data.start_time;
        this.upcoming_end_time = data.end_time;
      }else{
      }
      
    },err=>{
      let alert = this.alertCtlr.create({
        title : 'Error',
        message : 'Cannt retrieve upcoming event data from server',
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
              this.getUpcoming();
            }
          }
        ]
      });
      alert.present();
    })
  }

  refreshEvent(){
  	setInterval(()=>{
  		this.getEvent();
      this.getUpcoming();
  	},30*1000);
  }

}
