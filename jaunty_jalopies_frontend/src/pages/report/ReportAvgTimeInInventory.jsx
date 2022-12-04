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

export default class ReportAvgTimeInIventory extends Component {
  constructor(props) {
    super(props)
    this.handleAvgTimeInInventClick = this.handleAvgTimeInInventClick.bind(this)
    this.requestUrl = 'http://localhost:8080'
    this.state = {
      averageTime: {},
      isFound: false,
      reportName: '',
    }
  }

  handleAvgTimeInInventClick() {
    let avg_time_input

    post(
      `${this.requestUrl}/api/report/averagetime`,
      avg_time_input
    ).then((resp) => {
      this.setState({
        averageTime: resp.averageTime,
        isFound: true,
      })
    })
  }

  displayAvgTimeInInvent = () => {
    const dataSource = [] // must be an array

    for (var vehicleType in this.state.averageTime) {
      var cur_record = {}
      cur_record["vehicleType"] = vehicleType
      cur_record["avgTime"]= this.state.averageTime[vehicleType]
      dataSource.push(cur_record)

    }

    let columns = ''
    let display = ''

    columns = [
      {
        title: 'Vehicle Type',
        dataIndex: 'vehicleType',
        key: 'vehicleType',
      },
      {
        title: 'Average Time',
        dataIndex: 'avgTime',
        key: 'avgTime',
      },
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
      display = this.displayAvgTimeInInvent()
    }

    return (
      <div>
        <div>
          <Card title="Report: Average Time In Inventory">
            <Button onClick={this.handleAvgTimeInInventClick}>
              Average Time In Inventory
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
