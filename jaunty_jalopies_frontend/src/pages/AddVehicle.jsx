import React from "react";
import {
  Input,
  Card,
  Button,
  Form,
  DatePicker,
  Select,
  Radio,
  InputNumber,
} from "antd";
import { post, get } from "../components/request";
import axios from "axios";
import moment from "moment";
import "antd/dist/antd.css";

const { TextArea } = Input;
const { Option } = Select;

export default class AddVehicle extends React.Component {
  constructor(props) {
    super(props);
    this.url = "http://localhost:8080/api/addVehicle";
    this.state = {
      vin: null,
      manufacturerName: null,
      modelName: null,
      modelYear: null,
      invoicePrice: null,
      description: null,
      type: "Car",
      numDoors: null,
      roofType: null,
      backSeatCount: null,
      cargoCapacity: null,
      cargoCoverType: null,
      numRearAxies: null,
      hasDriverSideBackDoor: null,
      driveTrainType: null,
      numCupHolders: null,
      colors: [],
      // default values on form
      manufactuerers_all: [],
      colors_all: [],
      invoiceDate: new Date().toLocaleDateString("en-CA"),
      clerkUsername: props.userName,
    };
    this.requestUrl = "http://localhost:8080";
  }
  // get store data
  componentDidMount() {
    this.getAllMF();
    this.getAllColors();
  }

  formRef = React.createRef();

  onReset = () => {
    this.formRef.current.resetFields();
  };

  // get store list
  getAllMF = () => {
    axios.get(`${this.requestUrl}/api/manufacturer/all`).then((resp) => {
      // handle success
      if (resp.data.code == 200) {
        this.setState({
          manufactuerers_all: resp.data.manufacturers,
        });
      } else {
        alert("Cannot fetch manufacturer list!");
      }
    });
  };

  // get color list
  getAllColors = () => {
    axios.get(`${this.requestUrl}/api/color/all`).then((resp) => {
      // handle success
      if (resp.data.code == 200) {
        this.setState({
          colors_all: resp.data.colors,
        });
      } else {
        alert("Cannot fetch color list!");
      }
    });
    console.log("all colors:", this.state.colors_all);
  };

  handleChangeVIN = (e) => {
    this.setState({ vin: e.target.value });
  };
  handleChangeManufacturer = (e) => {
    this.setState({ manufacturerName: e });
    console.log(e);
  };
  handleChangeModelName = (e) => {
    this.setState({ modelName: e.target.value });
  };
  handleChangeModelYear = (e) => {
    this.setState({ modelYear: e });
    console.log(e);
  };
  handleChangeInvoicePrice = (e) => {
    this.setState({ invoicePrice: e });
  };
  handleChangeDesc = (e) => {
    this.setState({ description: e.target.value });
  };
  handleChangeType = (e) => {
    console.log(e);
    this.setState({ type: e });
  };
  handleChangeNumDoors = (e) => {
    this.setState({ numDoors: e });
  };
  handleChangeRoofType = (e) => {
    this.setState({ roofType: e.target.value });
  };
  handleChangeBackSeatCount = (e) => {
    this.setState({ backSeatCount: e });
  };
  handleChangeCargoCapacity = (e) => {
    this.setState({ cargoCapacity: e });
  };
  handleChangeCoverType = (e) => {
    this.setState({ cargoCoverType: e.target.value });
  };
  handleChangeNumRearAxies = (e) => {
    this.setState({ numRearAxies: e });
  };
  handleChangeHasDriverSideBackDoor = (e) => {
    console.log(e);
    this.setState({ hasDriverSideBackDoor: e.target.value });
  };
  handleChangeDriveTrainType = (e) => {
    this.setState({ driveTrainType: e.target.value });
  };
  handleChangeNumCupHolders = (e) => {
    this.setState({ numCupHolders: e });
  };

  handleChangeColors = (value) => {
    let colors = [];
    for (var i in value) {
      var color = this.state.colors_all[i];
      colors.push(color);
    }
    this.setState({
      colors: colors,
    });
  };

