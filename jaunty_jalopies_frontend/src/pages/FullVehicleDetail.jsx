import React, { useState, useEffect } from "react";
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

import NewSaleModal from "./FVD_NewSaleModal";

import moment from "moment";
import axios from "axios";
import { render } from "@testing-library/react";
import { post, get } from "../components/request";

export default class FullVehicleDetail extends React.Component {
  constructor(props) {
    super(props);
    this.requestUrl = "http://localhost:8080";
    this.state = {
      vehicle_selected: props.vehicle_selected,
      userName: props.userName,
      userJob: props.userJob,
      repairHistory: [],
      salesHistory: [],
      requestUrl: "http://localhost:8080",
      boolRepairSection: false,
      boolSalesSection: false,
      canSell: props.vehicle_selected.sold_date == null ? true : false,
    };
    // console.log("vs", this.state.vehicle_selected);
  }

  static getDerivedStateFromProps(props, state) {
    if (
      props.vehicle_selected.vin != state.vehicle_selected.vin ||
      props.userName != state.userName ||
      props.userJob != state.userJob
    ) {
      return {
        vehicle_selected: props.vehicle_selected,
        repairHistory: [],
        salesHistory: [],
        boolRepairSection: false,
        boolSalesSection: false,
        userName: props.userName,
        userJob: props.userJob,
      };
    }
    return null;
  }

  getRepairHistory = () => {
    let repair_input = { vin: this.props.vehicle_selected.vin };
    axios
      .get(`${this.requestUrl}/api/vehicle/repair/detail`, {
        params: {
          vin: repair_input.vin,
        },
      })
      .then((response) => {
        this.setState({
          repairHistory: response.data.repairs,
          boolRepairSection: true,
        });
      });
  };

  getSalesHistory = () => {
    let sale_input = { vin: this.props.vehicle_selected.vin };
    axios
      .get(`${this.requestUrl}/api/vehicle/sale/detail`, {
        params: {
          vin: sale_input.vin,
        },
      })
      .then((response) => {
        this.setState({
          salesHistory: response.data.sales,
          boolSalesSection: true,
        });
      });
  };

  viewByRole = (props) => {
    let salesTable = (
      <div>
        <Button type="primary" onClick={this.getSalesHistory}>
          Show Sales History
        </Button>
        <div>
          <RenderSales
            salesHistory={this.state.salesHistory}
            salesFetched={this.state.boolSalesSection}
          ></RenderSales>
        </div>
      </div>
    );
    let repairsTable = (
      <div>
        <Button type="primary" onClick={this.getRepairHistory}>
          Show Repair History
        </Button>
        <div>
          <RenderRepair
            repairHistory={this.state.repairHistory}
            repairsFetched={this.state.boolRepairSection}
          ></RenderRepair>
        </div>
      </div>
    );
    let salesOperation = this.state.canSell ? (
      <NewSaleModal
        vehicle_selected={this.props.vehicle_selected}
        userName={this.props.userName}
        userJob={this.props.userJob}
      ></NewSaleModal>
    ) : this.state.canSell != null ? (
      <h6 style={{ color: "red" }}>This vehicle has already been sold. </h6>
    ) : null;

    const role = this.state.userJob;
    if (role == "Owner") {
      return (
        <div>
          {salesOperation}
          {salesTable}
          {repairsTable}
        </div>
      );
    } else if (role == "Salesperson") {
      return (
        <div>
          {salesOperation}
          {/* {salesTable} */}
        </div>
      );
    } else if (role == "Manager") {
      return (
        <div>
          {salesTable}
          {repairsTable}
        </div>
      );
    } else {
      return null;
    }
  };

  render() {
    let displayRepairHistory = "";
    let displaySalesHistory = "";

    console.log("render() repairHistory", this.state.repairHistory);
    if (this.state.boolRepairSection) {
      displayRepairHistory = (
        <RenderRepair
          repairHistory={this.state.repairHistory}
          repairsFetched={this.state.boolRepairSection}
        ></RenderRepair>
      );
    }

    console.log("~~~~~render() salesHistory", this.state.salesHistory);
    if (this.state.boolSalesSection) {
      displaySalesHistory = (
        <RenderSales
          salesHistory={this.state.salesHistory}
          salesFetched={this.state.boolSalesSection}
        ></RenderSales>
      );
    }

    return (
      <div>
        <div>
          <Detail
            vehicle_selected={this.props.vehicle_selected}
            userName={this.props.userName}
            userJob={this.props.userJob}
          />
        </div>
        <this.viewByRole></this.viewByRole>
      </div>
    );
  }
}

