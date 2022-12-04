import React, { Component, useEffect } from "react";
import "antd/dist/antd.css";
import Login from "./Login";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import PubSub from "pubsub-js";
import {
  Input,
  Card,
  Button,
  Dropdown,
  Menu,
  Row,
  Modal,
  Space,
  Form,
  DatePicker,
  Select,
  Table,
} from "antd";
import { DownOutlined, CaretDownOutlined } from "@ant-design/icons";
import { post, get, getDateFormat } from "../components/request";
import axios from "axios";
import FullVehicleDetail from "./FullVehicleDetail";

import moment from "moment";
const { Option } = Select;

export default class DiaplayVehicleSearch extends Component {
  constructor(props) {
    super(props);
    this.requestUrl = "http://localhost:8080";
    this.state = {
      isFound: false,
      vin: null,
      vehicle_type: null,
      manufacturer: null,
      model_year: null,
      color: null,
      min_price: null,
      max_price: null,
      keyword: null,
      sold_status: null,
      full_vehicle_info_vin: "",
      search_result: [],
      display_key: [
        "vin",
        "vehicle_type",
        "manufacturer_name",
        "model_year",
        "model_name",
        "colors",
        "list_price",
        "match_desc"
      ],
      total_vehicle_num: null,
      total_vehicle_known: false,
      vehicle_type_data: [],
      manufacturer_data: [],
      model_year_data: [],
      color_data: [],
      // full vehicle detail
      vehicle_selected: [],
      visible: false,
      value: "", // input_customer_search_id
      customer: null, // this is an object
      loading: false,
      number_of_doors: null,
      roof_type: null,
      back_seat_count: null,
      drivetrain_type: null,
      num_of_cupholders: null,
      cargo_capacity: null,
      cargo_cover_type: null,
      num_of_rear_axies: null,
      has_drivers_side_back_door: null,
      // new sale form
      customerID: "",
      curDate: new Date().toLocaleDateString("en-CA"),
      userName: "",
      userJob: "",
    };

    this.set_vehicle_type = new Set();
    this.set_manufacturer = new Set();
    this.set_model_year = new Set();
    this.set_color = new Set();
    this.min_price = null;
    this.max_price = null;

    this.handleVINChange = this.handleVINChange.bind(this);
    this.handleVehicleTypeChange = this.handleVehicleTypeChange.bind(this);
    this.handleManufacturerChange = this.handleManufacturerChange.bind(this);
    this.handleModelYearChange = this.handleModelYearChange.bind(this);
    this.handleColorChange = this.handleColorChange.bind(this);
    this.handleMinPriceChange = this.handleMinPriceChange.bind(this);
    this.handleMaxPriceChange = this.handleMaxPriceChange.bind(this);
    this.handleSoldStatusChange = this.handleSoldStatusChange.bind(this);
    this.handleKeywordChange = this.handleKeywordChange.bind(this);

    this.handleSubmit = this.handleSubmit.bind(this);

    var search_input = {};

    post(`${this.requestUrl}/api/vehicle/search`, search_input).then((resp) => {
      if (resp.vehicles.length != 0) {
        this.setState({
          total_vehicle_known: true,
          // total_vehicle_num: resp.vehicles.length,
        });

        for (var key in resp.vehicles) {
          this.set_vehicle_type.add(resp.vehicles[key]["vehicle_type"]);
          this.set_manufacturer.add(resp.vehicles[key]["manufacturer_name"]);
          this.set_model_year.add(resp.vehicles[key]["model_year"]);

          if (resp.vehicles[key]['colors'] != null) {
            var color_split = resp.vehicles[key]['colors'].split(',')

            for (var c_ind in color_split)
              this.set_color.add(color_split[c_ind])
          }
          
          var list_price = parseFloat(resp.vehicles[key]["list_price"]);
          this.min_price =
            this.min_price == null
              ? list_price
              : Math.min(this.min_price, list_price);
          this.max_price =
            this.max_price == null
              ? list_price
              : Math.max(this.max_price, list_price);
        }

        // console.log(this.set_vehicle_type)
        // console.log(this.set_manufacturer)
        // console.log(this.set_model_year)
        // console.log(this.set_color)
        console.log(this.min_price, this.max_price)
      } else {
        alert("Sorry, it looks like we don’t have that in stock!");
      }
    });

    get(`${this.requestUrl}/api/countAvailable`).then((res) => {
      this.setState({
        total_vehicle_num: res.count,
      });
    });
  }

