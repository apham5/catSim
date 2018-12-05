import React from "react";
import { Route, Switch } from "react-router-dom";
//import Home from "./containers/Home";
import Login from "./containers/Login";
import Signup from "./containers/Signup";
import Main from "./containers/Main";
import Test from "./containers/test";
import Dead from "./containers/Dead";

export default () =>
  <Switch>
     {/* <Route path="/" exact component={Home} /> */}
    <Route path="/" exact component={Login} />
    <Route path="/signup" exact component={Signup} />
    <Route path="/main" exact component={Main} />
    <Route path="/test" exact component={Test} />
    <Route path="/dead" exact component={Dead} />
  </Switch>;