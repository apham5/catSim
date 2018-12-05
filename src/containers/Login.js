import React, { Component } from "react";
import { Button, FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./Login.css";

export default class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: "",
      password: ""
    };
  }

  validateForm() {
    return this.state.username.length > 0 && this.state.password.length > 0;
  }

  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
  }

  componentDidMount() {
    document.title = "Cat Simulator";
  }

  handleSubmit = event => {
    event.preventDefault();
    
    try {
      fetch('https://catsimulator.herokuapp.com/checkuser', {
         method: 'POST',
         headers: {
              'Content-Type': 'application/json'
         },
         body: JSON.stringify({
              username: this.state.username,
              password: this.state.password
         })
    }, { mode: 'no-cors'}).then(response => {
         //console.log(username, password);
         return response.text();
    }).then(text => {
         console.log(text);
         if (text==="user not found") {
           alert("User not found!!!")
         } else if (text==="wrong password") {
           alert("Wrong password!!!")
         } else this.props.history.push("/main/?id=" + text);
    })

    } catch(e) {
      alert(e.message);
    }
  }

  render() {
    return (
      <div className="Login">
        <h1>
          Cat Simulator
        </h1>
        <form onSubmit={this.handleSubmit}>
          <div className="blankspacelogin"></div>
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
          <Button
            block
            bsSize="large"
            disabled={!this.validateForm()}
            type="submit"
            id="login"
          >
            Login
          </Button>
          <Link to="/signup">Want a cat? Register here!!!</Link>
        </form>
        <h6>
          copyright by V-sians
        </h6>
      </div>
    );
  }
}

