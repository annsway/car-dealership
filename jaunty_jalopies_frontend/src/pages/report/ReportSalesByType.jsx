import React, { Component } from "react";
import { post, get } from "../../components/request";
import { DownOutlined, CaretDownOutlined } from "@ant-design/icons";
import axios from "axios";
import {
  Input,
  Card,
  Table,
  Button,
  Modal,
  Space,
  Form,
  DatePicker,
  InputNumber,
} from "antd";
import "antd/dist/antd.css";
import moment from "moment";

export default class ReportSalesByType extends Component {
  constructor(props) {
    super(props);
    this.requestUrl = "http://localhost:8080";
    this.currentUrl = "http://localhost:3000";
    this.state = {
      data: [],
      display: "",
      reportName: "",
    };
  }

  render() {
    console.log("display in render()", this.state.display);
    return (
      <div>
        <div>
          <Card title="Sales by Type Report">
            <Button onClick={this.getSalesByType_30d}>
              In the previous 30 days
            </Button>
            <Button onClick={this.getSalesByType_1y}>
              In the previous year
            </Button>
            <Button onClick={this.getSalesByType_all}>Over all time</Button>
          </Card>
        </div>
        <div>
          <h5>{this.state.reportName}</h5>
          <div>{this.state.display}</div>
        </div>
      </div>
    );
  }
  display = () => {
    console.log("inside display");
  };
  getSalesByType_30d = () => {
    axios.get(`${this.requestUrl}/api/report/sales/type`).then((resp) => {
      // handle success
      // console.log("getSalesByType_30d", resp);
      this.setState({
        data: [resp.data.reports["30days"]],
      });
      let display = this.renderSalesByType_30d();
      this.setState({
        display: display,
      });
      // console.log("getSalesByType_30d", this.state.display);
    });
  };

  renderSalesByType_30d = () => {
    this.setState({
      reportName: "Sales By Type In The Previous 30 Days",
    });
    let dataSource = this.state.data;
    let myarr = [];
    Object.keys(dataSource[0]).forEach((key, index) => {
      let obj = {};
      obj.key = index;
      obj["type"] = key;
      obj["count"] = dataSource[0][key];
      myarr.push(obj);
    });

    let columns = [
      {
        title: "Type",
        key: "type",
        dataIndex: "type",
      },
      {
        title: "Count",
        key: "count",
        dataIndex: "count",
      },
    ];
    return <Table dataSource={myarr} columns={columns} />;
  };

  getSalesByType_1y = () => {
    axios.get(`${this.requestUrl}/api/report/sales/type`).then((resp) => {
      // handle success
      this.setState({
        data: [resp.data.reports["lastYear"]],
      });
      let display = this.renderSalesByType_1y();
      this.setState({
        display: display,
      });
    });
  };

  renderSalesByType_1y = () => {
    this.setState({
      reportName: "Sales By Type In The Previous Year",
    });
    let dataSource = this.state.data;
    let myarr = [];
    Object.keys(dataSource[0]).forEach((key, index) => {
      let obj = {};
      obj.key = index;
      obj["type"] = key;
      obj["count"] = dataSource[0][key];
      myarr.push(obj);
    });

    let columns = [
      {
        title: "type",
        key: "type",
        dataIndex: "type",
      },
      {
        title: "count",
        key: "count",
        dataIndex: "count",
      },
    ];

    return <Table dataSource={myarr} columns={columns} />;
  };

  getSalesByType_all = () => {
    axios.get(`${this.requestUrl}/api/report/sales/type`).then((resp) => {
      // handle success
      this.setState({
        data: [resp.data.reports["allTime"]],
      });
      let display = this.renderSalesByType_all();
      this.setState({
        display: display,
      });
    });
  };

  renderSalesByType_all = () => {
    this.setState({
      reportName: "Sales By Type Over All Time",
    });
    let dataSource = this.state.data;
    let myarr = [];
    Object.keys(dataSource[0]).forEach((key, index) => {
      let obj = {};
      obj.key = index;
      obj["type"] = key;
      obj["count"] = dataSource[0][key];
      myarr.push(obj);
    });

    let columns = [
      {
        title: "type",
        key: "type",
        dataIndex: "type",
      },
      {
        title: "count",
        key: "count",
        dataIndex: "count",
      },
    ];
    return <Table dataSource={myarr} columns={columns} />;
  };
}
