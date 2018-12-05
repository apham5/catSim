import React, { Component } from "react";
// import {history} from "react-router-dom";

export default class Test extends Component {
     constructor(props) {
          super(props);
          this.state = {
               result: ""
          };
     };

     componentWillMount() {
          const query = new URLSearchParams(this.props.location.search);
          const value = query.get('id');
          console.log(value);
     }

     render() {
          return(
               <div></div>
          )
     }
}