  render() {
    let defaultType = this.state.type;
    let manufactuerers_all = this.state.manufactuerers_all;
    let mf_options = [];
    for (var i in manufactuerers_all) {
      var cur = {};
      cur["label"] = manufactuerers_all[i];
      cur["value"] = manufactuerers_all[i];
      mf_options.push(cur);
    }

    const children = [];
    for (var i in this.state.colors_all) {
      children.push(<Option key={i}>{this.state.colors_all[i]}</Option>);
    }
    console.log("this.state.colors_all", this.state.colors_all);

    return (
      <div className="add_vehicle">
        <Card title="Add Vehicle" style={{ width: 800 }}>
          <Form ref={this.formRef}>
            <Form.Item
              label="VIN"
              name="vin"
              rules={[{ required: true, message: "Please input VIN!" }]}
            >
              <Input
                type="text"
                required
                onChange={this.handleChangeVIN}
                maxLength={17}
                placeholder="Please enter VIN (17-character value)"
              />
            </Form.Item>

            <Form.Item
              name="Manufacturer"
              label="Manufacturer"
              rules={[
                { required: true, message: "Please input manufacturer!" },
              ]}
            >
              <Select
                options={mf_options}
                onChange={this.handleChangeManufacturer}
              />
            </Form.Item>
            <Form.Item
              label="ModelName"
              name="modelName"
              rules={[{ required: true, message: "Please input model name!" }]}
            >
              <Input
                type="text"
                required
                // value={ModelName}
                onChange={this.handleChangeModelName}
              />
            </Form.Item>

            <Form.Item
              label="ModelYear"
              name="modelYear"
              rules={[{ required: true, message: "Please input model year!" }]}
            >
              <DatePicker
                picker="year"
                required
                onChange={this.handleChangeModelYear}
                disabledDate={(current) => {
                  return (
                    current >
                    moment(this.state.invoiceDate, "YYYY").add(2, "year")
                  );
                }}
              />
            </Form.Item>
            <Form.Item
              label="Invoice price"
              name="invoicePrice"
              rules={[
                { required: true, message: "Please input invoice price!" },
              ]}
            >
              <InputNumber
                required
                min={0}
                placeholder={0}
                onChange={this.handleChangeInvoicePrice}
              />
            </Form.Item>
            <Form.Item
              label="Date added"
              name="invoiceDate"
              rules={[
                { required: true, message: "Please input invoice date!" },
              ]}
            >
              <DatePicker
                defaultValue={moment(
                  this.state.invoiceDate,
                  "YYYY-MM-DD"
                ).utc()}
                disabled
              />
            </Form.Item>
            <Form.Item
              label="Inventory clerk"
              name="inventoryClerkUsername"
              required
            >
              <Input defaultValue={this.state.clerkUsername} disabled />
            </Form.Item>
            <Form.Item
              label="Color(s)"
              name="colors"
              rules={[{ required: true, message: "Please select color(s)!" }]}
            >
              <Select
                mode="multiple"
                allowClear
                style={{ width: "100%" }}
                placeholder="Please select"
                onChange={this.handleChangeColors}
              >
                {children}
              </Select>
            </Form.Item>
            <Form.Item label="Description" name="description">
              <TextArea onChange={this.handleChangeDesc} />
            </Form.Item>
            <Form.Item
              label="Type"
              name="type"
              rules={[
                { required: true, message: "Please specify vehicle type!" },
              ]}
            >
              <Select
                defaultValue={defaultType}
                onChange={this.handleChangeType}
              >
                <Option value="Car">Car</Option>
                <Option value="Convertible">Convertible</Option>
                <Option value="Truck">Truck</Option>
                <Option value="VanMinivan">VanMinivan</Option>
                <Option value="SUV">SUV</Option>
              </Select>
            </Form.Item>

            {this.state.type == "Car" ? (
              <Form.Item
                label="Number of doors"
                name="numOfDoors"
                rules={[
                  { required: true, message: "Please input number of doors!" },
                ]}
              >
                <InputNumber
                  onChange={this.handleChangeNumDoors}
                  min={1}
                  placeholder={1}
                />
              </Form.Item>
            ) : null}

            {this.state.type == "Convertible" ? (
              <Form.Item
                label="Roof type"
                name="roofType"
                rules={[{ required: true, message: "Please input roof type!" }]}
              >
                <Input onChange={this.handleChangeRoofType} />
              </Form.Item>
            ) : null}

            {this.state.type == "Convertible" ? (
              <Form.Item
                label="Number of back seat count"
                name="numOfBackSeatCount"
                rules={[
                  { required: true, message: "Please input back seat number!" },
                ]}
              >
                <InputNumber
                  onChange={this.handleChangeBackSeatCount}
                  min={0}
                  placeholder={0}
                />
              </Form.Item>
            ) : null}

            {this.state.type == "Truck" ? (
              <Form.Item
                label="Cargo capacity (in tons)"
                name="cargoCapacity"
                rules={[
                  { required: true, message: "Please input cargo capacity!" },
                ]}
              >
                <InputNumber
                  required
                  onChange={this.handleChangeCargoCapacity}
                  min={0}
                  max={50}
                  placeholder={0}
                />
              </Form.Item>
            ) : null}

            {this.state.type == "Truck" ? (
              <Form.Item
                label="Cargo cover type (optional)"
                name="cargoCoverType"
              >
                <Input required onChange={this.handleChangeCoverType} />
              </Form.Item>
            ) : null}

            {this.state.type == "Truck" ? (
              <Form.Item
                label="Number of rear axles"
                name="numOfRearAxles"
                rules={[
                  {
                    required: true,
                    message: "Please input number of rear axles!",
                  },
                ]}
              >
                <InputNumber
                  required
                  onChange={this.handleChangeNumRearAxies}
                  min={0}
                  placeholder={0}
                />
              </Form.Item>
            ) : null}

            {this.state.type == "VanMinivan" ? (
              <Form.Item
                label="Has driver side back door?"
                rules={[
                  {
                    required: true,
                    message: "Please choose one. ",
                  },
                ]}
              >
                <Radio.Group onChange={this.handleChangeHasDriverSideBackDoor}>
                  <Radio value={1}>Yes</Radio>
                  <Radio value={0}>No</Radio>
                </Radio.Group>
              </Form.Item>
            ) : null}

            {this.state.type == "SUV" ? (
              <Form.Item
                label="Number of cup holders"
                name="numOfCupHolders"
                rules={[
                  {
                    required: true,
                    message: "Please input number of cup holders!",
                  },
                ]}
              >
                <InputNumber
                  required
                  min={0}
                  placeholder={0}
                  onChange={this.handleChangeNumCupHolders}
                />
              </Form.Item>
            ) : null}

            {this.state.type == "SUV" ? (
              <Form.Item
                label="Drive train type"
                name="driveTrainType"
                rules={[
                  { required: true, message: "Please input drive train type!" },
                ]}
              >
                <Input required onChange={this.handleChangeDriveTrainType} />
              </Form.Item>
            ) : null}
            <Button type="primary" onClick={this.handleSubmit}>
              Submit
            </Button>
            <Button onClick={this.onReset}>Reset</Button>
          </Form>
        </Card>
      </div>
    );
  }

