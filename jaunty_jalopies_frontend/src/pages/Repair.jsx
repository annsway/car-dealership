import React from "react";
import {
  Input,
  Card,
  Button,
  Modal,
  Space,
  Form,
  DatePicker,
  InputNumber,
} from "antd";

import moment from "moment";
import axios from "axios";
import "antd/dist/antd.css";
import CustomerSearch from "./CustomerSearch";

export default class Repair extends React.Component {
  constructor(props) {
    super(props);
    this.requestUrl = "http://localhost:8080";
    this.currentUrl = "http://localhost:3000";
    console.log("props", props);
    this.state = {
      showRepairHistory: false,
      isVehicleFound: false,
      isVehicleSold: false,
      vin: "",
      vehicleFound: [],
      repairHistory: [],
      userName: props.userName,
      userJob: props.userJob,
      // control modals
      visible: false,
      visible_modify: false,
      visible_add_parts: false,
      isClickedNewRepair: false,
      value: "", // input_customer_search_id
      customer: null, // this is an object
      loading: false,
      // new repair form
      customerID: "",
      startDate: new Date().toLocaleDateString("en-CA"),
      odometerReading: 0,
      laborCharge: 0,
      description: "",
      // modify labor charge form
      minLaborCharge: 0,
      // add part form
      partVendor: "",
      partQty: 0,
      partNumber: "",
      partPrice: 0,
      // Customer Lookup
      showCustomerSearch: false,
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange = (e) => {
    this.setState({
      vin: e.target.value,
    });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    let repair_input = { vin: this.state.vin };
    axios
      .post(`${this.requestUrl}/api/vehicle/search`, repair_input)
      .then((response) => {
        // handle success
        // console.log(response);
        if (
          response.status == 200 &&
          response.data.vehicles != null &&
          response.data.vehicles.length != 0
        ) {
          this.setState({
            vehicleFound: response.data.vehicles,
            isVehicleFound: true,
            showRepairHistory: false,
          });
          if (response.data.vehicles[0].sold_date != null) {
            this.setState({
              isVehicleSold: true,
            });
          }
        } else {
          alert("Please check your input VIN and try again!");
        }
      });
  };

  displaySearchResult = () => {
    let vehicleFound = this.state.vehicleFound[0];
    if (vehicleFound != null) {
      let canRepair = false;
      if (this.state.isVehicleSold) {
        canRepair = true;
      }
      let renderRepairBtn = "";
      if (canRepair) {
        renderRepairBtn = (
          <Button type="primary" onClick={this.handleRepairHistory}>
            Repair
          </Button>
        );
      } else {
        renderRepairBtn = (
          <div>
            <Button type="primary" onClick={this.handleRepairHistory} disabled>
              Repair
            </Button>
            <p style={{ color: "blue" }}>
              Vehicle has NOT been sold yet. You cannot start new repair on
              unsold vehicle.
            </p>
          </div>
        );
      }
      return (
        <div>
          <Card>
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">VIN</th>
                  <th scope="col">Model Name</th>
                  <th scope="col">Model Year</th>
                  <th scope="col">Manufacturer</th>
                  <th scope="col">Color</th>
                  <th scope="col">Vehicle Type</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{vehicleFound.vin}</td>
                  <td>{vehicleFound.model_name}</td>
                  <td>{vehicleFound.model_year}</td>
                  <td>{vehicleFound.manufacturer_name}</td>
                  <td>{vehicleFound.colors}</td>
                  <td>{vehicleFound.vehicle_type}</td>
                </tr>
              </tbody>
            </table>
            <div>{renderRepairBtn}</div>
          </Card>
        </div>
      );
    } else {
      return <div></div>;
    }
  };

  handleRepairHistory = () => {
    let repair_input = { vin: this.state.vin };
    axios
      .get(`${this.requestUrl}/api/vehicle/repair/detail`, {
        params: {
          vin: repair_input.vin,
        },
      })
      .then((response) => {
        if (response.data.code == 200) {
          // handle success
          this.setState({
            repairHistory: response.data.repairs,
            showRepairHistory: true,
          });
        } else {
          alert("Invalid operation. Please try again. ");
        }
        // console.log("response.data", response.data);
      });
  };

  displayRepairHistory = () => {
    let repairHistory = this.state.repairHistory;
    if (repairHistory == null || repairHistory.length == 0) {
      return (
        <div>
          <Card>
            <h3>No Repair History</h3>
            <div>{this.openNewRepairModal()}</div>
          </Card>
        </div>
      );
    } else if (
      // has no unfinished repair
      repairHistory[0].complete_date != null
    ) {
      return (
        <div>
          <Card>
            <h3>Repair History</h3>
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">Customer</th>
                  <th scope="col">Service Writer</th>
                  <th scope="col">Start Date</th>
                  <th scope="col">Complete Date</th>
                  <th scope="col">Labor Charge</th>
                  <th scope="col">Total Part Cost</th>
                  <th scope="col">Total Cost</th>
                  <th scope="col">Action</th>
                </tr>
              </thead>
              <tbody>
                {repairHistory.map((value, key) => {
                  return (
                    <tr key={key}>
                      {Object.keys(value).map((keys) => {
                        var value_out = value[keys];
                        if (keys == "start_date" || keys == "complete_date") {
                          value_out = moment(value_out).format("YYYY-MM-DD");
                        } else if (
                          keys == "total_part_cost" ||
                          keys == "total_cost"
                        ) {
                          value_out = value_out.toFixed(2);
                        }
                        return <td key={keys}>{value_out}</td>;
                      })}
                      <td>
                        <Button disabled>Finished</Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <div>{this.openNewRepairModal()}</div>
          </Card>
        </div>
      );
    } else if (
      // has unfinished repair
      repairHistory[0].complete_date == null
    ) {
      return (
        <div>
          <Card>
            <h3>Repair History</h3>
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">Customer</th>
                  <th scope="col">Service Writer</th>
                  <th scope="col">Start Date</th>
                  <th scope="col">Complete Date</th>
                  <th scope="col">Labor Charge</th>
                  <th scope="col">Total Part Cost</th>
                  <th scope="col">Total Cost</th>
                  <th scope="col">Action</th>
                </tr>
              </thead>
              <tbody>
                {repairHistory.map((value, key) => {
                  return (
                    <tr key={key}>
                      {Object.keys(value).map((keys) => {
                        var value_out = value[keys];
                        if (keys == "start_date" || keys == "complete_date") {
                          console.log(moment(value_out).utc());
                          if (value_out != null) {
                            value_out = moment(value_out)
                              .utc()
                              .format("YYYY-MM-DD");
                          }
                        } else if (
                          keys == "total_part_cost" ||
                          keys == "total_cost"
                        ) {
                          value_out = value_out.toFixed(2);
                        }
                        return <td key={keys}>{value_out}</td>;
                      })}
                      {repairHistory[key].complete_date == null && (
                        <td>{this.openExistingRepairModal()}</td>
                      )}
                      {repairHistory[key].complete_date && (
                        <td>
                          <Button disabled>Finished</Button>
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </Card>
        </div>
      );
    }
  };

  render() {
    let renderSearchResult;
    let isVehicleFound = this.state.isVehicleFound;
    let isVehicleSold = this.state.isVehicleSold;
    let renderRepairHistory;
    let showRepairHistory = this.state.showRepairHistory;

    if (isVehicleFound) {
      // get data from the database and display vehicle info
      renderSearchResult = this.displaySearchResult();
    }
    // else {
    //   renderSearchResult = <p style={{ color: "red" }}>Vehicle Not Found.</p>;
    // }
    if (showRepairHistory) {
      renderRepairHistory = this.displayRepairHistory();
    }
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <input
            type="text"
            className="inputVIN"
            value={this.state.vin}
            onChange={this.handleChange}
            placeholder="please enter VIN"
          />
          <input type="submit" value="Search" />
        </form>
        <div>{renderSearchResult}</div>
        <div>{renderRepairHistory}</div>
      </div>
    );
  }

  onChangeHandler = (e) => {
    this.search(e.target.value);
    this.setState({
      value: e.target.value,
    });
  };

  onClickCustomerSearch = () => {
    this.setState({
      showCustomerSearch: true,
    });
  };

  openNewRepairModal = () => {
    let showCustomerSearch = this.state.showCustomerSearch;
    let renderCustomerSearch;

    // default input
    let showModal = () => {
      this.setState({ visible: true });
    };

    let handleOk = () => {
      setTimeout(() => {
        this.setState({ visible: false });
      }, 2000);
    };

    let handleCancel = () => {
      this.setState({ visible: false });
    };

    if (showCustomerSearch) {
      renderCustomerSearch = <CustomerSearch />;
    }

    return (
      <>
        <Space direction="vertical">
          <Button type="primary" onClick={showModal}>
            Create New Repair
          </Button>
          <Modal
            title="Create New Repair"
            visible={this.state.visible}
            onOk={handleOk}
            onCancel={handleCancel}
            width={1500}
            bodyStyle={{ height: 800 }}
          >
            <div>
              <div>
                <Button
                  onClick={this.onClickCustomerSearch}
                  type="primary"
                  shape="round"
                  className="CustomerSearchBtn"
                >
                  Customer Lookup
                </Button>
                <div>{renderCustomerSearch}</div>
              </div>
            </div>

            <Form
              labelCol={{ span: 4 }}
              wrapperCol={{ span: 8 }}
              layout="horizontal"
            >
              <Form.Item
                label="Driver's license / TIN"
                required
                rules={[
                  {
                    required: true,
                    message: "Please enter a valid driver's license or TIN!",
                  },
                ]}
              >
                <Input type="text" required onChange={this.setInputCustID} />
              </Form.Item>
              <Form.Item required label="VIN">
                <Input defaultValue={this.state.vin} disabled />
              </Form.Item>
              <Form.Item label="Start Date">
                <DatePicker
                  defaultValue={moment(this.state.startDate, "YYYY-MM-DD")}
                  disabled
                />
              </Form.Item>
              <Form.Item required label="Service Writer">
                <Input defaultValue={this.state.userName} disabled />
              </Form.Item>
              <Form.Item
                label="Odometer Reading"
                required
                rules={[
                  { required: true, message: "Please enter Odometer Reading!" },
                ]}
              >
                <InputNumber
                  min={0}
                  placeholder={0}
                  defaultValue={0}
                  value={this.state.odometerReading}
                  onChange={this.setOdometerReading}
                />
              </Form.Item>
              <Form.Item
                label="Labor Charge"
                required
                rules={[
                  { required: true, message: "Please enter Labor Charge!" },
                ]}
              >
                <InputNumber
                  min={0}
                  placeholder={0}
                  defaultValue={0}
                  value={this.state.laborCharge}
                  onChange={this.setLaborCharge}
                />
              </Form.Item>
              <Form.Item label="Description">
                <Input onChange={this.setDescription} />
              </Form.Item>
              <Form.Item label="Submit">
                <Button
                  type="primary"
                  htmlType="submit"
                  onClick={this.handleNewRepair}
                >
                  Submit
                </Button>
              </Form.Item>
            </Form>
          </Modal>
        </Space>
      </>
    );
  };

  setInputCustID = (e) => {
    this.setState({
      customerID: e.target.value,
    });
    console.log("customerID is ", this.state.customerID);
  };

  setDescription = (e) => {
    this.setState({
      description: e.target.value,
    });
  };

  setOdometerReading = (e) => {
    this.setState({
      odometerReading: e,
    });
  };

  setLaborCharge = (e) => {
    this.setState({
      laborCharge: e,
    });
  };

  handleNewRepair = () => {
    let s_odometerReading = this.state.odometerReading.toString();
    let s_laborCharge = this.state.laborCharge.toString();

    if (
      this.state.customerID != "" &&
      this.state.vin != "" &&
      this.state.startDate != "" &&
      this.state.userName != "" &&
      s_odometerReading != "" &&
      s_laborCharge != ""
    ) {
      let new_repair_input = {
        vin: this.state.vin,
        startDate: this.state.startDate,
        serviceWriterUsername: this.state.userName,
        searchID: this.state.customerID,
        odometerReading: s_odometerReading,
        laborCharge: s_laborCharge,
        description: this.state.description,
      };
      console.log("new_repair_input ", new_repair_input);
      axios
        .post(`${this.requestUrl}/api/repair/create`, new_repair_input)
        .then((response) => {
          // console.log(response);
          if (response.data.code == 200) {
            alert(response.data.msg);
          } else {
            alert(
              "Submission failed. Please check your input! Note: A vehicle cannot have more than one repair starting on the same date. "
            );
          }
        });
    } else {
      alert("Submission failed. Please check your input!");
    }
  };

  openExistingRepairModal = () => {
    let latestRepair = this.state.repairHistory[0];
    // start date
    let s_startDate = latestRepair.start_date;
    let start_date = moment(
      moment(parseInt(s_startDate)).utc().format("YYYY-MM-DD HH:mm:ss")
    ).format("YYYY-MM-DD");

    // previous labor charge
    let minLaborCharge = 0;
    console.log("~~~~~~~~~~ userJob: ", this.state.userJob);

    if (this.state.userJob != "Owner") {
      minLaborCharge = latestRepair.labor_charge;
      console.log(
        "min labor charge price for regular service writer: ",
        latestRepair.labor_charge
      );
    }

    let showModal = () => {
      this.setState({ visible_modify: true });
    };

    let handleOk = () => {
      setTimeout(() => {
        this.setState({ visible_modify: false });
      }, 2000);
    };

    let handleCancel = () => {
      this.setState({ visible_modify: false });
    };

    return (
      <>
        <Space direction="vertical">
          <Button type="primary" onClick={showModal}>
            Modify
          </Button>
          <Modal
            title="Modify"
            visible={this.state.visible_modify}
            onOk={handleOk}
            onCancel={handleCancel}
            width={1500}
            bodyStyle={{ height: 800 }}
          >
            <div>
              <div>{this.openAddPartsModal()}</div>
              <br />
              <Button
                type="primary"
                onClick={this.handleComplete}
                className="MarkCompleteBtn"
              >
                Mark As Complete
              </Button>
            </div>
            <br />
            <Form
              labelCol={{ span: 4 }}
              wrapperCol={{ span: 8 }}
              layout="horizontal"
            >
              <Form.Item label="Customer" required>
                <Input defaultValue={latestRepair.customer_name} disabled />
              </Form.Item>
              <Form.Item label="VIN" required>
                <Input defaultValue={this.state.vin} disabled />
              </Form.Item>
              <Form.Item label="Start Date" required>
                <Input defaultValue={start_date} disabled />
              </Form.Item>
              <Form.Item label="Service Writer" required>
                <Input
                  defaultValue={latestRepair.service_writer_name}
                  disabled
                />
              </Form.Item>
              <Form.Item
                label="Labor Charge"
                required
                rules={[
                  { required: true, message: "Please input Labor Charge!" },
                ]}
              >
                <InputNumber
                  min={minLaborCharge}
                  defaultValue={latestRepair.labor_charge}
                  placeholder={latestRepair.labor_charge}
                  value={this.state.laborCharge}
                  onChange={this.setLaborCharge}
                />
              </Form.Item>
              <Form.Item label="Submit">
                <Button
                  type="primary"
                  htmlType="submit"
                  onClick={this.handleModifyLaborCharge}
                >
                  Submit
                </Button>
              </Form.Item>
            </Form>
          </Modal>
        </Space>
      </>
    );
  };

  handleModifyLaborCharge = () => {
    console.log("inside handleModifyLaborCharge");

    // previous labor charge
    let minLaborCharge = 0;
    let latestRepair = this.state.repairHistory[0];
    let prevLaborCharge = latestRepair.labor_charge;

    if (this.state.userJob != "Owner") {
      minLaborCharge = latestRepair.labor_charge;
      console.log(
        "min labor charge price for regular service writer: ",
        latestRepair.labor_charge
      );
    }

    if (
      prevLaborCharge == this.state.laborCharge ||
      this.state.laborCharge == null ||
      this.state.laborCharge == ""
    ) {
      alert(
        "Submission failed. No change in labor charge or invalid labor charge entered!"
      );
    } else if (
      this.state.laborCharge < minLaborCharge &&
      this.state.userJob != "Owner"
    ) {
      alert("Invalid labor charge!");
    } else {
      // start date
      let s_startDate = this.state.repairHistory[0].start_date;
      let s = moment(
        moment(parseInt(s_startDate)).utc().format("YYYY-MM-DD HH:mm:ss")
      ).format("YYYY-MM-DD");

      // modified labor charge
      let s_laborCharge = this.state.laborCharge.toString();

      let new_laborCharge_input = {
        vin: this.state.vin,
        startDate: s,
        laborCharge: s_laborCharge,
      };
      console.log(new_laborCharge_input);
      axios
        .post(
          `${this.requestUrl}/api/repair/update/laborcharge`,
          new_laborCharge_input
        )
        .then((response) => {
          if (response.data.code == 200) {
            alert(response.data.msg);
          } else {
            alert("Submission failed! Please check your input and try again. ");
          }
        });
    }
  };

  handleComplete = () => {
    console.log("inside handleComplete");
    // start date
    let s_startDate = this.state.repairHistory[0].start_date;
    let s = moment(
      moment(parseInt(s_startDate)).format("YYYY-MM-DD HH:mm:ss")
    ).utc().format("YYYY-MM-DD");
    console.log("close s timestamp: " + s + this.state.repairHistory[0]);

    let mark_close_input = {
      vin: this.state.vin,
      startDate: s,
    };
    console.log("mark_close_input:  ", mark_close_input);
    axios
      .post(`${this.requestUrl}/api/repair/close`, mark_close_input)
      .then((response) => {
        if (response.data.code == 200) {
          alert(response.data.msg);
        } else {
          alert("Submission failed! Please try again. ");
        }
      });
  };

  openAddPartsModal = () => {
    // default input
    let latestRepair = this.state.repairHistory[0];
    // start date
    let s_startDate = this.state.repairHistory[0].start_date;
    let start_date = moment(
      moment(parseInt(s_startDate)).format("YYYY-MM-DD HH:mm:ss")
    ).utc().format("YYYY-MM-DD");

    let showModal = () => {
      this.setState({ visible_add_parts: true });
    };

    let handleOk = () => {
      setTimeout(() => {
        this.setState({ visible_add_parts: false });
      }, 2000);
    };

    let handleCancel = () => {
      this.setState({ visible_add_parts: false });
    };

    return (
      <>
        <Space direction="vertical">
          <Button type="primary" onClick={showModal}>
            Add Parts
          </Button>
          <Modal
            title="Add Parts"
            visible={this.state.visible_add_parts}
            onOk={handleOk}
            onCancel={handleCancel}
            width={1500}
            bodyStyle={{ height: 800 }}
          >
            <Form
              labelCol={{ span: 4 }}
              wrapperCol={{ span: 8 }}
              layout="horizontal"
            >
              <Form.Item label="VIN" required>
                <Input defaultValue={this.state.vin} disabled />
              </Form.Item>
              <Form.Item label="Start Date" required>
                <Input defaultValue={start_date} disabled />
              </Form.Item>
              <Form.Item
                label="Vendor"
                required
                rules={[{ required: true, message: "Please input Vendor!" }]}
              >
                <Input onChange={this.setPartVendor} />
              </Form.Item>
              <Form.Item
                label="Part Number"
                required
                rules={[
                  { required: true, message: "Please input Part Number!" },
                ]}
              >
                <Input onChange={this.setPartNumber} />
              </Form.Item>
              <Form.Item
                label="Qty"
                required
                rules={[{ required: true, message: "Please input Qty!" }]}
              >
                <InputNumber
                  min={0}
                  placeholder={0}
                  onChange={this.setPartQty}
                />
              </Form.Item>
              <Form.Item
                label="Price"
                required
                rules={[{ required: true, message: "Please input Price!" }]}
              >
                <InputNumber
                  min={0}
                  placeholder={0}
                  onChange={this.setPartPrice}
                />
              </Form.Item>

              <Form.Item label="Submit">
                <Button
                  type="primary"
                  htmlType="submit"
                  onClick={this.onSubmitAddPart}
                >
                  Submit
                </Button>
              </Form.Item>
            </Form>
          </Modal>
        </Space>
      </>
    );
  };
  setPartVendor = (e) => {
    this.setState({
      partVendor: e.target.value,
    });
  };
  setPartNumber = (e) => {
    this.setState({
      partNumber: e.target.value,
    });
  };
  setPartQty = (e) => {
    console.log("inside setPartQty: ", e);
    this.setState({
      partQty: e,
    });
  };
  setPartPrice = (e) => {
    console.log("inside setPartPrice: ", e);
    this.setState({
      partPrice: e,
    });
  };

  onSubmitAddPart = () => {
    console.log("inside onSubmitAddPart: ");
    // start date
    let s_startDate = this.state.repairHistory[0].start_date;
    let s = moment(
      moment(parseInt(s_startDate)).format("YYYY-MM-DD HH:mm:ss")
    ).utc().format("YYYY-MM-DD");

    if (
      this.state.partNumber == "" ||
      this.state.partPrice == "" ||
      this.state.partQty == "" ||
      s_startDate == "" ||
      this.state.partVendor == "" ||
      this.state.vin == ""
|| 
      this.state.partNumber == null ||
      this.state.partPrice == null ||
      this.state.partQty == null ||
      s_startDate == null ||
      this.state.partVendor == null ||
      this.state.vin == null 
 || 
    this.state.partPrice == 0 ||
      this.state.partQty == 0

    ) {
      alert("Submission failed. Please check your input!");
    } else {
      let add_part_input = {
        vin: this.state.vin,
        startDate: s,
        partNumber: this.state.partNumber,
        quantity: this.state.partQty.toString(),
        vendorName: this.state.partVendor,
        partPrice: this.state.partPrice.toString(),
      };
      console.log("add_part_input:  ", add_part_input);
      axios
        .post(`${this.requestUrl}/api/part/insert`, add_part_input)
        .then((response) => {
          console.log("response", response);
          if (response.data.code == 200) {
            alert(response.data.msg); // successfully added part
          } else {
            alert(
              "Failed to add part! Please check your input and try again. "
            );
          }
        });
    }
  };
}
