import React, { Component } from "react";
import "antd/dist/antd.css";
import Login from "./Login";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

import { Input, Card, Button, Dropdown, Menu, Row, Modal } from "antd";
import { DownOutlined, CaretDownOutlined } from "@ant-design/icons";
import { post, get } from "../components/request";
import axios from "axios";
import FullVehicleDetail from "./FullVehicleDetail";
import AddCustomer from "./AddCustomer";
import AddVehicle from "./AddVehicle";

export default class App extends Component {
  render() {
    return (
      <div>
        {/* <AddVehicle /> */}
        <Login />
      </div>
    );
  }
}
