import React, { Component } from "react";
import { post, get } from "../../components/request";
import { DownOutlined, CaretDownOutlined } from "@ant-design/icons";
import axios from "axios";
import { Collapse } from "antd";

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

export default class ReportRepair extends Component {
  constructor(props) {
    super(props);
    this.requestUrl = "http://localhost:8080";
    this.currentUrl = "http://localhost:3000";
    this.state = {
      data: [],
      display: "",
      reportName: "",
      //   search_result: new Array(),
      //   search_result_keys: new Array(
      //     "manufacturer_name",
      //     "first_sale_or_repair_date",
      //     "last_sale_or_repair_date",
      //     "num_of_sales",
      //     "num_of_repairs",
      //     "gross_income"
      //   ),
      manufacturer: "",
      // manufacturer detail
      repairHistory: [],
      onExpand: false,
    };
  }

  displayRepairDetail = () => {
    // console.log("-------------------inside displayRepairDetail");
    let dataSource = []; // must be an array
    let repairHistory = this.state.repairHistory;

    for (var type in repairHistory) {
      let subtotal = {
        countRepairs: repairHistory[type].countRepairs,
        laborCost: repairHistory[type].laborCost.toFixed(2),
        partCost: repairHistory[type].partCost.toFixed(2),
        totalRepairCost: repairHistory[type].totalRepairCost.toFixed(2),
        type: "Subtotal for " + type,
        model_name: "subtotal",
      };
      for (var model_name in repairHistory[type].models) {
        console.log("model: ", repairHistory[type].models[model_name]);
        var cur_record = {}
        cur_record = repairHistory[type].models[model_name];
        cur_record["type"] = type
        cur_record["model_name"] = model_name
        cur_record["totalRepairCost"] = parseFloat(cur_record["totalRepairCost"]).toFixed(2)
        cur_record["laborCost"] = parseFloat(cur_record["laborCost"]).toFixed(2)
        cur_record["partCost"] = parseFloat(cur_record["partCost"]).toFixed(2)
        dataSource.push(repairHistory[type].models[model_name]);
        // console.log('cur_record ', cur_record)
        // console.log("repair history ", repairHistory[type].models[model_name])
      }
      dataSource.push(subtotal);
    }

    dataSource.sort(function (a, b) {
      if (a['type'] == b['type']) return b['countRepairs'] - a['countRepairs']
      return b['type'] -a['type']
    })

    console.log(
      "-------------------inside displayRepairDetail dataSource",
      dataSource
    );

    let columns = "";
    let display = "";

    columns = [
      {
        title: "Type",
        dataIndex: "type",
        key: "type",
      },
      {
        title: "Model Name",
        dataIndex: "model_name",
        key: "model_name",
      },
      {
        title: "Repairs Count",
        dataIndex: "countRepairs",
        key: "countRepairs",
      },
      {
        title: "Part Cost",
        dataIndex: "partCost",
        key: "partCost",
      },
      {
        title: "Labor Cost",
        dataIndex: "laborCost",
        key: "laborCost",
      },
      {
        title: "Total Repair Cost",
        dataIndex: "totalRepairCost",
        key: "totalRepairCost",
      },
    ];

    display = (
      <>
        <Table dataSource={dataSource} columns={columns}></Table>
      </>
    );
    return (
      <div>
        <h5>Repair Detail Records For {this.state.manufacturer}</h5>
        <div>{display}</div>
      </div>
    );
  };

  render() {
    let displayRepairDetailByMF = "";

    if (this.state.onExpand) {
      displayRepairDetailByMF = this.displayRepairDetail();
    }

    console.log("display in render()", this.state.display);
    return (
      <div>
        <div>
          <Card title="Repairs by Manufacturer/Type/Model">
            <Button onClick={this.getRepairsGeneral}>
              Repairs by Manufacturer/Type/Model
            </Button>
          </Card>
        </div>
        <div>
          <h5>{this.state.reportName}</h5>
          <div>{this.state.display}</div>
        </div>
        <Card>
          <div>{displayRepairDetailByMF}</div>
        </Card>
      </div>
    );
  }

  getRepairsGeneral = () => {
    axios.get(`${this.requestUrl}/api/report/repair/general`).then((resp) => {
      // handle success
      console.log("getRepairsGeneral", resp);
      this.setState({
        // data: all_search_result,
        data: resp.data.reports,
      });
      console.log("getRepairsGeneral - data got", this.state.data);
      let display = this.renderRepairsGeneral(); //show repair general part
      this.setState({
        display: display,
      });
    });
  };

  renderRepairsGeneral = () => {
    this.setState({
      reportName: "Repairs by Manufacturer/Type/Model",
    });
    let dataSource = [];
    for (var mf in this.state.data) {
      var cur = this.state.data[mf];
      cur["manufacturer"] = mf; // column name
      cur["totalRepairCost"] = cur["totalRepairCost"].toFixed(2)
      cur["laborCost"] = cur["laborCost"].toFixed(2)
      cur["partCost"] = cur["partCost"].toFixed(2)
      dataSource.push(cur);
    }

    dataSource.sort(function (a, b) {
      return a['manufacturer'] - b['manufacturer']
    })

    console.log("============renderRepairsGeneral ", dataSource);
    let columns = "";
    let display = "";

    columns = [
      {
        title: "Manufacturer",
        dataIndex: "manufacturer",
        key: "manufacturer",
      },
      {
        title: "Repairs Count",
        dataIndex: "countRepairs",
        key: "countRepairs",
      },
      {
        title: "Part Cost",
        dataIndex: "partCost",
        key: "partCost",
      },
      {
        title: "Labor Cost",
        dataIndex: "laborCost",
        key: "laborCost",
      },
      {
        title: "Total Repair Cost",
        dataIndex: "totalRepairCost",
        key: "totalRepairCost",
      },
      {
        title: "Incomplete Repairs Count",
        dataIndex: "countIncompleteRepairs",
        key: "countIncompleteRepairs",
      },
      
      {
        title: "Action",
        key: "action",
        render: (text, record) => (
          <Button
            type="primary"
            onClick={() => this.getRepairDetailByMF(record.manufacturer)}
          >
            Expand
          </Button>
        ),
      },
    ];

    display = (
      <>
        <Table dataSource={dataSource} columns={columns}></Table>
      </>
    );

    return <div>{display}</div>;
  };

  getRepairDetailByMF = (manufacturer) => {
    console.log("inside getRepairDetailByMF======", manufacturer);
    let mf_input = { manufacturer: manufacturer };
    this.setState({
      onExpand: true,
      manufacturer: manufacturer,
    });
    // get repair detail by mf
    axios
      .get(`${this.requestUrl}/api/report/repair/detail`, {
        params: {
          manufacturer: mf_input.manufacturer,
        },
      })
      .then((response) => {
        // handle success
        this.setState({
          repairHistory: response.data.details,
        });
        console.log("repairHistory", this.state.repairHistory);
      });
  };
}
