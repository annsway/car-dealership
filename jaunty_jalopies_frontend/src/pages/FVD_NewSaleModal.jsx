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
import moment from "moment";
import DisplayCustomerSearch from "./DisplayCustomerSearch";
import axios from "axios";
import { render } from "@testing-library/react";
import { post, get } from "../components/request";
import CustomerSearch from "./CustomerSearch";

let NewSaleModal = ({ vehicle_selected, userName, userJob }) => {
  // control modals
  let [isModalVisible, setIsModalVisible] = useState(false);
  let value; // input_customer_search_id
  let customer = null; // this is an object
  let loading = false;
  // New Sale Form
  let curDate = new Date().toLocaleDateString("en-CA");
  let soldPrice = 0;
  let customerID = "";
  let minSalePrice = 0;
  let requestUrl = "http://localhost:8080";
  let currentUrl = "http://localhost:3000";

  if (userJob != "Owner") {
    minSalePrice = vehicle_selected.invoice_price * 0.95; // if sold price <= 0.95, then reject sale
    console.log("userJob passed in is", userJob);
    console.log("min sale price for regular user: ", minSalePrice);
  } else {
    console.log("userJob passed in is", userJob);
    console.log("min sale price for owner: ", minSalePrice);
  }

  let setInputCustID = (e) => {
    customerID = e.target.value;
  };

  let setSoldPrice = (e) => {
    console.log("inside FVD setSoldPrice ", e);
    soldPrice = e;
  };
  let handleNewSale = () => {
    console.log("inside handleNewSale");
    if (customerID == null || customerID == "") {
      alert("Please input customer!")
    } else {
      if (soldPrice <= minSalePrice && userJob != "Owner") {
        alert("Invalid sale price!");
      } else {
        let soldDate = moment(curDate).utc().format("YYYY-MM-DD");
        let s_soldPrice = soldPrice.toString();
        // console.log("s_soldPrice", s_soldPrice);
        let new_sale_input = {
          vin: vehicle_selected.vin,
          salesUsername: userName,
          searchID: customerID,
          soldDate: soldDate,
          soldPrice: s_soldPrice,
        };
        // console.log("new_sale_input ", new_sale_input);
        axios
          .post(`${requestUrl}/api/sellVehicle`, new_sale_input)
          .then((response) => {
            console.log(response)
            if (response.data.code == 200) {
              alert("Successfully added a sale record!");
            } else if (response.data.code == 3300){
              alert("Customer not found!");
            } else {
              alert("Failed to insert the sale record with unknown reason!");
            }
          });
      }
    };
  }


  let showModal = () => {
    setIsModalVisible(true);
  };

  let handleOk = () => {
    setIsModalVisible(false);
  };

  let handleCancel = () => {
    setIsModalVisible(false);
  };

  let showCustomerSearch = false;

  let onClickCustomerSearch = () => {
    showCustomerSearch = true;
  };

  let renderCustomerSearch = "";
  if (showCustomerSearch) {
    renderCustomerSearch = <CustomerSearch />;
  }

  return (
    <>
      <Space direction="vertical">
        <Button type="primary" onClick={showModal}>
          Create New Sale Order
        </Button>
        <Modal
          title="New Sale Order"
          visible={isModalVisible}
          onOk={handleOk}
          onCancel={handleCancel}
          width={1500}
          bodyStyle={{ height: 800 }}
        >
          <div>
            <h5>Customer Lookup</h5>
            <div>
              <CustomerSearch />
            </div>
          </div>

          <Form
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 8 }}
            layout="horizontal"
          >
            <Form.Item
              label="Driver's License / TIN"
              required
              rules={[{ required: true, message: "Please input Customer!" }]}
            >
              <Input onChange={setInputCustID} />
            </Form.Item>
            <Form.Item required label="VIN">
              <Input defaultValue={vehicle_selected.vin} disabled />
            </Form.Item>
            <Form.Item required label="Sold Date">
              <DatePicker
                defaultValue={moment(curDate, "YYYY-MM-DD")}
                disabled
              />
            </Form.Item>
            <Form.Item required label="Saleperson">
              <Input defaultValue={userName} disabled />
            </Form.Item>
            <Form.Item required label="List Price">
              <InputNumber
                defaultValue={vehicle_selected.list_price.toFixed(2)}
                disabled
              />
            </Form.Item>
            <Form.Item label="Sold Price" required rules={[{ required: true }]}>
              <InputNumber
                min={minSalePrice}
                placeholder={minSalePrice}
                onChange={setSoldPrice}
              />
            </Form.Item>
            <Form.Item label="Submit">
              <Button type="primary" htmlType="submit" onClick={handleNewSale}>
                Submit
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </Space>
    </>
  );
};

// let NewSaleModalExport = React.memo(NewSaleModal);
export default React.memo(NewSaleModal);