  // get userName data from <Login />
  componentDidMount = () => {
    this.userNameToken = PubSub.subscribe("userName", (_, data) => {
      console.log(data);
      this.setState({
        userName: data.userName,
        userJob: data.job,
      });
    });
  };

  componentWillUnmount = () => {
    PubSub.unsubscribe(this.userNameToken);
    PubSub.unsubscribe(this.userJobToken);
  };

  handleVINChange = (e) => {
    var vin_in;
    if (e.target.value.length == 0) vin_in = null;
    else vin_in = e.target.value;

    this.setState({
      vin: vin_in,
    });
  };

  handleVehicleTypeChange = (e) => {
    var vehicle_type_in;
    if (e.key.length == 0) vehicle_type_in = null;
    else vehicle_type_in = e.key;

    this.setState({
      vehicle_type: vehicle_type_in,
    });
  };

  handleManufacturerChange = (e) => {
    var manufacturer_in;
    if (e.key.length == 0) manufacturer_in = null;
    else manufacturer_in = e.key;

    this.setState({
      manufacturer: manufacturer_in,
    });
  };

  handleModelYearChange = (e) => {
    var model_year_in;
    if (e.key.length == 0) model_year_in = null;
    else model_year_in = e.key;

    this.setState({
      model_year: model_year_in,
    });
  };

  handleColorChange = (e) => {
    var colors_in;
    if (e.key.length == 0) colors_in = null;
    else colors_in = e.key;

    this.setState({
      color: colors_in,
    });
  };

  // handleColorChange = (value) => {
  //   let colors = [];
  //   var all_color_set = Array.from(this.set_color)

  //   for (var i in value) {
  //     var color = all_color_set[i];
  //     colors.push(color);
  //   }
  //   this.setState({
  //     color: colors[0],
  //   });
  // };

  handleMinPriceChange = (e) => {
    var min_prices_in;
    if (e.key.length == 0) min_prices_in = null;
    else min_prices_in = e.key;

    this.setState({
      min_price: min_prices_in,
    });
  };

  handleMaxPriceChange = (e) => {
    var max_prices_in;
    if (e.key.length == 0) max_prices_in = null;
    else max_prices_in = e.key;

    this.setState({
      max_price: max_prices_in,
    });
  };

  handleSoldStatusChange = (e) => {
    var sold_status_in;
    if (e.key.length == 0) sold_status_in = null;
    else sold_status_in = e.key;

    this.setState({
      sold_status: sold_status_in,
    });
  };

  handleKeywordChange = (e) => {
    var keywords;
    if (e.target.value.length == 0) keywords = null;
    else keywords = e.target.value;

    this.setState({
      keyword: keywords,
    });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    let search_input = {
      vin: this.state.vin,
      type: this.state.vehicle_type,
      manufacturerName: this.state.manufacturer,
      modelYear: this.state.model_year,
      color: this.state.color,
      minPrice: this.state.min_price,
      maxPrice: this.state.max_price,
      soldStatus: this.state.sold_status,
      keyword: this.state.keyword,
    };

    if (this.state.sold_status == "Sold") search_input["soldStatus"] = 1;
    else if (this.state.sold_status == "Unsold") search_input["soldStatus"] = 0;
    else search_input["soldStatus"] = null;

    this.querySearchInfo(search_input);
  };

  querySearchInfo = (search_input) => {
    post(`${this.requestUrl}/api/vehicle/search`, search_input).then((resp) => {
      if (resp.vehicles.length != 0) {
        this.setState({
          search_result: resp.vehicles,
          isFound: true,
        });
      } else {
        alert("Sorry, it looks like we don’t have that in stock!");
      }
    });
    // console.log(
    //   "~~~~~~~~~~~~~~~~~~~~~~search_result",
    //   this.state.search_result
    // );
  };

  findSelectedVehicle = (vehicles, vin) => {
    return vehicles.find((element) => {
      return element.vin === vin;
    });
  };

  selectVehicle(vin) {
    const search_result = this.state.search_result;
    const vehicle_selected = this.findSelectedVehicle(search_result, vin);
    console.log("res", vehicle_selected);
    this.setState({
      full_vehicle_info_vin: vin,
      vehicle_selected: vehicle_selected,
    });
    console.log("vehicle_selected", this.state.vehicle_selected);
    // open a new tab for DVS
  }