// Sales History
let RenderSales = (props) => {
  // console.log("~~~~~~~~~~~RenderSales~~~~~~~~~~props", props);
  let salesHistory = props.salesHistory;
  let customer = props.salesHistory.customer;
  console.log("salesHistory", salesHistory);
  console.log("customer", customer);
  let dataSource = "";
  let columns = "";
  // business customer
  if (customer != null && customer.tin) {
    dataSource =
      props.salesFetched && salesHistory.soldDate != null
        ? [
            {
              key: salesHistory.vin,
              soldDate: moment(salesHistory.soldDate).format("YYYY-MM-DD"),
              soldPrice: salesHistory.soldPrice.toFixed(2),
              salespersonName: salesHistory.salespersonUsername,
              listPrice: salesHistory.listPrice.toFixed(2),
              // business
              businessName: customer.businessName,
              contactName: customer.contactName,
              title: customer.title,
              // common info
              emailAddress: salesHistory.customer.emailAddress,
              phoneNumber: salesHistory.customer.phoneNumber,
              city: salesHistory.customer.city,
              streetAddress: salesHistory.customer.streetAddress,
              postalCode: salesHistory.customer.postalCode,
              state: salesHistory.customer.state,
            },
          ]
        : [];
    // console.log("Datasource in sale details", dataSource);
    columns = [
      {
        title: "Business Name",
        dataIndex: "businessName",
        key: "businessName",
      },
      {
        title: "Contact Name",
        dataIndex: "contactName",
        key: "contactName",
      },
      {
        title: "Title",
        dataIndex: "title",
        key: "title",
      },
      {
        title: "Email Address",
        dataIndex: "emailAddress",
        key: "emailAddress",
      },
      {
        title: "Phone Number",
        dataIndex: "phoneNumber",
        key: "phoneNumber",
      },
      {
        title: "City",
        dataIndex: "city",
        key: "city",
      },
      {
        title: "Street Address",
        dataIndex: "streetAddress",
        key: "streetAddress",
      },
      {
        title: "Postal Code",
        dataIndex: "postalCode",
        key: "postalCode",
      },
      {
        title: "State",
        dataIndex: "state",
        key: "state",
      },
      {
        title: "List Price",
        dataIndex: "listPrice",
        key: "listPrice",
      },
      {
        title: "Sold Price",
        dataIndex: "soldPrice",
        key: "soldPrice",
      },
      {
        title: "Sold Date",
        dataIndex: "soldDate",
        key: "soldDate",
      },
      {
        title: "Salesperson's Name",
        dataIndex: "salespersonName",
        key: "salespersonUsername",
      },
    ];
  } else {
    // individual customer
    dataSource =
      props.salesFetched && salesHistory.soldDate != null
        ? [
            {
              key: salesHistory.vin,
              soldDate: moment(salesHistory.soldDate).format("YYYY-MM-DD"),
              soldPrice: salesHistory.soldPrice.toFixed(2),
              salespersonName: salesHistory.salespersonUsername,
              listPrice: salesHistory.listPrice.toFixed(2),
              firstName: salesHistory.customer.firstName,
              lastName: salesHistory.customer.lastName,
              emailAddress: salesHistory.customer.emailAddress,
              phoneNumber: salesHistory.customer.phoneNumber,
              city: salesHistory.customer.city,
              streetAddress: salesHistory.customer.streetAddress,
              postalCode: salesHistory.customer.postalCode,
              state: salesHistory.customer.state,
            },
          ]
        : [];
    columns = [
      {
        title: "First Name",
        dataIndex: "firstName",
        key: "firstName",
      },
      {
        title: "Last Name",
        dataIndex: "lastName",
        key: "lastName",
      },
      {
        title: "Email Address",
        dataIndex: "emailAddress",
        key: "emailAddress",
      },
      {
        title: "Phone Number",
        dataIndex: "phoneNumber",
        key: "phoneNumber",
      },
      {
        title: "City",
        dataIndex: "city",
        key: "city",
      },
      {
        title: "Street Address",
        dataIndex: "streetAddress",
        key: "streetAddress",
      },
      {
        title: "Postal Code",
        dataIndex: "postalCode",
        key: "postalCode",
      },
      {
        title: "State",
        dataIndex: "state",
        key: "state",
      },
      {
        title: "List Price",
        dataIndex: "listPrice",
        key: "listPrice",
      },
      {
        title: "Sold Price",
        dataIndex: "soldPrice",
        key: "soldPrice",
      },
      {
        title: "Sold Date",
        dataIndex: "soldDate",
        key: "soldDate",
      },
      {
        title: "Salesperson's Name",
        dataIndex: "salespersonName",
        key: "salespersonUsername",
      },
    ];
  }

  return props.salesFetched ? (
    <div>
      <h3>Sales History</h3>
      <Table dataSource={dataSource} columns={columns} scroll={{ x: 800 }} />
    </div>
  ) : null;
};

