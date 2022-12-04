import React, { Component } from "react";
import { post, get, getDateFormat } from "../../components/request";
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

export default class ReportGrossIncome extends Component {
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
      //     "customer_name",
      //     "first_sale_or_repair_date",
      //     "last_sale_or_repair_date",
      //     "num_of_sales",
      //     "num_of_repairs",
      //     "gross_income"
      //   ),
      customerID: "",
      customer: null, // this is an object
      // customer detail
      salesHistory: [],
      repairHistory: [],
      onExpand: false,
    };
  }

  displaySalesDetail = () => {
    console.log("++++++++++++++++++++inside displaySalesDetail");
    let dataSource = this.state.salesHistory;

    dataSource.sort(function (a, b) {
      if (a["sale_date"] != b["sale_date"])
        return b["sale_date"] - a["sale_date"];

      return a["vin"] - b["vin"];
    });

    for (var ind in dataSource) {
      dataSource[ind]["sale_date"] = getDateFormat(
        dataSource[ind]["sale_date"]
      );
    }

    return (
      <div>
        <h5>Sales Records</h5>
        <Card>
          <table className="table">
            <thead>
              <tr>
                <th scope="col">Sale Date</th>
                <th scope="col">Sold Price</th>
                <th scope="col">VIN</th>
                <th scope="col">Year</th>
                <th scope="col">Manufacturer</th>
                <th scope="col">Model Name</th>
                <th scope="col">Salesperson Name</th>
              </tr>
            </thead>

            <tbody>
              {dataSource.map((value, key) => {
                return (
                  <tr key={key}>
                    {Object.keys(value).map((keys) => {
                      var value_out = "";
                      if (keys == "sold_price") {
                        value_out = value[keys].toFixed(2);
                      } else {
                        value_out = value[keys];
                      }
                      return <td key={keys}>{value_out}</td>;
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Card>
      </div>
    );
  };

  displayRepairDetail = () => {
    console.log("-------------------inside displayRepairDetail");
    let dataSource = this.state.repairHistory;

    dataSource.sort(function (a, b) {
      if (a["end_date"] == null && b["end_date"] != null) return -1;

      if (a["end_date"] != null && b["end_date"] == null) return 1;

      if (a["start_date"] != b["start_date"])
        return b["start_date"] - a["start_date"];
      else if (a["end_date"] != b["end_date"])
        return b["end_date"] - a["end_date"];

      return a["vin"] - b["vin"];
    });

    for (var ind in dataSource) {
      dataSource[ind]["start_date"] = getDateFormat(
        dataSource[ind]["start_date"]
      );
      dataSource[ind]["end_date"] = getDateFormat(dataSource[ind]["end_date"]);
    }

    return (
      <div>
        <h5>Repair Records</h5>
        <Card>
          <table className="table">
            <thead>
              <tr>
                <th scope="col">Start Date</th>
                <th scope="col">End Date</th>
                <th scope="col">VIN</th>
                <th scope="col">Odometer Reading</th>
                <th scope="col">Parts Cost</th>
                <th scope="col">Labor Cost</th>
                <th scope="col">Total Cost</th>
                <th scope="col">Servicewriter Name</th>
              </tr>
            </thead>
            <tbody>
              {dataSource.map((value, key) => {
                return (
                  <tr key={key}>
                    {Object.keys(value).map((keys) => {
                      var value_out = "";
                      if (
                        keys == "parts_cost" ||
                        keys == "labor_cost" ||
                        keys == "total_cost" ||
                        keys == "odometer_reading"
                      ) {
                        value_out = value[keys].toFixed(2);
                      } else {
                        value_out = value[keys];
                      }
                      return <td key={keys}>{value_out}</td>;
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Card>
      </div>
    );
  };

  render() {
    let displaySales = "";
    let displayRepairs = "";

    if (this.state.onExpand) {
      displaySales = this.displaySalesDetail();
      displayRepairs = this.displayRepairDetail();
    }

    console.log("display in render()", this.state.display);
    return (
      <div>
        <Card title="Gross Income Report">
          <div>
            <Button onClick={this.getGrossIncome}>Top 15 Customers</Button>
          </div>
          <div>
            <h5>{this.state.reportName}</h5>
            <div>{this.state.display}</div>
          </div>
          <div>{displaySales}</div>
          <div>{displayRepairs}</div>
        </Card>
      </div>
    );
  }

  getGrossIncome = () => {
    axios.get(`${this.requestUrl}/api/report/grossincome`).then((resp) => {
      // handle success
      console.log("getGrossIncome", resp);
      this.setState({
        // data: all_search_result,
        data: resp.data.Report,
      });
      let display = this.renderGrossIncome();
      this.setState({
        display: display,
      });
      console.log("getGrossIncome", this.state.display);
    });
  };

  renderGrossIncome = () => {
    this.setState({
      reportName: "Gross Income For Top 15 Customers",
    });
    let dataSource = this.state.data;

    dataSource.sort(function (a, b) {
      if (a["gross_income"] != b["gross_income"])
        return b["gross_income"] - a["gross_income"];
      else if (a["last_sale_or_repair_date"] != b["last_sale_or_repair_date"])
        return b["last_sale_or_repair_date"] - a["last_sale_or_repair_date"];

      return b["first_sale_or_repair_date"] - a["first_sale_or_repair_date"];
    });

    for (var ind in dataSource) {
      dataSource[ind]["first_sale_or_repair_date"] = getDateFormat(
        dataSource[ind]["first_sale_or_repair_date"]
      );
      dataSource[ind]["last_sale_or_repair_date"] = getDateFormat(
        dataSource[ind]["last_sale_or_repair_date"]
      );
    }

    return (
      <div>
        <Card>
          <table className="table">
            <thead>
              <tr>
                {/* <th scope="col">customer_id</th> */}
                <th scope="col">Customer Name</th>
                <th scope="col">First Sale Or Repair Date</th>
                <th scope="col">Last Sale Or Repair Date</th>
                <th scope="col">Num Of Sales</th>
                <th scope="col">Num Of Repairs</th>
                <th scope="col">Gross Income</th>
              </tr>
            </thead>

            <tbody>
              {/* {search_result.map((value, key) => { */}
              {dataSource.map((value, key) => {
                return (
                  <tr key={key}>
                    {Object.keys(value).map((keys) => {
                      if (keys != "customerID") {
                        var value_out = "";
                        if (keys == "gross_income") {
                          value_out = value[keys].toFixed(2);
                        } else {
                          value_out = value[keys];
                        }
                        return <td key={keys}>{value_out}</td>;
                      }
                    })}
                    <td>
                      <Button
                        type="primary"
                        className="select_customer_btn"
                        onClick={() =>
                          this.getCustomerDetail(value["customerID"])
                        }
                      >
                        Expand
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Card>
      </div>
    );
  };

  getCustomerDetail = (customerID) => {
    console.log("inside getCustomerDetail======", customerID);
    let sale_input = { customerID: customerID };
    this.setState({
      onExpand: true,
    });
    // get sales records
    axios
      .get(`${this.requestUrl}/api/report/grossincome/sale`, {
        params: {
          customerID: sale_input.customerID,
        },
      })
      .then((response) => {
        // handle success
        this.setState({
          salesHistory: response.data.sales,
        });
        console.log("salesHistory", this.state.salesHistory);
      });
    let repair_input = { customerID: customerID };
    // get repair records
    axios
      .get(`${this.requestUrl}/api/report/grossincome/repair`, {
        params: {
          customerID: repair_input.customerID,
        },
      })
      .then((response) => {
        // handle success
        this.setState({
          repairHistory: response.data.repairs,
        });
        console.log("repairHistory", this.state.repairHistory);
      });
  };
}
