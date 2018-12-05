import React, { Component } from "react";
import {
  Button,
  //HelpBlock,
  FormGroup,
  FormControl,
  ControlLabel,
  DropdownButton,
  MenuItem
} from "react-bootstrap";
import { Link } from "react-router-dom";
import "./Signup.css";

export default class Signup extends Component {
  constructor(props) {
    super(props);

    this.state = {
      // isLoading: false,
      username: "",
      password: "",
      catname: "",
      catcolor: "#ffffff",
      // newUser: null
    };
  }

  validateForm() {
    return (
      this.state.username.length > 0 &&
      this.state.password.length > 0 &&
      this.state.catname.length > 0 &&
      this.state.catcolor.length > 0 
    );
  }

  // validateConfirmationForm() {
  //   return this.state.confirmationCode.length > 0;
  // }

  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
  }

  handleSelect(eventKey, event) {
    this.setState({catcolor : eventKey}, );
  }

  handleSubmit = async event => {
    event.preventDefault();
    
    if (this.state.username.length < 6) {
      alert("Username has to be at least 6 characters long.");
      return;
    }
    if (this.state.password.length < 6) {
      alert("Password has to be at least 6 characters long.");
      return;
    }

    try {
      fetch('https://catsimserver.herokuapp.com/newuser', {
         method: 'POST',
         headers: {
              'Content-Type': 'application/json'
         },
         body: JSON.stringify({
              username: this.state.username,
              password: this.state.password,
              name: this.state.catname,
              color: this.state.catcolor,
              life: 1
         })
    }, { mode: 'no-cors'}).then(response => {
         //console.log(username, password);
         return response.text();
    }).then(text => {
         console.log(text);
         if (text==="user already exist") {
           alert("User already exist!!!");
         } else {
           alert("Registration successful!!!")
           this.props.history.push("/");
         }
    })

    } catch(e) {
      alert(e.message);
    }
  }
  
  componentWillMount() {
    document.title = "Sign up for a cat";
  }

  renderForm() {
    return (
      <form onSubmit={this.handleSubmit}>
        <div className="blankspace"></div>
        <FormGroup controlId="username" bsSize="large">
          <ControlLabel>User Name</ControlLabel>
          <FormControl
            autoFocus
            type="username"
            value={this.state.username}
            onChange={this.handleChange}
          />
        </FormGroup>
        <FormGroup controlId="password" bsSize="large">
          <ControlLabel>Password</ControlLabel>
          <FormControl
            value={this.state.password}
            onChange={this.handleChange}
            type="password"
          />
        </FormGroup>
        <FormGroup controlId="catname" bsSize="large">
          <ControlLabel>Cat Name</ControlLabel>
          <FormControl
            value={this.state.catname}
            onChange={this.handleChange}
            type="catname"
          />
        </FormGroup>
        {/* <FormGroup controlId="catcolor" bsSize="large">
          <ControlLabel>Cat Color</ControlLabel>
          <FormControl
            // autoFocus
            type="catcolor"
            value={this.state.catcolor}
            onChange={this.handleChange}
          />
        </FormGroup> */}
        <FormGroup>
          <ControlLabel>Color</ControlLabel>
          <div className="colorPicker">
            <div className="colorPad"  style={{backgroundColor: this.state.catcolor}}></div>
            <DropdownButton
              title=""
              id="color"
              onSelect={this.handleSelect.bind(this)}
            >
              <MenuItem eventKey="#ffffff">White</MenuItem>
              <MenuItem eventKey="#e99fbb">Pink</MenuItem>
              <MenuItem eventKey="#dfb5f1">Purple</MenuItem>
              <MenuItem eventKey="#e3a465">Orange</MenuItem>
              <MenuItem eventKey="#81b3eb">Blue</MenuItem>
              <MenuItem eventKey="#38dcc3">Teal</MenuItem>
            </DropdownButton> 
          </div>
        </FormGroup>
        <Button
            block
            bsSize="large"
            disabled={!this.validateForm()}
            type="submit"
            id="register"
          >
            Register
        </Button>
        <Link to="/">Already have a cat? Login here!!!</Link>
      </form>
    );
  }

  render() {
    return (
      <div className="Signup">
        <h1>
          Cat Simulator
        </h1>
        {this.renderForm()}
        {/* {this.state.newUser === null
          ? this.renderForm()
          : this.renderConfirmationForm()} */}
      </div>
    );
  }
}