  openFullDetailModal = () => {
    const vehicle_selected = this.state.vehicle_selected;

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
    // console.log(
    //   "------------------------inside openFullDetailModal, username is ",
    //   this.state.userName
    // );
    // console.log("userJob is ", this.state.userJob);
    let displayDetail = "";
    if (this.state.vehicle_selected) {
      displayDetail = (
        <FullVehicleDetail
          vehicle_selected={this.state.vehicle_selected}
          userName={this.state.userName}
          userJob={this.state.userJob}
        ></FullVehicleDetail>
      );
    }

    return (
      <>
        <Space direction="vertical">
          <Button type="primary" onClick={showModal}>
            Full Vehicle Detail
          </Button>
          <Modal
            title="Full Vehicle Detail"
            visible={this.state.visible}
            onOk={handleOk}
            onCancel={handleCancel}
            width={1500}
            bodyStyle={{ height: 1800 }}
          >
            {displayDetail}
          </Modal>
        </Space>
      </>
    );
  };

  displaySearchResult = (search_result, job) => {
      const dataSource = [] // must be an array
  
      for (var ind in search_result) {
        console.log(search_result[ind])
        var cur_record = {}
        const localVIN = search_result[ind]["vin"]
        cur_record["VIN"] = search_result[ind]["vin"]
        cur_record["vehicleType"]= search_result[ind]["vehicle_type"]
        cur_record["manufacturerName"]= search_result[ind]["manufacturer_name"]
        cur_record["modelYear"]= search_result[ind]["model_year"]
        cur_record["modelName"]= search_result[ind]["model_name"]
        cur_record["colors"]= search_result[ind]["colors"]
        cur_record["listPrice"]= search_result[ind]["list_price"]
        cur_record["match"]= search_result[ind]["match_desc"] == 1 ? "Yes" : "No"

        cur_record['actions'] = (
          <Button
            type="primary"
            className="select_vehicle_btn"
            onClick={()=>this.selectVehicle(localVIN)}
          >
            Select
          </Button>
        )

        cur_record["fullVehicleDetails"] = this.openFullDetailModal()

        dataSource.push(cur_record)
  
      }

      console.log(dataSource)
  
      let columns = ''
      let display = ''
  
      columns = [
        {
          title: 'VIN',
          dataIndex: 'VIN',
          key: 'VIN',
        },
        {
          title: 'Vehicle Type',
          dataIndex: 'vehicleType',
          key: 'vehicleType',
        },
        {
          title: 'Manufacturer',
          dataIndex: 'manufacturerName',
          key: 'manufacturerName',
        },
        {
          title: 'Model Year',
          dataIndex: 'modelYear',
          key: 'modelYear',
        },
        {
          title: 'Model Name',
          dataIndex: 'modelName',
          key: 'modelName',
        },
        {
          title: 'Colors',
          dataIndex: 'colors',
          key: 'colors',
        },
        {
          title: 'List Price',
          dataIndex: 'listPrice',
          key: 'listPrice',
        },
        {
          title: 'Keyword match desc',
          dataIndex: 'match',
          key: 'match'
        },
        {
          title: 'Actions',
          dataIndex: 'actions',
          key: 'actions',
        },
        {
          title: 'Full Vehicle Details',
          dataIndex: 'fullVehicleDetails',
          key: 'fullVehicleDetails',
        },
      ]
  
      display = (
        <>
          <Table
            pagination={{ pageSize: 5 }}
            dataSource={dataSource}
            columns={columns}
          ></Table>
        </>
      )
  
      return <div>{display}</div>
    };

