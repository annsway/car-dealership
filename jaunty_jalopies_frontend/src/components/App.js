import React, { Component } from "react";
import ReactDOM from "react-dom";
import "antd/dist/antd.css";
import { BrowserRouter as Router, Route } from "react-router-dom";

import logo from "../images/logo.svg";
import "../styles/App.css";

import VehicleSearch from "../pages/VehicleSearch";
import AddCustomer from "../pages/AddCustomer";

export default class App extends Component {
  render() {
    return (
      <Router>
        <div>
          <Route path="/add_customer" component={AddCustomer} />
          <Route path="/" component={VehicleSearch} />
        </div>
      </Router>
    );
  }
}
