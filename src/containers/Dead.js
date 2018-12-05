import React, { Component } from "react";
import {Button} from "react-bootstrap";
import cat_dead from "./assets/cat_dead.png";
import "./Dead.css";

export default class Dead extends Component {

     revive(catID) {
          fetch('https://catsimserver.herokuapp.com/revive', {
               method: 'POST',
               headers: {
                    'Content-Type': 'application/json'
               },
               body: JSON.stringify({
                    catID: catID
               })
          }, { mode: 'no-cors'})
          .then(res => {this.resetTS("feed", catID); return 0;})
          .then(res => {this.resetTS("shower", catID); return 0;})
          .then(res => {this.resetTS("sleep", catID); return 0;})
          .then(res => {this.props.history.push("/main?id=" + catID);});
     }

     resetTS(button, id) {
          var sql = '{ "catID" : ' + id + ' , "' + button + '" : 0 }';
          fetch('https://catsimserver.herokuapp.com/updatecat/' + button, {
               method: 'POST',
               headers: {
                    'Content-Type': 'application/json'
               },
               body: sql
          }, { mode: 'no-cors'}).then(response => {});
     }

     handleSubmit = event => {
          event.preventDefault();
          
          try {
            const query = new URLSearchParams(this.props.location.search);
            const catID = query.get('id');
            this.props.history.push("/main?id=" + catID);
          } catch(e) {
            alert(e.message);
          }
        }

     

     render() {
          const query = new URLSearchParams(this.props.location.search);
          const value = query.get('name');
          const catID = query.get('id');
          document.title = value + "...";
          return(
               <div className="Dead">
                    <img src={cat_dead} alt="cat" id="cat"/>
                    <div>{value} has died...</div>
                    <Button type="submit" className="revive" onClick={()=>{this.revive(catID); this.resetTS("feed", catID); this.resetTS("shower", catID); this.resetTS("sleep", catID); }}>Revive</Button>
               </div>
          )
     }
}