  render() {
    let isFound = this.state.isFound;
    let display;
    var search_result = [];

    if (isFound) {
      // get data from the database and display vehicle info
      // search_result = this.state.search_result

      for (var res_ind in this.state.search_result) {
        var cur_record = {};

        // skip sold vehicle
        if (
          (this.state.sold_status == null ||
            this.state.sold_status == "Unsold") &&
          this.state.search_result[res_ind]["sold_date"] != null
        )
          continue;

        if (
          this.state.sold_status == "Sold" &&
          this.state.search_result[res_ind]["sold_date"] == null
        )
          continue;

        for (var ind in this.state.display_key) {
          var key_name = this.state.display_key[ind];
          cur_record[key_name] = this.state.search_result[res_ind][key_name];

          if (key_name == "sold_date")
            cur_record[key_name] = getDateFormat(cur_record[key_name]);
          
          if (key_name == 'list_price')
            cur_record[key_name] = cur_record[key_name].toFixed(2)
        }
        search_result.push(cur_record);
      }


      display = this.displaySearchResult(search_result, this.props.job);
    }

    let vin_label;
    if (this.props.job != "") {
      vin_label = (
        <label>
          VIN:
          <input
            type="text"
            className="inputVIN"
            value={this.state.vin}
            onChange={this.handleVINChange}
          />
        </label>
      );
    } else {
      this.state.sold_status = null;
      // this.state.search_result = null
    }

    let sold_status_label;
    if (this.props.job == "Manager" || this.props.job == "Owner") {
      sold_status_label = (
        <label>
          Sold Status:
          <Dropdown overlay={sold_status_dropdown(this.handleSoldStatusChange)}>
            <Button>
              {this.state.sold_status}
              <CaretDownOutlined />
            </Button>
          </Dropdown>
        </label>
      );
    }

    let counting_label;
    if (this.state.total_vehicle_known) {
      counting_label = (
        <p style={{ color: "red" }}>
          The total number of available vehicles is{" "}
          {this.state.total_vehicle_num}{" "}
        </p>
      );
    }

    var all_color_set = Array.from(this.set_color)
    const all_color = [];
    for (var i in all_color_set) {
      all_color.push(<Option key={i}>{all_color_set[i]}</Option>);
    }

    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          {counting_label}
          {vin_label}
          <label>
            Vehicle Type:
            <Dropdown
              overlay={vehicle_type_dropdown(
                this.handleVehicleTypeChange,
                this.set_vehicle_type
              )}
            >
              <Button>
                {this.state.vehicle_type}
                <CaretDownOutlined />
              </Button>
            </Dropdown>
          </label>
          <label>
            Manufacturer:
            <Dropdown
              overlay={manufacturer_dropdown(
                this.handleManufacturerChange,
                this.set_manufacturer
              )}
            >
              <Button>
                {this.state.manufacturer}
                <CaretDownOutlined />
              </Button>
            </Dropdown>
          </label>
          <label>
            Model Year:
            <Dropdown
              overlay={model_year_dropdown(
                this.handleModelYearChange,
                this.set_model_year
              )}
            >
              <Button>
                {this.state.model_year}
                <CaretDownOutlined />
              </Button>
            </Dropdown>
          </label>
          <label>
            Color:
            <Dropdown
              overlay={colors_dropdown(this.handleColorChange, this.set_color)}
            >
              <Button>
                {this.state.color}
                <CaretDownOutlined />
              </Button>
            </Dropdown>
          </label>
          {/* <Form.Item
            label="Color(s)"
            name="colors"
            rules={[{ required: false, message: 'Please select color(s)!' }]}
          >
            <Select
              mode="multiple"
              allowClear
              style={{ width: '20%' }}
              placeholder="Please select"
              onChange={this.handleColorChange}
            >
              {all_color}
            </Select>
          </Form.Item> */}
          <label>
            Min Price:
            <Dropdown
              overlay={min_price_range_dropdown(
                this.handleMinPriceChange,
                this.max_price
              )}
            >
              <Button>
                {this.state.min_price}
                <CaretDownOutlined />
              </Button>
            </Dropdown>
          </label>
          <label>
            Max Price:
            <Dropdown
              overlay={max_price_range_dropdown(
                this.handleMaxPriceChange,
                this.max_price
              )}
            >
              <Button>
                {this.state.max_price}
                <CaretDownOutlined />
              </Button>
            </Dropdown>
          </label>
          {sold_status_label}
          <label>
            Keyword:
            <input
              type="text"
              className="inputKeyword"
              value={this.state.keyword}
              onChange={this.handleKeywordChange}
            />
          </label>
          <input type="submit" value="Search" />
        </form>
        <div>{display}</div>
      </div>
    )
  }
}

function RepairButton(props) {
  return (
    <Button type="primary" className="repair_btn">
      Repair
    </Button>
  );
}

