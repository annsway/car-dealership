import React, { useState } from "react";
import "antd/dist/antd.css";
import { Input, Button, Form, Radio, InputNumber } from "antd";
import { post, get } from "../components/request";
import MaskedInput from "antd-mask-input";
import validator from "validator";

export default class AddCustomer extends React.Component {
  constructor(props) {
    super(props);
    this.url = "http://localhost:8080/api/addcustomer";
    this.state = {
      // Customer Type
      customerType: "individual",
      isBusiness: false,
      // Individual Form
      city: null,
      streetAddress: null,
      state: null,
      postalCode: null,
      phoneNumber: null,
      emailAddress: null,
      driverLicense: null,
      firstName: null,
      lastName: null,
      canSendIndividual: false,
      // Business Form
      TIN: null,
      businessName: null,
      title: null,
      contactName: null,
    };
  }

  render() {
    // let defaultType = this.state.type;
    console.log("inside AddCusotmer!!");

    let setIndividual = () => {
      this.setState({
        customerType: "individual",
        isBusiness: false,
      });
    };
    let setBusiness = () => {
      this.setState({ customerType: "business", isBusiness: true });
    };
    let displayIndividual = "";
    let displayBusiness = "";

    if (!this.state.isBusiness) {
      displayIndividual = <IndividualCustomer />;
    } else {
      displayBusiness = <BusinessCustomer />;
    }

    return (
      <div className="add_customer">
        <Radio.Group onChange={this.handleType} value={this.customerType}>
          <Radio.Button value="individual" onClick={setIndividual}>
            Individual
          </Radio.Button>
          <Radio.Button value="business" onClick={setBusiness}>
            Business
          </Radio.Button>
        </Radio.Group>
        <br />
        <div>{displayIndividual}</div>
        <div>{displayBusiness}</div>
      </div>
    );
  }

  // handleSubmitIndividual = () => {
  //   console.log("handleSubmitIndividual!!!");
  // };
}

