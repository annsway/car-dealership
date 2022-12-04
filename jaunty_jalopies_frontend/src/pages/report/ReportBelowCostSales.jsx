import React, { Component } from 'react'
import { post, get, getDateFormat } from '../../components/request'
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

export default class ReportBelowCostSales extends Component {
  constructor(props) {
    super(props)
    this.handleBelowCostSalesClick = this.handleBelowCostSalesClick.bind(this)
    this.requestUrl = 'http://localhost:8080'
    this.state = {
      belowCostSales: {},
      isFound: false,
      reportName: '',
    }
  }

  handleBelowCostSalesClick() {
    let below_cost_sales_input

    post(
      `${this.requestUrl}/api/report/belowcostsales`,
      below_cost_sales_input
    ).then((resp) => {
      this.setState({
        belowCostSales: resp.belowCostSales,
        isFound: true,
      })
    })
  }

  displaybelowCostSales = () => {
    const dataSource = [] // must be an array

    for (var ind in this.state.belowCostSales) {
      var cur_record = this.state.belowCostSales[ind]       
      dataSource.push(cur_record)
    }

    dataSource.sort(function (a, b) {
      if (a['sold_date'] == b['sold_date']) return b['percentage_ratio'] - a['percentage_ratio']
      return b['sold_date'] -a['sold_date']
    })

    for (var ind in dataSource)
    {
      dataSource[ind]["sold_date"] = getDateFormat(dataSource[ind]["sold_date"])
    }

    let columns = ''
    let display = ''

    columns = [
      {
        title: 'Customer Name',
        dataIndex: 'customer_name',
        key: 'customer_name',
      },
      {
        title: 'Invoice Price',
        dataIndex: 'invoice_price',
        key: 'invoice_price',
      },
      {
        title: 'Percentage Ratio',
        dataIndex: 'percentage_ratio',
        key: 'percentage_ratio',
      },
      {
        title: 'Salesperson Name',
        dataIndex: 'salesperson_name',
        key: 'salesperson_name',
      },
      {
        title: 'Sold Date',
        dataIndex: 'sold_date',
        key: 'sold_date',
      },
      {
        title: 'Sold Price',
        dataIndex: 'sold_price',
        key: 'sold_price',
      }
    ]

    display = (
      <>
        <Table
          rowClassName={(record, index) => {
            var ratio_num = Number(record['percentage_ratio'].replace('%', ''))
            if (ratio_num <= 95) return 'table-color-red'
          }}
          dataSource={dataSource}
          columns={columns}
        ></Table>
      </>
    )

    return <div>{display}</div>
  }

  render() {
    let display

    if (this.state.isFound) {
      display = this.displaybelowCostSales()
    }

    return (
      <div>
        <div>
          <Card title="Report: Below Cost Sales">
            <Button onClick={this.handleBelowCostSalesClick}>
              Below Cost Sales
            </Button>
          </Card>
          {display}
        </div>
        <div>
          <h5>{this.state.reportName}</h5>
          <div>{this.state.display}</div>
        </div>
      </div>
    )
  }
}
