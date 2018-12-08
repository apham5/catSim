import React, { Component } from "react";
import { Label } from "react-bootstrap";
import StyledProgressbar from "./StyledProgressbar";
import { Link } from "react-router-dom";
import Sound from 'react-sound';
import "./Main.css";
import cat_default from "./assets/cat_default.png";
import cat_badmood from "./assets/cat_badmood.png";
import cat_eat from "./assets/cat_eat.png";
import cat_shower from "./assets/cat_shower.png";
import cat_sleep from "./assets/cat_sleep.png";
import cat_meow from "./assets/cat_meow.png";
import button_feed from "./assets/button_feed.png";
import button_shower from "./assets/button_shower.png";
import button_sleep from "./assets/button_sleep.png";
import button_chat from "./assets/button_chat.png";
import meow from "./assets/meow.mp3";
import def from "./default.json";

export default class Main extends Component {

     mounted = false;

     constructor(props) {
          super(props);

          this.state = {
               feed_timer: def.h,
               shower_timer: def.h,
               sleep_timer: def.h,
               meow_timer: def.h,
               cat: cat_default,
               cat_color: "",
               cat_id: "",
               cat_name: "",
               feed_timestamp: 0,
               shower_timestamp: 0,
               sleep_timestamp: 0,
               soundComponent: false
          };
     }

     updateTS(button) {
          var sql = '{ "catID" : ' + this.state.cat_id + ' , "' + button + '" : ' + Math.floor(Date.now()/1000) + '}';
          fetch('https://catsimserver.herokuapp.com/updatecat/' + button, {
               method: 'POST',
               headers: {
                    'Content-Type': 'application/json'
               },
               body: sql
          }, { mode: 'no-cors'})
     }

     feed_countdown() {
          this.setState(state => ({
               feed_timer: state.feed_timer - def.h/1000
          }));
     }

     feed_reset() {
          this.setState(state => ({
               feed_timer: def.h,
               feed_timestamp: Math.floor(Date.now()/1000)
          }), ()=>{console.log("last time feed cat: " + this.state.feed_timestamp)});
     }

     shower_countdown() {
          this.setState(state => ({
               shower_timer: state.shower_timer - def.h/1000
          }));
     }

     shower_reset() {
          this.setState(state => ({
               shower_timer: def.h,
               shower_timestamp: Math.floor(Date.now()/1000)
          }), ()=>{console.log("last time shower cat: " + this.state.shower_timestamp)});
     }

     sleep_countdown() {
          this.setState(state => ({
               sleep_timer: state.sleep_timer - def.h/1000
          }));
     }

     sleep_reset() {
          this.setState(state => ({
               sleep_timer: def.h,
               sleep_timestamp: Math.floor(Date.now()/1000)
          }), ()=>{console.log("last time sleep cat: " + this.state.sleep_timestamp)});
     }

     meow_countdown() {
          this.setState(state => ({
               meow_timer: state.meow_timer - def.h/1000
          }));
     }

     meow_reset() {
          this.setState(state => ({
               meow_timer: def.h,
               meow_timestamp: Math.floor(Date.now()/1000)
          }));
     }

     componentDidMount() {
          this.mounted = true;
          if (this.mounted) {
               this.interval = setInterval(() => {
                    this.feed_countdown();
                    this.shower_countdown();
                    this.sleep_countdown();
                    this.meow_countdown();
               }, def.h);
               const query = new URLSearchParams(this.props.location.search);
               const value = query.get('id');
               this.setState({cat_id: value});
               fetch('https://catsimserver.herokuapp.com/getcat?catid='+value)
               .then(response => {
                    return response.json();
               }).then(text => {
                    this.process(text[0]);
               })
          }
     }

     // componentWillMount() {
     //      const query = new URLSearchParams(this.props.location.search);
     //      const value = query.get('id');
     //      this.setState({cat_id: value});
     //      fetch('http://testappvsian.gearhostpreview.com/getcat?catid='+value)
     //      .then(response => {
     //           return response.json();
     //      }).then(text => {
     //           this.process(text[0]);
     //      })
     // }

     componentWillUnmount() {
          this.mounted = false;
     }     

     process(cat) {
          document.title = cat.catName;
          this.setState(state => ({
               cat_color: cat.color,
               cat_name : cat.catName
          }));
          if (cat.lifeStatus===0) {
               this.props.history.push("/dead?id=" + cat.catID + "&name=" + cat.catName);
          } else {
               const currentTS = Math.floor(Date.now()/1000);
               if (cat.hungerTS===0) {
                    this.setState(state => ({
                         //new cat start game from beginning
                         feed_timestamp: Math.floor(Date.now()/1000),
                         shower_timestamp: Math.floor(Date.now()/1000),
                         sleep_timestamp: Math.floor(Date.now()/1000),
                         feed_timer: def.h,
                         shower_timer: def.h,
                         sleep_timer: def.h
                    }));
                    this.updateTS("feed");
                    this.updateTS("shower");
                    this.updateTS("sleep");
               } else {
                    if ((currentTS-cat.hungerTS>def.h*2) 
                     && (currentTS-cat.cleanlinessTS>def.h*2) 
                     && (currentTS-cat.sleepinessTS>def.h*2)) {
                         this.dead(); 
                    } 
                    this.setState(state => ({
                         feed_timestamp: cat.hungerTS,
                         shower_timestamp: cat.cleanlinessTS,
                         sleep_timestamp: cat.sleepinessTS,
                         feed_timer: def.h + cat.hungerTS - currentTS,
                         shower_timer: def.h + cat.cleanlinessTS - currentTS,
                         sleep_timer: def.h + cat.sleepinessTS - currentTS
                    }));
               }
          }
     }

