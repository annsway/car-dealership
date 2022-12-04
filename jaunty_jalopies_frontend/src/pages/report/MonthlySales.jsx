import React, { Component } from 'react'
import { post, get } from '../../components/request'
import { DownOutlined, CaretDownOutlined } from '@ant-design/icons'
import axios from 'axios'
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
} from 'antd'
import 'antd/dist/antd.css'
import moment from 'moment'
import "../../styles/App.css";

export default class MonthlySales extends Component {
  constructor(props) {
    super(props)
    this.handleMonthlySalesClick = this.handleMonthlySalesClick.bind(this)
    this.requestUrl = 'http://localhost:8080'
    this.state = {
      monthlySales: {},
      isFound: false,
      reportName: '',
      selected_year: null,
      selected_month: null,
      individualMonthlySales: {},
      isIndividualFound: false,
      onExpand: false,
    }
  }

  handleMonthlySalesClick() {
    let monthly_sales_input

    post(
      `${this.requestUrl}/api/report/monthlysales`,
      monthly_sales_input
    ).then((resp) => {
      this.setState({
        monthlySales: resp.monthlySales,
        isFound: true,
      })
    })
  }

  getIndiviualDetail = (year, month) => {
    let monthly_sales_individual_input = {
      year: year,
      month: month,
    }

    post(
      `${this.requestUrl}/api/report/monthlysales/individual`,
      monthly_sales_individual_input
    ).then((resp) => {
      this.setState({
        individualMonthlySales: resp.monthlySalesByIndividual,
        isIndividualFound: true,
        onExpand: true
      })
    })
  }

  displayIndividualMonthlySales = () => {
    const dataSource = [] // must be an array

    for (var sales_name in this.state.individualMonthlySales) {
      var cur_record = {}

      cur_record['name'] = sales_name
      cur_record['numVehiclesSold'] = this.state.individualMonthlySales[
        sales_name
      ]['numVehiclesSold']
      cur_record['totalSalesIncome'] = this.state.individualMonthlySales[
        sales_name
      ]['totalSalesIncome'].toFixed(2)

      dataSource.push(cur_record)
    }

    dataSource.sort(function (a, b) {
      if (a["numVehiclesSold"] != b["numVehiclesSold"])
        return b["numVehiclesSold"] - a["numVehiclesSold"];

      return b['totalSalesIncome'] - a['totalSalesIncome'];
    })

    let columns = ''
    let display = ''

    columns = [
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: 'Vehicles Sold Number ',
        dataIndex: 'numVehiclesSold',
        key: 'numVehiclesSold',
      },
      {
        title: 'Total Sales Income',
        dataIndex: 'totalSalesIncome',
        key: 'totalSalesIncome',
      },
    ]

    display = (
      <>
        <Table dataSource={dataSource} columns={columns}></Table>
      </>
    )

    return <div>{display}</div>
  }

  displayMonthlySales = () => {
    const dataSource = [] // must be an array

    for (var year in this.state.monthlySales) {
      for (var month in this.state.monthlySales[year]) {
        var cur_record = {}
        cur_record['year'] = year
        cur_record['month'] = month

        for (var key in this.state.monthlySales[year][month])
          cur_record[key] = this.state.monthlySales[year][month][key]

        dataSource.push(cur_record)
      }
    }

    dataSource.sort(function (a, b) {
      if (a['year'] == b['year']) return b['month'] - a['month']
      return b['year'] -a['year']
    })

    let columns = ''
    let display = ''

    columns = [
      {
        title: 'year',
        dataIndex: 'year',
        key: 'year',
      },
      {
        title: 'month',
        dataIndex: 'month',
        key: 'month',
      },
      {
        title: 'totalNetIncome',
        dataIndex: 'totalNetIncome',
        key: 'totalNetIncome',
      },
      {
        title: 'incomeRatio',
        dataIndex: 'incomeRatio',
        key: 'incomeRatio',
      },
      {
        title: 'numVehiclesSold',
        dataIndex: 'numVehiclesSold',
        key: 'numVehiclesSold',
      },
      {
        title: 'totalSalesIncome',
        dataIndex: 'totalSalesIncome',
        key: 'totalSalesIncome',
      },
    ]

    return (
      <div>
        <Card>
          <table className="table">
            <thead>
              <tr>
                {/* <th scope="col">customer_id</th> */}
                <th scope="col">Year</th>
                <th scope="col">Month</th>
                <th scope="col">Total Net Income</th>
                <th scope="col">Income Ratio</th>
                <th scope="col">Vehicle Sold Numbers</th>
                <th scope="col">Total Sales Income</th>
              </tr>
            </thead>

            <tbody>
              {/* {search_result.map((value, key) => { */}
              {dataSource.map((value, key) => {
                return (
                  <tr key={key}>
                    {Object.keys(value).map((keys) => {
                        var value_out = "";
                        if (keys == "totalNetIncome" || keys == "totalSalesIncome") {
                          value_out = value[keys].toFixed(2);
                        } else {
                          value_out = value[keys];
                        }
                        return <td key={keys}>{value_out}</td>;
                    })}
                    <td>
                      <Button
                        type="primary"
                        className="select_time_btn"
                        onClick={() =>
                          this.getIndiviualDetail(value["year"], value["month"])
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
  }

  render() {
    let displayMonthlySales = "";
    let displayIndividualSales = "";

    if (this.state.isFound)
    {
      displayMonthlySales = this.displayMonthlySales();
    }

    if (this.state.onExpand) {
      displayIndividualSales = this.displayIndividualMonthlySales();
    }

    return (
      <div>
        <div>
          <Card title="Report: Monthly Sales">
            <table>
              <tbody>
                <tr>
                  <td>
                    <Button onClick={this.handleMonthlySalesClick}>
                      Total Monthly Sales
                    </Button>
                  </td>
                </tr>
              </tbody>
            </table>
          </Card>
          {displayMonthlySales}
          {displayIndividualSales}
        </div>
        <div>
          <h5>{this.state.reportName}</h5>
          <div>{this.state.display}</div>
        </div>
      </div>
    )
  }
}