function IndividualCustomer() {
  let city = "";
  let street_address = "";
  let cust_state = "";
  let postal_code = "";
  let phone_number = "";
  let email_address = "";
  let driver_license = "";
  let first_name = "";
  let last_name = "";

  let set_CITY = (e) => {
    city = e.target.value;
  };
  let set_STREET_ADDRESS = (e) => {
    street_address = e.target.value;
  };

  let set_CustSTATE = (e) => {
    cust_state = e.target.value;
  };
  let set_POSTAL_CODE = (e) => {
    // console.log("zip code", e.target.value);
    postal_code = e.target.value;
  };
  let set_PHONE_NUMBER = (e) => {
    phone_number = e.target.value;
    // console.log("phone", e.target.value);
  };
  let set_EMAIL_ADDRESS = (e) => {
    email_address = e.target.value;
    // console.log("email", e.target.value);
  };
  let set_DRIVER_LICENSE = (e) => {
    driver_license = e.target.value;
    // console.log("driver_license", e.target.value);
  };
  let set_FIRST_NAME = (e) => {
    first_name = e.target.value;
    // console.log("first_name", e.target.value);
  };
  let set_LAST_NAME = (e) => {
    last_name = e.target.value;
    // console.log("last_name", e.target.value);
  };
  let onSubmitIndividualForm = (e) => {
    e.preventDefault();

    const indivCustInfo1 = {
      type: "individual",
      city: city,
      streetAddress: street_address,
      state: cust_state,
      postalCode: postal_code,
      phoneNumber: phone_number.toString(),
      emailAddress: email_address,
      driverLicense: driver_license,
      firstName: first_name,
      lastName: last_name,
    };
    console.log("indivCustInfo1", indivCustInfo1);

    if (
      city != null &&
      city != "" &&
      street_address != null &&
      street_address != "" &&
      cust_state != null &&
      cust_state != "" &&
      postal_code != null &&
      postal_code != "" &&
      phone_number != null &&
      phone_number != "" &&
      driver_license != null &&
      driver_license != "" &&
      first_name != null &&
      first_name != "" &&
      last_name != null &&
      last_name != ""
    ) {
      // all input fields are filled
      if (
        driver_license != null &&
        driver_license.charAt(driver_license.length - 1) == "_"
      ) {
        alert("Invalid Driver's License input! Please try again. ");
      } else if (
        phone_number != null &&
        phone_number.charAt(phone_number.length - 1) == "_"
      ) {
        alert("Invalid Phone Number input! Please try again. ");
      } else if (
        postal_code != null &&
        postal_code.charAt(postal_code.length - 1) == "_"
      ) {
        alert("Invalid Postal Code input! Please try again. ");
      } else {
        const indivCustInfo = {
          type: "individual",
          city: city,
          streetAddress: street_address,
          state: cust_state,
          postalCode: postal_code,
          phoneNumber: phone_number.toString(),
          emailAddress: email_address,
          driverLicense: driver_license,
          firstName: first_name,
          lastName: last_name,
        };
        console.log("indivCustInfo", indivCustInfo);
        post("http://localhost:8080/api/addcustomer", indivCustInfo).then(
          (res) => {
            if (res.code == 200) {
              alert("Successfully added a individual customer!");
            } else {
              alert(
                "Submission failed! Please check your input and try again. "
              );
            }
          }
        );
      }
    } else {
      alert("Please check all the required field(s) before submitting!");
    }
  };

  return (
    <div>
      <Form labelCol={{ span: 4 }} wrapperCol={{ span: 8 }} layout="horizontal">
        <Form.Item
          label="Driver's License"
          required
          rules={[{ required: true, message: "Please input DRIVER_LICENSE!" }]}
        >
          <MaskedInput
            mask="A1111111111"
            name="dl"
            placeholder="A1111111111"
            onChange={set_DRIVER_LICENSE}
          />
        </Form.Item>
        <Form.Item
          label="First Name"
          required
          rules={[{ required: true, message: "Please input FIRST_NAME!" }]}
        >
          <Input onChange={set_FIRST_NAME} />
        </Form.Item>
        <Form.Item
          label="Last Name"
          required
          rules={[{ required: true, message: "Please input LAST_NAME!" }]}
        >
          <Input onChange={set_LAST_NAME} />
        </Form.Item>
        <Form.Item
          name="email"
          label="E-mail"
          rules={[
            {
              type: "email",
              message: "The input is not valid E-mail!",
            },
          ]}
        >
          <Input onChange={set_EMAIL_ADDRESS} />
        </Form.Item>
        <Form.Item
          label="Phone Number"
          required
          rules={[{ required: true, message: "Please input PHONE_NUMBER!" }]}
        >
          <MaskedInput
            mask="1111111111"
            name="phoneno"
            placeholder="1111111111"
            onChange={set_PHONE_NUMBER}
          />
        </Form.Item>
        <Form.Item
          label="Street Address"
          required
          rules={[{ required: true, message: "Please input STREET_ADDRESS!" }]}
        >
          <Input onChange={set_STREET_ADDRESS} />
        </Form.Item>
        <Form.Item
          label="City"
          required
          rules={[{ required: true, message: "Please input CITY!" }]}
        >
          <Input onChange={set_CITY} />
        </Form.Item>

        <Form.Item
          label="Postal Code"
          required
          rules={[{ required: true, message: "Please input POSTAL_CODE!" }]}
        >
          <MaskedInput
            mask="11111"
            name="zip"
            placeholder="11111"
            onChange={set_POSTAL_CODE}
          />
        </Form.Item>
        <Form.Item
          label="State"
          required
          rules={[{ required: true, message: "Please input EMAIL_ADDRESS!" }]}
        >
          <Input onChange={set_CustSTATE} />
        </Form.Item>

        <Form.Item label="Submit">
          <Button
            type="primary"
            htmlType="submit"
            onClick={onSubmitIndividualForm}
          >
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

function BusinessCustomer() {
  let city = "";
  let street_address = "";
  let cust_state = "";
  let postal_code = "";
  let phone_number = "";
  let email_address = "";
  let tin_str = "";
  let business_name = "";
  let title = "";
  let contact_name = "";

  let set_CITY = (e) => {
    city = e.target.value;
  };
  let set_STREET_ADDRESS = (e) => {
    street_address = e.target.value;
  };

  let set_CustSTATE = (e) => {
    cust_state = e.target.value;
  };
  let set_POSTAL_CODE = (e) => {
    console.log("zip code", e.target.value);
    postal_code = e.target.value;
  };
  let set_PHONE_NUMBER = (e) => {
    phone_number = e.target.value;
    console.log("phone", e.target.value);
  };
  let set_EMAIL_ADDRESS = (e) => {
    email_address = e.target.value;
    console.log("email", e.target.value);
  };

  let set_TIN_STR = (e) => {
    console.log("TIN", e.target.value);
    tin_str = e.target.value;
  };
  let set_BUSINESS_NAME = (e) => {
    business_name = e.target.value;
  };
  let set_TITLE = (e) => {
    title = e.target.value;
  };
  let set_CONTACT_NAME = (e) => {
    contact_name = e.target.value;
  };

  let onSubmitBusinessForm = (e) => {
    e.preventDefault();
    if (
      city != null &&
      city != "" &&
      street_address != null &&
      street_address != "" &&
      cust_state != null &&
      cust_state != "" &&
      postal_code != null &&
      postal_code != "" &&
      phone_number != null &&
      phone_number != "" &&
      tin_str != null &&
      tin_str != "" &&
      business_name != null &&
      business_name != "" &&
      title != null &&
      title != "" &&
      contact_name != null &&
      contact_name != ""
    ) {
      // all input fields are filled
      if (tin_str != null && tin_str.charAt(tin_str.length - 1) == "_") {
        alert("Invalid TIN input! Please try again. ");
      } else if (
        phone_number != null &&
        phone_number.charAt(phone_number.length - 1) == "_"
      ) {
        alert("Invalid Phone Number input! Please try again. ");
      } else if (
        postal_code != null &&
        postal_code.charAt(postal_code.length - 1) == "_"
      ) {
        alert("Invalid Postal Code input! Please try again. ");
      } else {
        const businessCustInfo = {
          type: "business",
          city: city,
          streetAddress: street_address,
          state: cust_state,
          postalCode: postal_code,
          phoneNumber: phone_number,
          emailAddress: email_address,
          TIN: tin_str,
          businessName: business_name,
          title: title,
          contactName: contact_name,
        };

        console.log(businessCustInfo);
        post("http://localhost:8080/api/addcustomer", businessCustInfo).then(
          (res) => {
            if (res.code == 200) {
              alert("Successfully added a business customer!");
            } else {
              alert(
                "Submission failed! Please check your input and try again. "
              );
            }
          }
        );
      }
    } else {
      alert("Please check all the required field(s) before submitting!");
    }
  };
  // const [form] = Form.useForm();
  // const onReset = () => {
  //   form.resetFields();
  // };
  return (
    <div>
      <Form
        // form={form}
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 8 }}
        layout="horizontal"
      >
        <Form.Item
          label="TIN"
          required
          rules={[{ required: true, message: "Please input TIN_STR!" }]}
        >
          <MaskedInput
            mask="11-1111111"
            name="tin"
            placeholder="11-1111111"
            onChange={set_TIN_STR}
          />
        </Form.Item>
        <Form.Item
          label="Business Name"
          required
          rules={[{ required: true, message: "Please input BUSINESS_NAME!" }]}
        >
          <Input onChange={set_BUSINESS_NAME} />
        </Form.Item>
        <Form.Item
          label="Contact Name"
          required
          rules={[{ required: true, message: "Please input CONTACT_NAME!" }]}
        >
          <Input onChange={set_CONTACT_NAME} />
        </Form.Item>
        <Form.Item
          label="Title"
          required
          rules={[{ required: true, message: "Please input TITLE!" }]}
        >
          <Input onChange={set_TITLE} />
        </Form.Item>
        <Form.Item
          name="email"
          label="E-mail"
          rules={[
            {
              type: "email",
              message: "The input is not valid E-mail!",
            },
          ]}
        >
          <Input onChange={set_EMAIL_ADDRESS} />
        </Form.Item>
        <Form.Item
          label="Phone Number"
          required
          rules={[{ required: true, message: "Please input PHONE_NUMBER!" }]}
        >
          <MaskedInput
            mask="1111111111"
            name="phoneno"
            placeholder="1111111111"
            onChange={set_PHONE_NUMBER}
          />
        </Form.Item>
        <Form.Item
          label="Street Address"
          required
          rules={[{ required: true, message: "Please input STREET_ADDRESS!" }]}
        >
          <Input onChange={set_STREET_ADDRESS} />
        </Form.Item>
        <Form.Item
          label="City"
          required
          rules={[{ required: true, message: "Please input CITY!" }]}
        >
          <Input onChange={set_CITY} />
        </Form.Item>
        <Form.Item
          label="Postal Code"
          required
          rules={[{ required: true, message: "Please input POSTAL_CODE!" }]}
        >
          <MaskedInput
            mask="11111"
            name="zip"
            placeholder="11111"
            onChange={set_POSTAL_CODE}
          />
        </Form.Item>
        <Form.Item
          label="State"
          required
          rules={[{ required: true, message: "Please input EMAIL_ADDRESS!" }]}
        >
          <Input onChange={set_CustSTATE} />
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            onClick={onSubmitBusinessForm}
          >
            Submit
          </Button>
          {/* <Button onClick={onReset}>Reset</Button> */}
        </Form.Item>
      </Form>
    </div>
  );
}