// Repair History
let RenderRepair = (props) => {
  // console.log("~~~~~~~~~~~RenderRepair~~~~~~~~~~props", props);
  let repairHistory = props.repairHistory;
  let dataSource = [];
  for (var i in repairHistory) {
    let cur = {};
    cur["key"] = i;
    cur["complete_date"] =
      repairHistory[i].complete_date == null
        ? null
        : moment(repairHistory[i].complete_date).format("YYYY-MM-DD");
    cur["customer_name"] = repairHistory[i].customer_name;
    cur["labor_charge"] = repairHistory[i].labor_charge.toFixed(2);
    cur["service_writer_name"] = repairHistory[i].service_writer_name;
    cur["start_date"] = moment(repairHistory[i].start_date).format(
      "YYYY-MM-DD"
    );
    cur["total_cost"] = repairHistory[i].total_cost.toFixed(2);
    cur["total_part_cost"] = repairHistory[i].total_part_cost.toFixed(2);
    dataSource.push(cur);
  }
  console.log("repair dataSource", dataSource);

  const columns = [
    {
      title: "Customer Name",
      dataIndex: "customer_name",
      key: "customer_name",
    },
    {
      title: "Service Writer Name",
      dataIndex: "service_writer_name",
      key: "service_writer_name",
    },
    {
      title: "Start Date",
      dataIndex: "start_date",
      key: "start_date",
    },
    {
      title: "Complete Date",
      dataIndex: "complete_date",
      key: "complete_date",
    },
    
    {
      title: "Labor Charge",
      dataIndex: "labor_charge",
      key: "labor_charge",
    },
    {
      title: "Total Part Cost",
      dataIndex: "total_part_cost",
      key: "total_part_cost",
    },
    {
      title: "Total Cost",
      dataIndex: "total_cost",
      key: "total_cost",
    },
  ];

  return props.repairsFetched ? (
    <div>
      <h3>Repair History</h3>
      <Table dataSource={dataSource} columns={columns} scroll={{ x: 800 }} />
    </div>
  ) : null;
};

