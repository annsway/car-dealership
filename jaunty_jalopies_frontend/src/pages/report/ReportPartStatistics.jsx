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

export default class ReportPartStatistics extends Component {
  constructor(props) {
    super(props)
    this.handlePartStatisticsClick = this.handlePartStatisticsClick.bind(this)
    this.requestUrl = 'http://localhost:8080'
    this.state = {
      partStatistics: {},
      isFound: false,
      reportName: '',
    }
  }

  handlePartStatisticsClick() {
    let part_statistics_input

    post(
      `${this.requestUrl}/api/report/partstatistics`,
      part_statistics_input
    ).then((resp) => {
      this.setState({
        partStatistics: resp.partStatistics,
        isFound: true,
      })
    })
  }

  displayPartStatistics = () => {
    const dataSource = [] // must be an array

    for (var vendorName in this.state.partStatistics) {
      var cur_record = {}
      cur_record["vendorName"] = vendorName
      cur_record["countParts"]= this.state.partStatistics[vendorName]["countParts"]
      cur_record["totalPrice"]= this.state.partStatistics[vendorName]["totalPrice"].toFixed(2)
      dataSource.push(cur_record)

    }

    // sort totoal price
    dataSource.sort(function (a, b) {
      return b["totalPrice"] - a["totalPrice"];
    });

    let columns = ''
    let display = ''

    columns = [
      {
        title: 'Vendor Name',
        dataIndex: 'vendorName',
        key: 'vendorName',
      },
      {
        title: 'Parts Counts',
        dataIndex: 'countParts',
        key: 'countParts',
      },
      {
        title: 'Total Price',
        dataIndex: 'totalPrice',
        key: 'totalPrice',
      }
    ]

    display = (
      <>
        <Table dataSource={dataSource} columns={columns}></Table>
      </>
    )

    return <div>{display}</div>
  }

  render() {
    let display

    if (this.state.isFound) {
      display = this.displayPartStatistics()
    }

    return (
      <div>
        <div>
          <Card title="Report: Part Statistics">
            <Button onClick={this.handlePartStatisticsClick}>
              Part Statistics
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