  handleSubmit = (e) => {
    e.preventDefault();
    if (
      // input fields are not blank
      (this.state.vin != null &&
        this.state.manufacturerName != null &&
        this.state.modelName != null &&
        this.state.modelYear != null &&
        this.state.invoicePrice != null &&
        this.state.invoiceDate != null &&
        this.state.clerkUsername != null &&
        this.state.colors != null &&
        this.state.type != null)
        && (
        this.state.vin != "" &&
        this.state.manufacturerName != "" &&
        this.state.modelName != "" &&
        this.state.modelYear != "" &&
        this.state.invoicePrice != "" &&
        this.state.invoiceDate != "" &&
        this.state.clerkUsername != "" &&
        this.state.colors != "" &&
        this.state.type != "")
    ) {
      if (this.state.vin.length != 17) {
        alert("Invalid VIN! Please try again. ");
      }
      if (
        (this.state.type == "Car" && this.state.numDoors != null) ||
        (this.state.type == "Convertible" &&
          this.state.roofType != null &&
          this.state.roofType != "" &&
          this.state.backSeatCount != null &&
          this.state.backSeatCount != "") ||
        (this.state.type == "Truck" &&
          this.state.cargoCapacity != null &&
          this.state.cargoCapacity != "" &&
          this.state.numRearAxies != null &&
          this.state.numRearAxies != "") ||
        (this.state.type == "VanMinivan" &&
          this.state.hasDriverSideBackDoor != null &&
          this.state.hasDriverSideBackDoor != "") ||
        (this.state.type == "SUV" &&
          this.state.numCupHolders != null &&
          this.state.numCupHolders != "" &&
          this.state.driveTrainType != null &&
          this.state.driveTrainType != "")
      ) {
        const listPrice = this.state.invoicePrice * 1.25; // default list price is 125% of the invoice price
        const vehicle = {
          vin: this.state.vin,
          manufacturerName: this.state.manufacturerName,
          modelName: this.state.modelName,
          modelYear: this.state.modelYear.format("YYYY"),
          invoicePrice: this.state.invoicePrice.toString(),
          invoiceDate: this.state.invoiceDate,
          clerkUsername: this.state.clerkUsername,
          description: this.state.description,
          type: this.state.type,
          numDoors:
            this.state.numDoors == null ? null : this.state.numDoors.toString(),
          roofType: this.state.roofType,
          backSeatCount:
            this.state.backSeatCount == null
              ? null
              : this.state.backSeatCount.toString(),
          cargoCapacity:
            this.state.cargoCapacity == null
              ? null
              : this.state.cargoCapacity.toString(),
          cargoCoverType: this.state.cargoCoverType,
          numRearAxies:
            this.state.numRearAxies == null
              ? null
              : this.state.numRearAxies.toString(),
          hasDriverSideBackDoor:
            this.state.hasDriverSideBackDoor == null
              ? null
              : this.state.hasDriverSideBackDoor.toString(),
          driveTrainType: this.state.driveTrainType,
          numCupHolders:
            this.state.numCupHolders == null
              ? null
              : this.state.numCupHolders.toString(),
          colors: this.state.colors,
          listPrice: listPrice.toString(),
        };
        console.log(vehicle);
        post(this.url, vehicle).then((res) => {
          console.log("aaa", res);
          if (res.code == 200) {
            this.onReset();
            alert("Successfully added a vehicle!");
          } else {
            console.log("Failed!");
            const msg =
              "Failed to add the vehicle, please check your input and try again. ";
            alert(msg);
          }
        });
      } else {
        alert(
          "Please fill the required field(s) for the selected vehicle type before submitting!"
        );
      }
    } else {
      alert("Please fill the required field(s) before submitting!");
    }
  };
}
