import React, { Component } from "react";
import { post, get } from "../components/request";
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

import ReportSalesByColor from "./report/ReportSalesByColor";
import ReportSalesByType from "./report/ReportSalesByType";
import ReportSalesByManufacturer from "./report/ReportSalesByManufacturer";
import ReportGrossIncome from "./report/ReportGrossIncome";
import ReportRepair from "./report/ReportRepair";
import ReportBelowCostSales from "./report/ReportBelowCostSales";

import ReportPartStatistics from "./report/ReportPartStatistics";
import ReportAvgTimeInIventory from "./report/ReportAvgTimeInInventory";
import MonthlySales from "./report/MonthlySales";

export default class Reports extends Component {
  constructor(props) {
    super(props);
    this.state = {
      salesByColor_visible: false,
      salesByType_visible: false,
      salesByManuf_visible: false,
      grossCustIncom_visible: false,
      repairStat_visible: false,
      belowCostSale_visible: false,
      avgTime_visible: false,
      partStatistics_visible: false,
      monthlySale_visible: false,
      content: null,
    };
  }

  openReportSalesByColorModal = () => {
    const showModal = () => {
      this.setState({ salesByColor_visible: true });
    };

    const handleOk = () => {
      setTimeout(() => {
        this.setState({ salesByColor_visible: false });
      }, 2000);
    };

    const handleCancel = () => {
      this.setState({ salesByColor_visible: false });
    };

    let displayDetail = <ReportSalesByColor />;
    return (
      <>
        <Space direction="vertical">
          <Button type="primary" onClick={showModal}>
            Report Sales By Color
          </Button>
          <Modal
            title="Report Sales By Color"
            visible={this.state.salesByColor_visible}
            onOk={handleOk}
            onCancel={handleCancel}
            width={1500}
            bodyStyle={{ height: 2500 }}
          >
            {displayDetail}
          </Modal>
        </Space>
      </>
    );
  };

  openReportSalesByTypeModal = () => {
    const showModal = () => {
      this.setState({ salesByType_visible: true });
    };

    const handleOk = () => {
      setTimeout(() => {
        this.setState({ salesByType_visible: false });
      }, 2000);
    };

    const handleCancel = () => {
      this.setState({ salesByType_visible: false });
    };

    let displayDetail = <ReportSalesByType />;
    return (
      <>
        <Space direction="vertical">
          <Button type="primary" onClick={showModal}>
            Report Sales By Type
          </Button>
          <Modal
            title="Report Sales By Type"
            visible={this.state.salesByType_visible}
            onOk={handleOk}
            onCancel={handleCancel}
            width={1500}
            bodyStyle={{ height: 2500 }}
          >
            {displayDetail}
          </Modal>
        </Space>
      </>
    );
  };

  openReportSalesByManufactModal = () => {
    const showModal = () => {
      this.setState({ salesByManuf_visible: true });
    };

    const handleOk = () => {
      setTimeout(() => {
        this.setState({ salesByManuf_visible: false });
      }, 2000);
    };

    const handleCancel = () => {
      this.setState({ salesByManuf_visible: false });
    };

    let displayDetail = <ReportSalesByManufacturer />;
    return (
      <>
        <Space direction="vertical">
          <Button type="primary" onClick={showModal}>
            Report Sales By Manufacturer
          </Button>
          <Modal
            title="Report Sales By Manufacturer"
            visible={this.state.salesByManuf_visible}
            onOk={handleOk}
            onCancel={handleCancel}
            width={1500}
            bodyStyle={{ height: 2500 }}
          >
            {displayDetail}
          </Modal>
        </Space>
      </>
    );
  };

  openReportGrossIncomeModal = () => {
    const showModal = () => {
      this.setState({ grossCustIncom_visible: true });
    };

    const handleOk = () => {
      setTimeout(() => {
        this.setState({ grossCustIncom_visible: false });
      }, 2000);
    };

    const handleCancel = () => {
      this.setState({ grossCustIncom_visible: false });
    };

    let displayDetail = <ReportGrossIncome />;
    return (
      <>
        <Space direction="vertical">
          <Button type="primary" onClick={showModal}>
            Report Gross Customer Income
          </Button>
          <Modal
            title="Report Gross Customer Income"
            visible={this.state.grossCustIncom_visible}
            onOk={handleOk}
            onCancel={handleCancel}
            width={1500}
            bodyStyle={{ height: 2500 }}
          >
            {displayDetail}
          </Modal>
        </Space>
      </>
    );
  };

