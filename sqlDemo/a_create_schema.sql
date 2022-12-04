-- CREATE USER 'newuser'@'localhost' IDENTIFIED BY 'password';
-- CREATE USER IF NOT EXISTS gatechUser@localhost IDENTIFIED BY 'gatech123';

DROP DATABASE IF EXISTS `cs6400_fa21_team012_demo`; 
-- SET default_storage_engine=InnoDB;
-- SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE DATABASE IF NOT EXISTS cs6400_fa21_team012_demo 
DEFAULT CHARACTER SET utf8mb4 
DEFAULT COLLATE utf8mb4_unicode_ci;

USE cs6400_fa21_team012_demo;

-- GRANT SELECT, INSERT, UPDATE, DELETE, FILE ON *.* TO 'gatechUser'@'localhost';
-- GRANT ALL PRIVILEGES ON `gatechuser`.* TO 'gatechUser'@'localhost';
-- GRANT ALL PRIVILEGES ON `cs6400_fa21_team012_demo`.* TO 'gatechUser'@'localhost';
-- FLUSH PRIVILEGES;

-- Tables 
    
CREATE TABLE LoginUser (
	username varchar(50) NOT NULL, 
	password varchar(60) NOT NULL, 
	first_name varchar(60) NOT NULL, 
	last_name varchar(60) NOT NULL, 
	PRIMARY KEY (username)
);

CREATE TABLE Salesperson (
	username varchar(50) NOT NULL, 
	PRIMARY KEY (username)
);

CREATE TABLE ServiceWriter (
	username varchar(50) NOT NULL, 
	PRIMARY KEY (username)
);

CREATE TABLE Manager (
	username varchar(50) NOT NULL, 
	PRIMARY KEY (username)
);

CREATE TABLE InventoryClerk (
	username varchar(50) NOT NULL, 
	PRIMARY KEY (username)
);

CREATE TABLE `Owner` (
	username varchar(50) NOT NULL, 
	PRIMARY KEY (username)
);

CREATE TABLE Customer (
	customerID int(16) unsigned NOT NULL AUTO_INCREMENT, 
	city varchar(50) NOT NULL, 
	street_address varchar(250) NOT NULL, 
	state varchar(50) NOT NULL, 
	postal_code varchar(15) NOT NULL, 
	phone_number varchar(12) NOT NULL,  
	email_address varchar(50) NULL, 
	PRIMARY KEY (customerID)
) AUTO_INCREMENT = 1;

CREATE TABLE Individual (
	drivers_license_no varchar(13) NOT NULL, 
	first_name varchar(60) NOT NULL, 
	last_name varchar(60) NOT NULL, 
	customerID int(16) unsigned NOT NULL, 
	PRIMARY KEY (drivers_license_no)
);

CREATE TABLE Business (
	tin varchar(12) NOT NULL, 
	business_name varchar(60) NOT NULL, 
	title varchar(60) NOT NULL, 
	contact_name varchar(250) NOT NULL, 
	customerID int(16) unsigned NOT NULL, 
	PRIMARY KEY (tin)
);

CREATE TABLE Manufacturer (
	manufacturer_name varchar(100) NOT NULL, 
	PRIMARY KEY (manufacturer_name)
);

CREATE TABLE Vehicle (
	vin varchar(17) NOT NULL, 
	`description` varchar(250) NULL, 
	invoice_price float NOT NULL, 
	model_name varchar(100) NOT NULL, 
	model_year datetime NOT NULL,
	manufacturer_name varchar(100) NOT NULL, 
	inventoryclerk_username varchar(50) NOT NULL, 
	date_added datetime NOT NULL, 
	PRIMARY KEY (vin)
);

CREATE TABLE Color (
	color varchar(50) NOT NULL, 
	PRIMARY KEY (color)
);

CREATE TABLE VehicleColorMerge (
	vin varchar(17) NOT NULL, 
	color varchar(50) NOT NULL, 
	PRIMARY KEY (vin, color)
);

CREATE TABLE Car (
	vin varchar(17) NOT NULL, 
	number_of_doors int(2) NOT NULL, 
	PRIMARY KEY (vin)
);

CREATE TABLE Convertible (
	vin varchar(17) NOT NULL, 
	roof_type varchar(50) NOT NULL,
	back_seat_count int(2) NOT NULL, 
	PRIMARY KEY (vin)
);

CREATE TABLE Truck (
	vin varchar(17) NOT NULL, 
	cargo_capacity int(5) NOT NULL, 
	cargo_cover_type varchar(50) NULL,
	num_of_rear_axies int(2) NOT NULL, 
	PRIMARY KEY (vin)
);

CREATE TABLE VanMinivan (
	vin varchar(17) NOT NULL, 
	has_drivers_side_back_door BOOLEAN NOT NULL,
	PRIMARY KEY (vin)
);

CREATE TABLE SUV (
	vin varchar(17) NOT NULL, 
	drivetrain_type varchar(20) NOT NULL, 
	num_of_cupholders int(2) NOT NULL, 
	PRIMARY KEY (vin)
);

CREATE TABLE Sale (
	salesperson_username varchar(50) NOT NULL, 
	customerID int(16) unsigned NOT NULL, 
	vin varchar(17) NOT NULL, 
	sold_date datetime NOT NULL, 
	sold_price float NOT NULL, 
	PRIMARY KEY (salesperson_username, vin, customerID),
    UNIQUE KEY (vin)
);

