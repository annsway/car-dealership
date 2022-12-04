import React, { Component } from "react";

import { BrowserRouter as Link } from "react-router-dom";
import { Input, Card, Button, Row, Modal, Space } from "antd";
import { post, get } from "../components/request";
import axios from "axios";
import "antd/dist/antd.css";
import AddCustomer from "./AddCustomer";
import PubSub from "pubsub-js";

export default class CustomerSearch extends React.Component {
  constructor(props) {
    super(props);
    this.requestUrl = "http://localhost:8080";
    this.state = {
      isCustomerFound: false,
      searchID: "",
      customerFound: [],
      canAddCustomer: false,
      addCustomer_visible: false,
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  // get userName data from <Child Function />
  componentDidMount() {
    this.triggerAddCustomerToken = PubSub.subscribe(
      "triggerAddCustomer",
      (_, data) => {
        this.setState({
          canAddCustomer: data.canAddCustomer,
        });
      }
    );
  }

  componentWillUnmount() {
    PubSub.unsubscribe(this.triggerAddCustomerToken);
  }

  handleChange = (e) => {
    this.setState({
      searchID: e.target.value,
    });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    let customer_input = { searchID: this.state.searchID };
    if (this.state.searchID == "" || this.state.searchID == null) {
      alert("Please input driving license or TIN!");
    } else {
      axios
        .get(`${this.requestUrl}/api/customer/find`, {
          params: { searchID: this.state.searchID },
        })
        .then((response) => {
          // handle success
          this.setState({
            customerFound: response.data,
            isCustomerFound: true,
          });
        });
    }

  };

  openAddCustomerTypeModal = () => {
    const showModal = () => {
      this.setState({ addCustomer_visible: true });
    };

    const handleOk = () => {
      setTimeout(() => {
        this.setState({ addCustomer_visible: false });
      }, 2000);
    };

    const handleCancel = () => {
      this.setState({ addCustomer_visible: false });
    };

    let displayDetail = <AddCustomer />;
    return (
      <div>
        <Space direction="vertical">
          <Button type="secondary" onClick={showModal}>
            Open New Customer Form
          </Button>
          <Modal
            title="New Customer Form"
            visible={this.state.addCustomer_visible}
            onOk={handleOk}
            onCancel={handleCancel}
            width={1500}
            bodyStyle={{ height: 800 }}
          >
            {displayDetail}
          </Modal>
        </Space>
      </div>
    );
  };

  render() {
    let display;
    let customerFound;
    let displayAddCustomerBtn = "";
    if (this.state.canAddCustomer) {
      console.log("parent comp canAddCustomer", this.state.canAddCustomer);
      displayAddCustomerBtn = this.openAddCustomerTypeModal();
    }
    if (this.state.isCustomerFound) {
      customerFound = this.state.customerFound;
      display = (
        <DisplaySearchResult
          customerFound={customerFound}
          onClick={this.handleSubmit}
          popAddCustomer={this.openAddCustomerTypeModal}
        />
      );
    }
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <label>
            Search ID:
            <Input
              type="text"
              className="inputsearchID"
              value={this.state.searchID}
              onChange={this.handleChange}
            />
          </label>
          <input type="submit" value="Search" />
        </form>
        <div>{display}</div>
        <div>{displayAddCustomerBtn}</div>
      </div>
    );
  }
}

function DisplaySearchResult(props) {
  console.log("CS - DisplaySearchResult", props);
  let canAddCustomer = false;
  let displayAddCustomer = "";

  let onClickAddCustomer = () => {
    canAddCustomer = true;
    PubSub.publish("triggerAddCustomer", {
      canAddCustomer: canAddCustomer,
    });
  };
  if (canAddCustomer) {
    console.log("print canAddCustomer --- ", canAddCustomer);
    displayAddCustomer = props.popAddCustomer;
  }
  if (
    props == null ||
    props.customerFound == null ||
    props.customerFound.customer == null
  ) {
    return (
      <div>
        <p style={{ color: "red" }}>
          Customer Not Found. Please Add Customer before proceed.{" "}
        </p>
        <Button
          onClick={onClickAddCustomer}
          type="primary"
          shape="round"
          className="AddCustomerBtn"
        >
          Add Customer
        </Button>
        <div>{displayAddCustomer}</div>
      </div>
    );
  } else if (props.customerFound.customer.drivers_license_no) {
    return (
      <div>
        <Card>
          <table className="table">
            <thead>
              <tr>
                <th scope="col">Drivers' License Number</th>
                <th scope="col">Frist Name</th>
                <th scope="col">Last Name</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{props.customerFound.customer.drivers_license_no}</td>
                <td>{props.customerFound.customer.first_name}</td>
                <td>{props.customerFound.customer.last_name}</td>
              </tr>
            </tbody>
          </table>
        </Card>
      </div>
    );
  } else if (props.customerFound.customer.tin) {
    return (
      <div>
        <Card>
          <table className="table">
            <thead>
              <tr>
                <th scope="col">TIN</th>
                <th scope="col">Business Name</th>
                <th scope="col">Primary Contact’s Title</th>
                <th scope="col">ContactName</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{props.customerFound.customer.tin}</td>
                <td>{props.customerFound.customer.business_name}</td>
                <td>{props.customerFound.customer.title}</td>
                <td>{props.customerFound.customer.contact_name}</td>
              </tr>
            </tbody>
          </table>
        </Card>
      </div>
    );
  } else {
    alert("Invalid operation!");
  }
}