let Detail = (props) => {
  let vehicle_selected = props.vehicle_selected;
  // console.log("+++++++++++++++++++++++++++inside Detail", vehicle_selected);
  let userJob = props.userJob;
  let columns = "";
  let dataSource;

  // VIN, vehicle type, attributes for that vehicle type, Model Year, Model Name, Manufacturer, color(s), list price (NOT invoice price), and the description f
  if (vehicle_selected.vehicle_type == "Car") {
    dataSource = [
      {
        key: "1",
        vin: vehicle_selected.vin,
        vehicleType: vehicle_selected.vehicle_type,
        number_of_doors: vehicle_selected.number_of_doors, // vt attribute
        modelYear: vehicle_selected.model_year,
        modelName: vehicle_selected.model_name,
        manufacturer: vehicle_selected.manufacturer_name,
        colors: vehicle_selected.colors,
        listPrice: vehicle_selected.list_price.toFixed(2),
        description: vehicle_selected.description,
      },
    ];
    columns = [
      {
        title: "VIN",
        dataIndex: "vin",
        key: "vin",
      },
      {
        title: "Vehicle Type",
        dataIndex: "vehicleType",
        key: "vehicleType",
      },
      {
        title: "Number of Doors",
        dataIndex: "number_of_doors",
        key: "number_of_doors",
      },
      {
        title: "Model Year",
        dataIndex: "modelYear",
        key: "modelYear",
      },
      {
        title: "Model Name",
        dataIndex: "modelName",
        key: "modelName",
      },
      {
        title: "Manufacturer",
        dataIndex: "manufacturer",
        key: "manufacturer",
      },
      {
        title: "Color(s)",
        dataIndex: "colors",
        key: "colors",
      },
      {
        title: "List Price",
        dataIndex: "listPrice",
        key: "listPrice",
      },
      {
        title: "Description",
        dataIndex: "description",
        key: "description",
      },
    ];
  } else if (vehicle_selected.vehicle_type == "Convertible") {
    dataSource = [
      {
        key: "1",
        vin: vehicle_selected.vin,
        vehicleType: vehicle_selected.vehicle_type,
        roof_type: vehicle_selected.roof_type, // vt attribute
        back_seat_count: vehicle_selected.back_seat_count, // vt attribute
        modelYear: vehicle_selected.model_year,
        modelName: vehicle_selected.model_name,
        manufacturer: vehicle_selected.manufacturer_name,
        colors: vehicle_selected.colors,
        listPrice: vehicle_selected.list_price.toFixed(2),
        description: vehicle_selected.description,
      },
    ];
    columns = [
      {
        title: "VIN",
        dataIndex: "vin",
        key: "vin",
      },
      {
        title: "Vehicle Type",
        dataIndex: "vehicleType",
        key: "vehicleType",
      },
      {
        title: "Roof Type",
        dataIndex: "roof_type",
        key: "roof_type",
      },
      {
        title: "Back Seat Count",
        dataIndex: "back_seat_count",
        key: "back_seat_count",
      },
      {
        title: "Model Year",
        dataIndex: "modelYear",
        key: "modelYear",
      },
      {
        title: "Model Name",
        dataIndex: "modelName",
        key: "modelName",
      },
      {
        title: "Manufacturer",
        dataIndex: "manufacturer",
        key: "manufacturer",
      },
      {
        title: "Color(s)",
        dataIndex: "colors",
        key: "colors",
      },
      {
        title: "List Price",
        dataIndex: "listPrice",
        key: "listPrice",
      },
      {
        title: "Description",
        dataIndex: "description",
        key: "description",
      },
    ];
  } else if (vehicle_selected.vehicle_type == "Truck") {
    dataSource = [
      {
        key: "1",
        vin: vehicle_selected.vin,
        vehicleType: vehicle_selected.vehicle_type,
        cargo_capacity: vehicle_selected.cargo_capacity, // vt attribute
        cargo_cover_type: vehicle_selected.cargo_cover_type, // vt attribute
        num_of_rear_axies: vehicle_selected.num_of_rear_axies, // vt attribute
        modelYear: vehicle_selected.model_year,
        modelName: vehicle_selected.model_name,
        manufacturer: vehicle_selected.manufacturer_name,
        colors: vehicle_selected.colors,
        listPrice: vehicle_selected.list_price.toFixed(2),
        description: vehicle_selected.description,
      },
    ];
    columns = [
      {
        title: "VIN",
        dataIndex: "vin",
        key: "vin",
      },
      {
        title: "Vehicle Type",
        dataIndex: "vehicleType",
        key: "vehicleType",
      },
      {
        title: "Cargo capacity (in tons)",
        dataIndex: "cargo_capacity",
        key: "cargo_capacity",
      },
      {
        title: "Cargo cover type (optional)",
        dataIndex: "cargo_cover_type",
        key: "cargo_cover_type",
      },
      {
        title: "Number of rear axles",
        dataIndex: "num_of_rear_axies",
        key: "num_of_rear_axies",
      },
      {
        title: "Model Year",
        dataIndex: "modelYear",
        key: "modelYear",
      },
      {
        title: "Model Name",
        dataIndex: "modelName",
        key: "modelName",
      },
      {
        title: "Manufacturer",
        dataIndex: "manufacturer",
        key: "manufacturer",
      },
      {
        title: "Color(s)",
        dataIndex: "colors",
        key: "colors",
      },
      {
        title: "List Price",
        dataIndex: "listPrice",
        key: "listPrice",
      },
      {
        title: "Description",
        dataIndex: "description",
        key: "description",
      },
    ];
  } else if (vehicle_selected.vehicle_type == "VanMinivan") {
    let has_drivers_side_back_door = vehicle_selected.has_drivers_side_back_door
      ? "Yes"
      : "No";
    dataSource = [
      {
        key: "1",
        vin: vehicle_selected.vin,
        vehicleType: vehicle_selected.vehicle_type,
        has_drivers_side_back_door: has_drivers_side_back_door, // vt attribute
        modelYear: vehicle_selected.model_year,
        modelName: vehicle_selected.model_name,
        manufacturer: vehicle_selected.manufacturer_name,
        colors: vehicle_selected.colors,
        listPrice: vehicle_selected.list_price.toFixed(2),
        description: vehicle_selected.description,
      },
    ];
    columns = [
      {
        title: "VIN",
        dataIndex: "vin",
        key: "vin",
      },
      {
        title: "Vehicle Type",
        dataIndex: "vehicleType",
        key: "vehicleType",
      },
      {
        title: "Has Driver’s Side Back Door",
        dataIndex: "has_drivers_side_back_door",
        key: "has_drivers_side_back_door",
      },
      {
        title: "Model Year",
        dataIndex: "modelYear",
        key: "modelYear",
      },
      {
        title: "Model Name",
        dataIndex: "modelName",
        key: "modelName",
      },
      {
        title: "Manufacturer",
        dataIndex: "manufacturer",
        key: "manufacturer",
      },
      {
        title: "Color(s)",
        dataIndex: "colors",
        key: "colors",
      },
      {
        title: "List Price",
        dataIndex: "listPrice",
        key: "listPrice",
      },
      {
        title: "Description",
        dataIndex: "description",
        key: "description",
      },
    ];
  } else if (vehicle_selected.vehicle_type == "SUV") {
    dataSource = [
      {
        key: "1",
        vin: vehicle_selected.vin,
        vehicleType: vehicle_selected.vehicle_type,
        drivetrain_type: vehicle_selected.drivetrain_type, // vt attribute
        num_of_cupholders: vehicle_selected.num_of_cupholders, // vt attribute
        modelYear: vehicle_selected.model_year,
        modelName: vehicle_selected.model_name,
        manufacturer: vehicle_selected.manufacturer_name,
        colors: vehicle_selected.colors,
        listPrice: vehicle_selected.list_price.toFixed(2),
        description: vehicle_selected.description,
      },
    ];
    columns = [
      {
        title: "VIN",
        dataIndex: "vin",
        key: "vin",
      },
      {
        title: "Vehicle Type",
        dataIndex: "vehicleType",
        key: "vehicleType",
      },
      {
        title: "Drivetrain Type",
        dataIndex: "drivetrain_type",
        key: "drivetrain_type",
      },
      {
        title: "Number of cupholders",
        dataIndex: "num_of_cupholders",
        key: "num_of_cupholders",
      },
      {
        title: "Model Year",
        dataIndex: "modelYear",
        key: "modelYear",
      },
      {
        title: "Model Name",
        dataIndex: "modelName",
        key: "modelName",
      },
      {
        title: "Manufacturer",
        dataIndex: "manufacturer",
        key: "manufacturer",
      },
      {
        title: "Color(s)",
        dataIndex: "colors",
        key: "colors",
      },
      {
        title: "List Price",
        dataIndex: "listPrice",
        key: "listPrice",
      },
      {
        title: "Description",
        dataIndex: "description",
        key: "description",
      },
    ];
  }

  // inventory clerk or owner - display invoice price
  let displayInvoicePrice = "";
  if (userJob == "InventoryClerk" || userJob == "Owner") {
    let dataSource = [
      { key: 1, invoice_price: vehicle_selected.invoice_price.toFixed(2) },
    ];
    let columns = [
      {
        title: "Invoice Price",
        dataIndex: "invoice_price",
        key: "invoice_price",
      },
    ];
    displayInvoicePrice = (
      <Table
        dataSource={dataSource}
        columns={columns}
        scroll={{ x: 800 }}
      ></Table>
    );
  }

  return (
    <div>
      <Table
        dataSource={dataSource}
        columns={columns}
        scroll={{ x: 800 }}
      ></Table>
      <div>{displayInvoicePrice}</div>
    </div>
  );
};
