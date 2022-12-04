import React, { Component } from "react";
import "antd/dist/antd.css";
import { Input, Card, Button, Row } from "antd";
import { post, get } from "../components/request";

export default class SellVehicle extends Component {
  render() {
    return (
      <p>
        <p>To create a new sale order</p>
        <p>1. Search for a vehicle on the Vehicle Search page</p>
        <p>2. Click the Select button</p>
        <p>3. Click Full Vehicle Detail button</p>
      </p>
    );
  }
}
