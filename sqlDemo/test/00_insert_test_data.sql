########################
################ TESTING
########################
-- USE cs6400_fa21_team012;
USE cs6400_fa21_team012_demo;

DELETE FROM Salesperson; 
DELETE FROM ServiceWriter; 
DELETE FROM InventoryClerk; 
DELETE FROM Manager; 
DELETE FROM `Owner`; 
DELETE FROM LoginUser; 

DELETE FROM Individual; 
DELETE FROM Business; 
DELETE FROM Customer; 

DELETE FROM Manufacturer; 
DELETE FROM VehicleColorMerge; 
DELETE FROM Vehicle; 
DELETE FROM Color; 
DELETE FROM Car; 
DELETE FROM Convertible; 
DELETE FROM Truck; 
DELETE FROM VanMinivan; 
DELETE FROM SUV; 

DELETE FROM Sale; 

DELETE FROM Part; 
DELETE FROM `Repair`; 

INSERT INTO LoginUser (username, password, first_name, last_name)
VALUES ('ann123', '123', 'ann', 'zhou'),
('bob123', '123', 'bob', 'qq'),
('lisa123', '123', 'lisa', 'ss'),
('zoe123', '123', 'zoe', 'cc'),
('owner', '123', 'roland', 'around');

INSERT INTO Salesperson (username) VALUES ('ann123'), ('owner');
INSERT INTO ServiceWriter (username) VALUES ('bob123'), ('owner');
INSERT INTO InventoryClerk (username) VALUES ('zoe123'), ('owner');
INSERT INTO Manager (username) VALUES ('lisa123'), ('owner');
INSERT INTO `Owner` (username) VALUES ('owner');

INSERT INTO Customer (customerID, city, street_address, state, postal_code, phone_number, email_address)
VALUES (NULL, 'minneapolis', '2600 university ave', 'mn', '55414', '612-111-1245', 'cust1@gmail.com'),
(NULL, 'new york', 'ny', '700 university ave', '11123', '312-111-1245', 'cust2@gmail.com'),
(NULL, 'st paul', 'mn', '2600 washington ave', '55114', '612-111-4333', 'cust3@gmail.com'),
(NULL, 'seattle', 'wa','700 washington ave', '33444', '543-111-1245', 'cust4@gmail.com');

INSERT INTO Individual (drivers_license_no, first_name, last_name, customerID) 
VALUES ('F12345', 'yun', 'zhou', 1),
('M6666', 'bao', 'qqq', 2);

INSERT INTO Business (tin, business_name, title, contact_name, customerID) 
VALUES ('123-44-5329', 'HP', 'Purchasing Manager', 'Peter', 3), 
('223-44-5329', 'FB', 'Clerk', 'Rose', 4); 

INSERT INTO Manufacturer (manufacturer_name) 
VALUES ('Toyota'), ('BMW'), ('Tesla'), ('Ford'); 

INSERT INTO Vehicle (vin, `description`, invoice_price, model_name, model_year, manufacturer_name, inventoryclerk_username, date_added) 
VALUES ('aaa', 'this is a car', 23000, 'RAV4', '2017-1-1', 'Toyota', 'zoe123', '2020-11-1'), 
('aaa2', 'this is a car2', 24000, 'RAV4', '2017-1-1', 'Toyota', 'zoe123', '2020-10-1'), 
('bbb', 'this is a truck', 83000, 'FordTruck', '2019-1-1', 'Ford', 'zoe123', '2020-9-1'),
('bbb2', 'this is a truck2', 93000, 'FordTruck2', '2020-1-1', 'Ford', 'zoe123', '2021-8-11'),
('ccc', 'this is an SUV', 63000, 'Model X', '2019-1-1', 'Tesla', 'zoe123', '2021-2-13'), 
('ddd', 'this is a Convertible', 43000, 'M3', '2020-1-1', 'BMW', 'zoe123', '2021-8-30'),
('fff', 'this is a Van', 43000, 'XQS', '2010-1-1', 'BMW', 'zoe123', '2021-7-31')
; 

INSERT INTO Color (color) 
VALUES ('White'), ('Black'), ('Blue'), ('Red'); 

INSERT INTO VehicleColorMerge (vin, color) 
VALUES ('aaa' ,'Red'),  ('aaa', 'White'), ('aaa2' ,'Red'),
('bbb', 'Black'), ('bbb2', 'Red'), 
('ccc', 'Blue'), 
('ddd', 'Blue'),
('ddd', 'Black'), 
('fff', 'Blue'), ('fff', 'White'); 

INSERT INTO Car (vin, number_of_doors)
VALUE ('aaa', 4), ('aaa2', 4);

INSERT INTO Convertible (vin, roof_type, back_seat_count)
VALUE ('ddd', 'soft', 3);

INSERT INTO Truck (vin, cargo_capacity, cargo_cover_type, num_of_rear_axies)
VALUE ('bbb', 1, 'Soft roll-up', 4),
('bbb2', 2, 'Hard roll-up', 4);

INSERT INTO VanMinivan (vin, has_drivers_side_back_door)
VALUE ('fff', true);

INSERT INTO SUV (vin, drivetrain_type, num_of_cupholders)
VALUE ('ccc', 'AWD', 6);

INSERT INTO Sale (salesperson_username, customerID, vin, sold_date, sold_price)
VALUE ('ann123', '1', 'aaa', '2021-7-8', 25000),
('ann123', '2', 'bbb', '2021-4-30', 93000),
('ann123', '3', 'fff', '2020-11-2', 44000);

INSERT INTO `Repair` (vin, start_date, servicewriter_username, customerID, complete_date, odometer_reading, labor_charge, `description`) 
VALUES ('bbb', '2021-10-1', 'bob123', 1, NULL, 20000, 0, 'This is a repair record for car aaa'),
('ccc', '2021-9-15', 'bob123', 4, NULL, 80000, 0, 'This is a repair record for car bbb');

INSERT INTO Part (vin, start_date, part_number, quantity, vendor_name, price)
VALUES ('bbb', '2021-10-1', 'abc123', 1, 'Ford', 50)
, ('ccc', '2021-9-15', 'xyz123', 1, 'BMW', 490);