     dead() {
          fetch('https://catsimserver.herokuapp.com/dead', {
               method: 'POST',
               headers: {
                    'Content-Type': 'application/json'
               },
               body: JSON.stringify({
                    catID: this.state.cat_id
               })
          }, { mode: 'no-cors'})
          this.props.history.push("/dead?id=" + this.state.cat_id + "&name=" + this.state.cat_name);
     }

     renderCat() {
          var cat = this.state.cat;
          if (this.state.feed_timer<def.h-2 & this.state.shower_timer<def.h-2 & this.state.sleep_timer<def.h-2 & this.state.meow_timer<def.h-0.75) cat = cat_default;
          if (this.state.feed_timer<-def.h/2 & this.state.shower_timer<-def.h/2 & this.state.sleep_timer<-def.h/2) cat = cat_badmood;
          if (this.state.feed_timer<-def.h & this.state.shower_timer<-def.h & this.state.sleep_timer<-def.h) this.dead(); 
          return (
               <div className="cat">
                    <img src={cat} alt="cat" id="cat" style={{backgroundColor: this.state.cat_color}}/>
               </div>
          );
     }

     renderStatement() {
          if (this.state.feed_timer<-def.h/2 & this.state.shower_timer<-def.h/2 & this.state.sleep_timer<-def.h/2) {
               return (
                    <div className="statement">{this.state.cat_name} is getting dizzy. Neglect {this.state.cat_name} some more and {this.state.cat_name} might die!</div>
               );
          }
          if (this.state.cat === cat_meow & this.state.meow_timer>def.h-0.75) {
               return (
                    <div className="statement">Meow!</div>
               );
          }
          if (this.state.cat === cat_default || (this.state.feed_timer<def.h-2 & this.state.shower_timer<def.h-2 & this.state.sleep_timer<def.h-2)) {
               return (
                    <div className="statement">{this.state.cat_name} is silently judging you. Watch the timers to take care of {this.state.cat_name}.</div>
               );
          }
          if (this.state.cat === cat_eat) {
               return (
                    <div className="statement">You fed {this.state.cat_name}. Now {this.state.cat_name} is full!</div>
               );
          }
          if (this.state.cat === cat_shower) {
               return (
                    <div className="statement">You gave {this.state.cat_name} a shower. Now {this.state.cat_name} is sparkling clean!</div>
               );
          }
          if (this.state.cat === cat_sleep) {
               return (
                    <div className="statement">{this.state.cat_name} is sleeping. Do not disturb when {this.state.cat_name} regains energy!</div>
               );
          }
     }

     changeCat(cat) {
          this.setState(state => ({
               cat: cat
          }));
     }

     stopSound() {
          console.log('uehuehue');
          this.setState(state => ({
               soundComponent: false
          }));
     }

     changeSoundState() {
          this.setState(state => ({
               soundComponent: true
          }));
     }

     playSound() {
          if (this.state.soundComponent && this.state.meow_timer > (def.h-0.75)) {
               return (
                    <div className="sound">
                         <Sound
                         url={meow}
                         playStatus={Sound.status.PLAYING}
                         // onLoading={this.handleSongLoading}
                         // onPlaying={this.handleSongPlaying}
                         //onFinishedPlaying={this.stopSound()} 
                         />
                    </div>
               );
          }
          else {
               return;
          }
     }

     render() {
          return (
               <div className="Main">
                    <div className="header">
                         <div className="emotion">
                              <StyledProgressbar
                                   strokeWidth="10"
                                   sqSize="100"
                                   percentage={this.state.feed_timer}
                                   status="1"
                                   h={def.h}
                              /> 
                              <StyledProgressbar
                                   strokeWidth="10"
                                   sqSize="100"
                                   percentage={this.state.shower_timer}
                                   status="2"
                                   h={def.h}
                              />
                              <StyledProgressbar
                                   strokeWidth="10"
                                   sqSize="100"
                                   percentage={this.state.sleep_timer}
                                   status="3"
                                   h={def.h}
                              />
                         </div>
                         <div className="logout">
                              <Link to="/">Log out</Link>
                         </div>
                    </div>   
                    {this.renderCat()}
                    {this.renderStatement()}
                    <div className="interaction">
                         {/* <Button type="button" className="button" id="feed" onClick={() => {this.feed_reset(); this.changeCat(cat_eat)}}>
                              <img src={button_feed} alt="" width="140" height="140"/>
                         </Button> */}
                         <Label type="button" className="button" id="feed" onClick={() => {this.feed_reset(); this.changeCat(cat_eat); this.updateTS("feed")}}>
                              <img src={button_feed} alt="" width="140" height="140"/>
                         </Label>
                         <Label type="button" className="button" id="shower" onClick={() => {this.shower_reset(); this.changeCat(cat_shower); this.updateTS("shower")}}>
                              <img src={button_shower} alt="" width="140" height="140"/>
                         </Label>
                         <Label type="button" className="button" id="sleep" onClick={() => {this.sleep_reset(); this.changeCat(cat_sleep); this.updateTS("sleep")}}>
                              <img src={button_sleep} alt="" width="140" height="140"/>
                         </Label>
                         <Label type="button" className="button" id="chat" onClick = {() => {this.changeCat(cat_meow); this.changeSoundState(); this.meow_reset();}}>
                              <img src={button_chat} alt="" width="140" height="140"/>
                         </Label>
                    </div>
                    {this.playSound()}
               </div>
          );
     }
}