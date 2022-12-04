import React from "react";
import { Table, Tag, Space } from "antd";

const Customer = (props) => {
  const dataSource = [props.list]; // must be an array
  let columns = "";
  let display = "";

  // display business customer:
  if (props.list.length != 0 && props.list.tin) {
    columns = [
      {
        title: "Business Name",
        dataIndex: "business_name",
        key: "business_name",
      },
      {
        title: "City",
        dataIndex: "city",
        key: "city",
      },
      {
        title: "Contact Name",
        dataIndex: "contact_name",
        key: "contact_name",
      },
      {
        title: "Customer ID",
        dataIndex: "customerID",
        key: "customerID",
      },
      {
        title: "Phone Number",
        dataIndex: "phone_number",
        key: "phone_number",
      },
      {
        title: "Email Address",
        dataIndex: "email_address",
        key: "email_address",
      },
      {
        title: "Postal Code",
        dataIndex: "postal_code",
        key: "postal_code",
      },
      {
        title: "State",
        dataIndex: "state",
        key: "state",
      },
      {
        title: "Street Address",
        dataIndex: "street_address",
        key: "street_address",
      },
      {
        title: "Tin",
        dataIndex: "tin",
        key: "tin",
      },
      {
        title: "Title",
        dataIndex: "title",
        key: "title",
      },
    ];
  } else {
    // display individual customer:
    columns = [
      {
        title: "City",
        dataIndex: "city",
        key: "city",
      },
      {
        title: "Customer ID",
        dataIndex: "customerID",
        key: "customerID",
      },
      {
        title: "Drivers License No",
        dataIndex: "drivers_license_no",
        key: "drivers_license_no",
      },
      {
        title: "Email Address",
        dataIndex: "email_address",
        key: "email_address",
      },
      {
        title: "First Name",
        dataIndex: "first_name",
        key: "first_name",
      },
      {
        title: "Last Name",
        dataIndex: "last_name",
        key: "last_name",
      },
      {
        title: "Phone Number",
        dataIndex: "phone_number",
        key: "phone_number",
      },
      {
        title: "Postal Code",
        dataIndex: "postal_code",
        key: "postal_code",
      },
      {
        title: "State",
        dataIndex: "state",
        key: "state",
      },
      {
        title: "Street Address",
        dataIndex: "street_address",
        key: "street_address",
      },
    ];
  }

  if (dataSource.length != 0) {
    console.log("Successfully got customers");
    display = (
      <>
        <p style={{ color: "blue" }}>Customer exists.</p>
        <Table dataSource={dataSource} columns={columns}></Table>
      </>
    );
  } else {
    display = <p style={{ color: "blue" }}>Customer Not Found.</p>;
  }
  return display;
};

const Customers = React.memo(Customer);
export default Customers;