  openReportRepairModal = () => {
    const showModal = () => {
      this.setState({ repairStat_visible: true });
    };

    const handleOk = () => {
      setTimeout(() => {
        this.setState({ repairStat_visible: false });
      }, 2000);
    };

    const handleCancel = () => {
      this.setState({ repairStat_visible: false });
    };

    let displayDetail = <ReportRepair />;
    return (
      <>
        <Space direction="vertical">
          <Button type="primary" onClick={showModal}>
            Report Repair
          </Button>
          <Modal
            title="Report Repair"
            visible={this.state.repairStat_visible}
            onOk={handleOk}
            onCancel={handleCancel}
            width={1500}
            bodyStyle={{ height: 2500 }}
          >
            {displayDetail}
          </Modal>
        </Space>
      </>
    );
  };

  openReportBelowCostSalesModal = () => {
    const showModal = () => {
      this.setState({ belowCostSale_visible: true });
    };

    const handleOk = () => {
      setTimeout(() => {
        this.setState({ belowCostSale_visible: false });
      }, 2000);
    };

    const handleCancel = () => {
      this.setState({ belowCostSale_visible: false });
    };

    let displayDetail = <ReportBelowCostSales />;
    return (
      <>
        <Space direction="vertical">
          <Button type="primary" onClick={showModal}>
            Report Below Cost Sales
          </Button>
          <Modal
            title="Report Below Cost Sales"
            visible={this.state.belowCostSale_visible}
            onOk={handleOk}
            onCancel={handleCancel}
            width={1500}
            bodyStyle={{ height: 2500 }}
          >
            {displayDetail}
          </Modal>
        </Space>
      </>
    );
  };

  openReportAvgTimeInInventoryModal = () => {
    const showModal = () => {
      this.setState({ avgTime_visible: true });
    };

    const handleOk = () => {
      setTimeout(() => {
        this.setState({ avgTime_visible: false });
      }, 2000);
    };

    const handleCancel = () => {
      this.setState({ avgTime_visible: false });
    };

    let displayDetail = <ReportAvgTimeInIventory />;
    return (
      <>
        <Space direction="vertical">
          <Button type="primary" onClick={showModal}>
            Report Average Time In Inventory
          </Button>
          <Modal
            title="Report Average Time In Inventory"
            visible={this.state.avgTime_visible}
            onOk={handleOk}
            onCancel={handleCancel}
            width={1500}
            bodyStyle={{ height: 2500 }}
          >
            {displayDetail}
          </Modal>
        </Space>
      </>
    );
  };

  openReportPartStatisticsModal = () => {
    const showModal = () => {
      this.setState({ partStatistics_visible: true });
    };

    const handleOk = () => {
      setTimeout(() => {
        this.setState({ partStatistics_visible: false });
      }, 2000);
    };

    const handleCancel = () => {
      this.setState({ partStatistics_visible: false });
    };

    let displayDetail = <ReportPartStatistics />;
    return (
      <>
        <Space direction="vertical">
          <Button type="primary" onClick={showModal}>
            Report Part Statistics
          </Button>
          <Modal
            title="Report Part Statistics"
            visible={this.state.partStatistics_visible}
            onOk={handleOk}
            onCancel={handleCancel}
            width={1500}
            bodyStyle={{ height: 2500 }}
          >
            {displayDetail}
          </Modal>
        </Space>
      </>
    );
  };

  openMonthlySalesModal = () => {
    const showModal = () => {
      this.setState({ monthlySale_visible: true });
    };

    const handleOk = () => {
      setTimeout(() => {
        this.setState({ monthlySale_visible: false });
      }, 2000);
    };

    const handleCancel = () => {
      this.setState({ monthlySale_visible: false });
    };

    let displayDetail = <MonthlySales />;

    return (
      <>
        <Space direction="vertical">
          <Button type="primary" onClick={showModal}>
            Monthly Sales
          </Button>
          <Modal
            title="Monthly sales"
            visible={this.state.monthlySale_visible}
            onOk={handleOk}
            onCancel={handleCancel}
            width={1500}
            bodyStyle={{ height: 2500 }}
          >
            {displayDetail}
          </Modal>
        </Space>
      </>
    );
  };

  render() {
    return (
      <div>
        <div>
          <Card title="Sales">
            <table>
              <tbody>
                <tr>
                  <td>{this.openReportSalesByColorModal()}</td>
                  <td>{this.openReportSalesByTypeModal()}</td>
                  <td>{this.openReportSalesByManufactModal()}</td>
                </tr>
                <tr>
                  <td>{this.openMonthlySalesModal()}</td>
                  <td>{this.openReportBelowCostSalesModal()}</td>
                </tr>
              </tbody>
            </table>
          </Card>
          <Card title="Gross Income">{this.openReportGrossIncomeModal()}</Card>
          <Card title="Repair">{this.openReportRepairModal()}</Card>
          <Card title="Inventory">
            {this.openReportAvgTimeInInventoryModal()}
          </Card>
          <Card title="Parts">{this.openReportPartStatisticsModal()}</Card>
        </div>
      </div>
    );
  }
}