function UpdateManufacturerButton(props) {
  return (
    <Button type="primary" className="update_manufacturer_btn">
      Update Manufacturer
    </Button>
  );
}

function SellVehicleButton(props) {
  return (
    <Button type="primary" className="sell_vehicle_btn">
      Sell Vehicle
    </Button>
  );
}

function vehicle_type_dropdown(onClickFunc, data_in) {
  var menu_list;
  var data_in_array = Array.from(data_in);

  if (data_in_array.length > 0)
    menu_list = data_in_array.map((item) => {
      return (
        <Menu.Item key={item} icon={<DownOutlined />}>
          {item}
        </Menu.Item>
      );
    });

  return (
    <Menu onClick={onClickFunc}>
      {menu_list}
      <Menu.Item key="" icon={<DownOutlined />}>
        --reset--
      </Menu.Item>
    </Menu>
  );
}

function manufacturer_dropdown(onClickFunc, data_in) {
  var menu_list;
  var data_in_array = Array.from(data_in);

  if (data_in_array.length > 0)
    menu_list = data_in_array.map((item) => {
      return (
        <Menu.Item key={item} icon={<DownOutlined />}>
          {item}
        </Menu.Item>
      );
    });

  return (
    <Menu onClick={onClickFunc}>
      {menu_list}
      <Menu.Item key="" icon={<DownOutlined />}>
        --reset--
      </Menu.Item>
    </Menu>
  );
}

function model_year_dropdown(onClickFunc, data_in) {
  var menu_list;
  var data_in_array = Array.from(data_in);

  data_in_array.sort(function (a, b) {
    return b-a
  })

  if (data_in_array.length > 0)
    menu_list = data_in_array.map((item) => {
      return (
        <Menu.Item key={item} icon={<DownOutlined />}>
          {item}
        </Menu.Item>
      );
    });

  return (
    <Menu onClick={onClickFunc}>
      {menu_list}
      <Menu.Item key="" icon={<DownOutlined />}>
        --reset--
      </Menu.Item>
    </Menu>
  );
}

function colors_dropdown(onClickFunc, data_in) {
  var menu_list;
  var data_in_array = Array.from(data_in);

  if (data_in_array.length > 0)
    menu_list = data_in_array.map((item) => {
      return (
        <Menu.Item key={item} icon={<DownOutlined />}>
          {item}
        </Menu.Item>
      );
    });
  return (
    <Menu onClick={onClickFunc}>
      {menu_list}
      <Menu.Item key="" icon={<DownOutlined />}>
        --reset--
      </Menu.Item>
    </Menu>
  );
}

function min_price_range_dropdown(onClickFunc, max_price) {
  var menu_list
  var data_in_array = [0]

  var cur_price = 0
  while (cur_price < max_price) {
    cur_price = cur_price + 5000
    data_in_array.push(cur_price)
  }

  if (data_in_array.length > 0)
    menu_list = data_in_array.map((item) => {
      return (
        <Menu.Item key={item} icon={<DownOutlined />}>
          {item}
        </Menu.Item>
      )
    })
  return (
    <Menu onClick={onClickFunc}>
      {menu_list}
      <Menu.Item key="" icon={<DownOutlined />}>
        --reset--
      </Menu.Item>
    </Menu>
  )
}

function max_price_range_dropdown (onClickFunc, max_price) {
  var menu_list
  var data_in_array = [0]

  var cur_price = 0
  while (cur_price < max_price) {
    cur_price = cur_price + 5000
    data_in_array.push(cur_price)
  }

  if (data_in_array.length > 0)
    menu_list = data_in_array.map((item) => {
      return (
        <Menu.Item key={item} icon={<DownOutlined />}>
          {item}
        </Menu.Item>
      )
    })
  return (
    <Menu onClick={onClickFunc}>
      {menu_list}
      <Menu.Item key="" icon={<DownOutlined />}>
        --reset--
      </Menu.Item>
    </Menu>
  )
}

const sold_status_dropdown = (onClickFunc) => (
  <Menu onClick={onClickFunc}>
    <Menu.Item key="Sold" icon={<DownOutlined />}>
      Sold
    </Menu.Item>
    <Menu.Item key="Unsold" icon={<DownOutlined />}>
      Unsold
    </Menu.Item>
    <Menu.Item key="All" icon={<DownOutlined />}>
      All
    </Menu.Item>
  </Menu>
);