CREATE TABLE `Repair` (
	vin varchar(17) NOT NULL, 
	start_date datetime NOT NULL, 
	servicewriter_username varchar(50) NOT NULL, 
	customerID int(16) unsigned NOT NULL, 
	complete_date datetime NULL, 
	odometer_reading int(15) NOT NULL, 
	labor_charge float NOT NULL,
	description varchar(250), 
	PRIMARY KEY (vin, start_date),
	KEY start_date (start_date)
);

CREATE TABLE Part (
	vin varchar(17) NOT NULL, 
	start_date datetime NOT NULL, 
	part_number varchar(100) NOT NULL, 
	quantity int(5) NOT NULL,
	vendor_name varchar(100) NOT NULL,
	price float NOT NULL, 
	PRIMARY KEY (vin, start_date, part_number)
);

-- Constraints Foreign Keys: FK_ChildTable_childColumn_ParentTable_parentColumn
ALTER TABLE Salesperson
	ADD CONSTRAINT fk_Salesperson_username_LoginUser_username FOREIGN KEY (username) REFERENCES LoginUser (username);

ALTER TABLE ServiceWriter
	ADD CONSTRAINT fk_ServiceWriter_username_LoginUser_username FOREIGN KEY (username) REFERENCES LoginUser (username);

ALTER TABLE Manager
	ADD CONSTRAINT fk_Manager_username_LoginUser_username FOREIGN KEY (username) REFERENCES LoginUser (username);

ALTER TABLE InventoryClerk
	ADD CONSTRAINT fk_InventoryClerk_username_LoginUser_username FOREIGN KEY (username) REFERENCES LoginUser (username);

ALTER TABLE `Owner`
	ADD CONSTRAINT fk_Owner_username_LoginUser_username FOREIGN KEY (username) REFERENCES LoginUser (username);

ALTER TABLE Individual
  ADD CONSTRAINT fk_Individual_customerID_Customer_customerID FOREIGN KEY (customerID) REFERENCES Customer (customerID);

ALTER TABLE Business
  ADD CONSTRAINT fk_Business_customerID_Customer_customerID FOREIGN KEY (customerID) REFERENCES Customer (customerID);

ALTER TABLE Vehicle
  ADD CONSTRAINT fk_Vehicle_manufacturername_Manufacturer_manufacturername FOREIGN KEY (manufacturer_name) REFERENCES Manufacturer (manufacturer_name),
  ADD CONSTRAINT fk_Vehicle_inventoryclerkusername_InventoryClerk_username FOREIGN KEY (inventoryclerk_username) REFERENCES InventoryClerk (username);

ALTER TABLE VehicleColorMerge
  ADD CONSTRAINT fk_VehicleColorMerge_vin_Vehicle_vin FOREIGN KEY (vin) REFERENCES Vehicle (vin),
  ADD CONSTRAINT fk_VehicleColorMerge_vin_Color_color FOREIGN KEY (color) REFERENCES Color (color);

ALTER TABLE Car
  ADD CONSTRAINT fk_Car_vin_Vehicle_vin FOREIGN KEY (vin) REFERENCES Vehicle (vin);

ALTER TABLE Convertible
  ADD CONSTRAINT fk_Convertible_vin_Vehicle_vin FOREIGN KEY (vin) REFERENCES Vehicle (vin);

ALTER TABLE Truck
  ADD CONSTRAINT fk_Truck_vin_Vehicle_vin FOREIGN KEY (vin) REFERENCES Vehicle (vin);

ALTER TABLE VanMinivan
  ADD CONSTRAINT fk_VanMinivan_vin_Vehicle_vin FOREIGN KEY (vin) REFERENCES Vehicle (vin);

ALTER TABLE SUV
  ADD CONSTRAINT fk_SUV_vin_Vehicle_vin FOREIGN KEY (vin) REFERENCES Vehicle (vin);

ALTER TABLE Sale
  ADD CONSTRAINT fk_Sale_salespersonusername_Salesperson_username FOREIGN KEY (salesperson_username) REFERENCES Salesperson (username) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT fk_Sale_customerID_Customer_customerID FOREIGN KEY (customerID) REFERENCES Customer (customerID) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT fk_Sale_vin_Vehicle_vin FOREIGN KEY (vin) REFERENCES Vehicle (vin) ON DELETE CASCADE ON UPDATE CASCADE;
  
ALTER TABLE `Repair`
  ADD CONSTRAINT fk_Repair_vin_Vehicle_vin FOREIGN KEY (vin) REFERENCES Vehicle (vin) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT fk_Repair_servicewriterusername_ServiceWriter_username FOREIGN KEY (servicewriter_username) REFERENCES ServiceWriter (username),
  ADD CONSTRAINT fk_Repair_customerID_Customer_customerID FOREIGN KEY (customerID) REFERENCES Customer (customerID) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE Part
  ADD CONSTRAINT fk_Part_vin_Repair_vin FOREIGN KEY (vin) REFERENCES `Repair` (vin) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT fk_Part_startdate_Repair_startdate FOREIGN KEY (start_date) REFERENCES `Repair` (start_date) ON DELETE CASCADE ON UPDATE CASCADE;
