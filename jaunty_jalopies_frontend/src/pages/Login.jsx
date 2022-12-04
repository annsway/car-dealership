import React, { Component } from "react";
import "antd/dist/antd.css";
import { Input, Card, Button, Row, Form, Modal, Space } from "antd";
import {
  UserOutlined,
  EyeTwoTone,
  EyeInvisibleOutlined,
} from "@ant-design/icons";

import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

import AddCustomer from "./AddCustomer";
import AddVehicle from "./AddVehicle";
import CustomerSearch from "./CustomerSearch";
import FullVehicleDetail from "./FullVehicleDetail";
import Repair from "./Repair";
import Reports from "./Reports";
import SellVehicle from "./SellVehicle";
import DisplayVehicleSearch from "./DisplayVehicleSearch";
import PubSub from "pubsub-js";
import { post, get } from "../components/request";

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.handleLoginClick = this.handleLoginClick.bind(this);
    this.handleLogoutClick = this.handleLogoutClick.bind(this);
    this.handleNameChange = this.handleNameChange.bind(this);
    this.handlePwdChange = this.handlePwdChange.bind(this);
    this.state = {
      isLoggedIn: false,
      name: "",
      pwd: "",
      job: "",
      loginResp: "",
      userName: "",
      sellVehicleVisible: false,
      addVehicleVisible: false,
      repairVisible: false,
      reportVisible: false,
      content: null,
    };
    this.requestUrl = "http://localhost:8080";
  }

  handleLoginClick() {
    let login_input = { username: this.state.name, password: this.state.pwd };

    post(`${this.requestUrl}/api/login`, login_input).then((resp) => {
      if (resp.code == 2000) {
        alert("Invalid username or password!");
      } else {
        this.setState({
          isLoggedIn: true,
          job: resp.userInfo.job,
          loginResp: resp.msg,
          userName: resp.userInfo.username,
        });
        PubSub.publish("userName", {
          userName: this.state.userName,
          job: this.state.job,
        });
        console.log("Inside handleLoginClick + userJob: ", this.state.job);
      }
    });
  }

  handleLogoutClick() {
    this.setState({
      isLoggedIn: false,
      name: "",
      pwd: "",
      job: "",
      userName: "",
    });
    PubSub.publish("userName", { userName: this.state.userName });
  }

  handleNameChange(event) {
    this.setState({ name: event.target.value });
  }

  handlePwdChange(event) {
    this.setState({ pwd: event.target.value });
  }

  openRepairModal = () => {
    const showModal = () => {
      this.setState({ visible: true });
    };

    const handleOk = () => {
      setTimeout(() => {
        this.setState({ visible: false });
      }, 2000);
    };

    const handleCancel = () => {
      this.setState({ visible: false });
    };

    let displayDetail = (
      <Repair userName={this.state.userName} userJob={this.state.job} />
    );

    return (
      <>
        <Space direction="vertical">
          <Button type="primary" onClick={showModal}>
            Repair
          </Button>
          <Modal
            title="Repair"
            visible={this.state.visible}
            onOk={handleOk}
            onCancel={handleCancel}
            width={1500}
            bodyStyle={{ height: 1000 }}
          >
            {displayDetail}
          </Modal>
        </Space>
      </>
    );
  };

  openSellVehicleModal = () => {
    const showModal = () => {
      this.setState({ visible: true });
    };

    const handleOk = () => {
      setTimeout(() => {
        this.setState({ visible: false });
      }, 2000);
    };

    const handleCancel = () => {
      this.setState({ visible: false });
    };

    let displayDetail = <SellVehicle />;

    return (
      <>
        <Space direction="vertical">
          <Button type="primary" onClick={showModal}>
            Sell Vehicle
          </Button>
          <Modal
            title="Sell Vehicle"
            visible={this.state.visible}
            onOk={handleOk}
            onCancel={handleCancel}
            width={1500}
            bodyStyle={{ height: 1000 }}
          >
            {displayDetail}
          </Modal>
        </Space>
      </>
    );
  };

  openAddVehicleModal = () => {
    const showModal = () => {
      this.setState({ visible: true });
    };

    const handleOk = () => {
      setTimeout(() => {
        this.setState({ visible: false });
      }, 2000);
    };

    const handleCancel = () => {
      this.setState({ visible: false });
    };

    let displayDetail = <AddVehicle userName={this.state.userName} />;

    return (
      <>
        <Space direction="vertical">
          <Button type="primary" onClick={showModal}>
            Add Vehicle
          </Button>
          <Modal
            title="Add Vehicle"
            visible={this.state.visible}
            onOk={handleOk}
            onCancel={handleCancel}
            width={1500}
            bodyStyle={{ height: 1000 }}
          >
            {displayDetail}
          </Modal>
        </Space>
      </>
    );
  };

  openReportModal = () => {
    const showModal = () => {
      this.setState({ visible: true });
    };

    const handleOk = () => {
      setTimeout(() => {
        this.setState({ visible: false });
      }, 2000);
    };

    const handleCancel = () => {
      this.setState({ visible: false });
    };

    let displayDetail = <Reports />;

    return (
      <>
        <Space direction="vertical">
          <Button type="primary" onClick={showModal}>
            Reports
          </Button>
          <Modal
            title="Reports"
            visible={this.state.visible}
            onOk={handleOk}
            onCancel={handleCancel}
            width={1500}
            bodyStyle={{ height: 1000 }}
          >
            {displayDetail}
          </Modal>
        </Space>
      </>
    );
  };

  ShowRoleActions = (job) => {
    if (job == "Salesperson") {
      return (
        <div>
          <div>
            <Card title="Salesperson Modules" className="salesperson_mod">
              {this.openSellVehicleModal()}
            </Card>
          </div>
        </div>
      );
    } else if (job == "InventoryClerk") {
      return (
        <div>
          <div>
            <Card title="InventoryClerk Modules" className="inventoryClerk_mod">
              {this.openAddVehicleModal()}
            </Card>
          </div>
        </div>
      );
    } else if (job == "ServiceWriter") {
      return (
        <div>
          <div>
            <Card title="ServiceWriter Modules" className="serviceWriter_mod">
              {this.openRepairModal()}
            </Card>
          </div>
        </div>
      );
    } else if (job == "Owner") {
      return (
        <div>
          <div>
            <Card title="Owner Modules" className="owner_mod">
              <table className="table">
                <tbody>
                  <tr>
                    <td>{this.openSellVehicleModal()}</td>
                    <td>{this.openAddVehicleModal()}</td>
                    <td>{this.openRepairModal()}</td>
                    <td>{this.openReportModal()}</td>
                  </tr>
                </tbody>
              </table>
            </Card>
          </div>
        </div>
      );
    } else if (job == "Manager") {
      return (
        <div>
          <div>
            <Card title="Manager Modules" className="manager_mod">
              {this.openReportModal()}
            </Card>
          </div>
        </div>
      );
    }

    return <h5></h5>;
  };

  render() {
    const isLoggedIn = this.state.isLoggedIn;
    const userName = this.state.name;
    let button;

    if (isLoggedIn) {
      button = <LogoutButton onClick={this.handleLogoutClick} />;
    } else {
      button = <LoginButton onClick={this.handleLoginClick} />;
    }

    return (
      <div>
        <Row justify="left" align="middle" className="login_site_ground">
          <Card title="User Login" className="login_card">
            <Greeting
              isLoggedIn={isLoggedIn}
              name={this.state.name}
              job={this.state.job}
            />
            <Input
              placeholder="user name"
              suffix={<UserOutlined />}
              className="login_user_input"
              onChange={this.handleNameChange}
              value={this.state.name}
            />
            <br />
            <Input.Password
              className="login_user_password"
              placeholder="please enter password"
              iconRender={(visible) =>
                visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
              }
              onChange={this.handlePwdChange}
              value={this.state.pwd}
            />
            <br />
            {button}
            <br />
          </Card>
          {this.state.job == "Owner" ? (
            <Card title="Owner Modules" className="owner_mod">
              <Space direction="vertical">
                <Button
                  type="primary"
                  onClick={() => {
                    this.setState({ sellVehicleVisible: true });
                  }}
                >
                  Sell Vehicle
                </Button>
                <Modal
                  title="Sell Vehicle"
                  visible={this.state.sellVehicleVisible}
                  width={1500}
                  bodyStyle={{ height: 1000 }}
                  onOk={() => {
                    this.setState({ sellVehicleVisible: false });
                  }}
                  onCancel={() => {
                    this.setState({ sellVehicleVisible: false });
                  }}
                >
                  <SellVehicle />
                </Modal>
              </Space>
              <Space direction="vertical">
                <Button
                  type="primary"
                  onClick={() => {
                    this.setState({ addVehicleVisible: true });
                  }}
                >
                  Add Vehicle
                </Button>
                <Modal
                  title="Add Vehicle"
                  visible={this.state.addVehicleVisible}
                  width={1500}
                  bodyStyle={{ height: 1000 }}
                  onOk={() => {
                    this.setState({ addVehicleVisible: false });
                  }}
                  onCancel={() => {
                    this.setState({ addVehicleVisible: false });
                  }}
                >
                  <AddVehicle userName={this.state.userName} />
                </Modal>
              </Space>
              <Space direction="vertical">
                <Button
                  type="primary"
                  onClick={() => {
                    this.setState({ repairVisible: true });
                  }}
                >
                  Repair
                </Button>
                <Modal
                  title="Repair"
                  visible={this.state.repairVisible}
                  width={1500}
                  bodyStyle={{ height: 1000 }}
                  onOk={() => {
                    this.setState({ repairVisible: false });
                  }}
                  onCancel={() => {
                    this.setState({ repairVisible: false });
                  }}
                >
                  <Repair
                    userName={this.state.userName}
                    userJob={this.state.job}
                  />
                </Modal>
              </Space>
              <Space direction="vertical">
                <Button
                  type="primary"
                  onClick={() => {
                    this.setState({ visible: true });
                  }}
                >
                  Report
                </Button>
                <Modal
                  title="Report"
                  visible={this.state.visible}
                  width={1500}
                  bodyStyle={{ height: 1000 }}
                  onOk={() => {
                    this.setState({ visible: false });
                  }}
                  onCancel={() => {
                    this.setState({ visible: false });
                  }}
                >
                  <Reports />
                </Modal>
              </Space>
            </Card>
          ) : null}
          {this.state.job == "Manager" ? (
            <Card title="Manager Modules" className="owner_mod">
              <Space direction="vertical">
                <Button
                  type="primary"
                  onClick={() => {
                    this.setState({ reportVisible: true });
                  }}
                >
                  Report
                </Button>
                <Modal
                  title="Report"
                  visible={this.state.reportVisible}
                  width={1500}
                  bodyStyle={{ height: 1000 }}
                  onOk={() => {
                    this.setState({ reportVisible: false });
                  }}
                  onCancel={() => {
                    this.setState({ reportVisible: false });
                  }}
                >
                  <Reports />
                </Modal>
              </Space>
            </Card>
          ) : null}
          {this.state.job == "Salesperson" ? (
            <Card title="Salesperson Modules">
              <Space direction="vertical">
                <Button
                  type="primary"
                  onClick={() => {
                    this.setState({ sellVehicleVisible: true });
                  }}
                >
                  Sell Vehicle
                </Button>
                <Modal
                  title="Sell Vehicle"
                  visible={this.state.sellVehicleVisible}
                  width={1500}
                  bodyStyle={{ height: 1000 }}
                  onOk={() => {
                    this.setState({ sellVehicleVisible: false });
                  }}
                  onCancel={() => {
                    this.setState({ sellVehicleVisible: false });
                  }}
                >
                  <SellVehicle />
                </Modal>
              </Space>
            </Card>
          ) : null}
          {this.state.job == "InventoryClerk" ? (
            <Card title="InventoryClerk Modules">
              <Space direction="vertical">
                <Button
                  type="primary"
                  onClick={() => {
                    this.setState({ addVehicleVisible: true });
                  }}
                >
                  Add Vehicle
                </Button>
                <Modal
                  title="Add Vehicle"
                  visible={this.state.addVehicleVisible}
                  width={1500}
                  bodyStyle={{ height: 1000 }}
                  onOk={() => {
                    this.setState({ addVehicleVisible: false });
                  }}
                  onCancel={() => {
                    this.setState({ addVehicleVisible: false });
                  }}
                >
                  <AddVehicle userName={this.state.userName} />
                </Modal>
              </Space>
            </Card>
          ) : null}
          {this.state.job == "ServiceWriter" ? (
            <Card title="ServiceWriter Modules">
              <Space direction="vertical">
                <Button
                  type="primary"
                  onClick={() => {
                    this.setState({ repairVisible: true });
                  }}
                >
                  Repair
                </Button>
                <Modal
                  title="Repair"
                  visible={this.state.repairVisible}
                  width={1500}
                  bodyStyle={{ height: 1000 }}
                  onOk={() => {
                    this.setState({ repairVisible: false });
                  }}
                  onCancel={() => {
                    this.setState({ repairVisible: false });
                  }}
                >
                  <Repair
                    userName={this.state.userName}
                    userJob={this.state.job}
                  />
                </Modal>
              </Space>
            </Card>
          ) : null}
          {/* {this.ShowRoleActions(this.state.job)} */}
        </Row>
        <div>
          <DisplayVehicleSearch job={this.state.job} />
        </div>
      </div>
    );
  }
}

function Greeting(props) {
  const isLoggedIn = props.isLoggedIn;
  if (isLoggedIn) {
    return (
      <h5>
        {props.name} is signed in as {props.job}
      </h5>
    );
  }
  return <h4>Please sign up.</h4>;
}

function LoginButton(props) {
  return (
    <Button type="primary" className="login_btn" onClick={props.onClick}>
      Login
    </Button>
  );
}

function LogoutButton(props) {
  return (
    <Button type="primary" className="logout_btn" onClick={props.onClick}>
      Logout
    </Button>
  );
}
