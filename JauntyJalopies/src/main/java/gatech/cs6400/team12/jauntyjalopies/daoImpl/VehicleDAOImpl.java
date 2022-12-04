package gatech.cs6400.team12.jauntyjalopies.daoImpl;

import gatech.cs6400.team12.jauntyjalopies.POJO.Vehicle;
import gatech.cs6400.team12.jauntyjalopies.dao.VehicleDAO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

@Repository
public class VehicleDAOImpl implements VehicleDAO {

    @Autowired
    JdbcTemplate jdbcTemplate;

    @Override
    public Vehicle findVehicleByVIN(String vin) {
        String sql = "SELECT * FROM Vehicle WHERE vin = ?";
        Vehicle vehicle = jdbcTemplate.query(sql, rs -> {
            Vehicle vehicle1 = null;
            if (rs.next()) {
                vehicle1 = new Vehicle();
                vehicle1.setVin(rs.getString("vin"));
                vehicle1.setDescription(rs.getString("description"));
                vehicle1.setInvoicePrice(rs.getBigDecimal("invoice_price"));
                vehicle1.setModelName(rs.getString("model_name"));
                vehicle1.setModelYear(rs.getDate("model_year"));
                vehicle1.setManufacturerName(rs.getString("manufacturer_name"));
                vehicle1.setInventoryClerkName(rs.getString("inventoryclerk_username"));
                vehicle1.setDateAdded(rs.getDate("date_added"));
            }
            return vehicle1;
        }, vin);
        return vehicle;
    }

    @Override
    public Map<String, Object> countAvailableVehicles() {
        String sql = "SELECT COUNT(Vehicle2Sale.vin) AS count \n" +
                "FROM (\n" +
                "SELECT Vehicle.vin AS vin, Sale.sold_date\n" +
                "FROM (\n" +
                "Vehicle\n" +
                "LEFT JOIN Sale ON Vehicle.vin = Sale.vin)) AS Vehicle2Sale\n" +
                "WHERE Vehicle2Sale.sold_date IS NULL;";
        return jdbcTemplate.queryForMap(sql);
    }

    @Override
    public boolean addVehicle(String vin, String manufacturerName, String modelName, String modelYear, float invoicePrice, String invoiceDate, String clerkUsername, String description) {
        String sql = "INSERT INTO Vehicle\n" +
                "(VIN, manufacturer_name, model_name, model_year, invoice_price, date_added, inventoryclerk_username, description)\n" +
                "VALUES (?, ?, ?, ?, ?, ?, ?, ?);";
        Object[] args = {vin, manufacturerName, modelName, modelYear, invoicePrice, invoiceDate, clerkUsername, description};
        return jdbcTemplate.update(sql, args) > 0;
    }

    @Override
    public boolean addCar(String vin, int numOfDoors) {
        String sql = "INSERT INTO Car\n" +
                "(VIN, number_of_doors) VALUES (?, ?);";
        Object[] args = {vin, numOfDoors};
        return jdbcTemplate.update(sql, args) > 0;
    }

    @Override
    public boolean addConvertible(String vin, String roofType, int backSeatCount) {
        String sql = "INSERT INTO Convertible\n" +
                "(VIN, roof_type, back_seat_count)\n" +
                "VALUES (?, ?, ?);";
        Object[] args = {vin, roofType, backSeatCount};
        return jdbcTemplate.update(sql, args) > 0;
    }

    @Override
    public boolean addTruck(String vin, int cargoCapacity, String cargoCoverType, int numRearAxies) {
        String sql = "INSERT INTO Truck\n" +
                "(VIN, cargo_capacity, cargo_cover_type, num_of_rear_axies)\n" +
                "VALUES (?, ?, ?, ?);";
        Object[] args = {vin, cargoCapacity, cargoCoverType, numRearAxies};
        return jdbcTemplate.update(sql, args) > 0;
    }

    @Override
    public boolean addVanMinivan(String vin, int hasDriverSideBackDoor) {
        String sql = "INSERT INTO VanMinivan\n" +
                "(VIN, has_drivers_side_back_door)\n" +
                "VALUES (?, ?);";
        Object[] args = {vin, hasDriverSideBackDoor};
        return jdbcTemplate.update(sql, args) > 0;
    }

    @Override
    public boolean addSUV(String vin, String driverTrainType, int numOfCupHolders) {
        String sql = "INSERT INTO SUV\n" +
                "(VIN, drivetrain_type, num_of_cupholders)\n" +
                "VALUES (?, ?, ?);";
        Object[] args = {vin, driverTrainType, numOfCupHolders};
        try {
            return jdbcTemplate.update(sql, args) > 0;
        } catch (Exception e) {
            throw e;
        }
    }

    @Override
    public boolean addColor(String vin, String color) {
        String sql = "INSERT INTO VehicleColorMerge (vin, color) VALUES (?, ?)";
        Object[] args = {vin, color};
        return jdbcTemplate.update(sql, args) > 0;
    }

    @Override
    public Float findPriceByVIN(String VIN) {
        String sql = "SELECT invoice_price FROM Vehicle WHERE Vehicle.vin = ?";
        return jdbcTemplate.query(sql, rs -> {
            Float ans = null;
            if (rs.next()) {
                ans = rs.getFloat("invoice_price");
            }
            return ans;
        }, VIN);
    }

    @Override
    public boolean sellVehicle(String vin, String soldDate, String salesUsername, Float soldPrice, String customerSearchID) {
        String sql = "INSERT INTO Sale\n" +
                "(salesperson_username, customerID, VIN, sold_date, sold_price) VALUES\n" +
                "(?,\n" +
                "(\n" +
                "SELECT CustomerFullInfo.customerID as customerID FROM\n" +
                "(\n" +
                "SELECT Customer.customerID AS customerID,\n" +
                "Individual.drivers_license_no AS DL,\n" +
                "Business.TIN AS TIN\n" +
                "FROM (\n" +
                "Customer\n" +
                "LEFT OUTER JOIN Individual ON Customer.customerID = Individual.customerID LEFT OUTER JOIN Business ON Customer.customerID = Business.customerID\n" +
                ")\n" +
                ") AS CustomerFullInfo\n" +
                "WHERE CustomerFullInfo.DL = ? OR CustomerFullInfo.TIN = ?), \n" +
                "?, ?, ?)";
        Object[] args = {salesUsername, customerSearchID, customerSearchID, vin, soldDate, soldPrice};
        return jdbcTemplate.update(sql, args) > 0;
    }

    @Override
    public List<Map<String, Object>> viewSaleDetailByVIN(String vin) {
        String sql = "SELECT Vehicle.VIN,\n" +
                "       Vehicle.invoice_price * 1.25 AS list_price,\n" +
                "       Sale.sold_price,\n" +
                "       Sale.sold_date,\n" +
                "       CONCAT(S.first_name, ' ', S.last_name) AS salesperson_name,\n" +
                "       CustomerFullInfo.*\n" +
                "FROM Vehicle\n" +
                "         LEFT JOIN Sale ON Vehicle.vin = Sale.vin\n" +
                "         LEFT JOIN (\n" +
                "    SELECT Customer.customerID,\n" +
                "           Customer.city,\n" +
                "           Customer.street_address,\n" +
                "           Customer.state,\n" +
                "           Customer.postal_code,\n" +
                "           Customer.phone_number,\n" +
                "           Customer.email_address,\n" +
                "           B.tin,\n" +
                "           B.business_name,\n" +
                "           B.title,\n" +
                "           B.contact_name,\n" +
                "           I.drivers_license_no,\n" +
                "           I.first_name,\n" +
                "           I.last_name\n" +
                "    FROM Customer\n" +
                "             LEFT JOIN Business B on Customer.customerID = B.customerID\n" +
                "             LEFT JOIN Individual I on Customer.customerID = I.customerID\n" +
                ") AS CustomerFullInfo ON Sale.customerID = CustomerFullInfo.customerID\n" +
                "         LEFT JOIN LoginUser S ON salesperson_username = S.username\n" +
                "WHERE Vehicle.VIN = ?";
        Object[] args = {vin};
        return jdbcTemplate.queryForList(sql, args);
    }

    @Override
    public List<Map<String, Object>> viewRepairDetailByVIN(String vin) {
        String sql = "SELECT Customer2Name.name AS customer_name,\n" +
                "CONCAT(LoginUser.first_name, ' ', LoginUser.last_name) AS service_writer_name, Repair.start_date,\n" +
                "Repair.complete_date,\n" +
                "Repair.labor_charge,\n" +
                "IFNULL(CostByVINStartDate.part_total_cost, 0) AS total_part_cost, IFNULL(CostByVINStartDate.part_total_cost, 0) + Repair.labor_charge AS total_cost FROM (\n" +
                "Repair\n" +
                "LEFT JOIN (\n" +
                "SELECT Individual.customerID, CONCAT(Individual.first_name, ' ', Individual.last_name) AS name\n" +
                "FROM Individual\n" +
                "UNION\n" +
                "SELECT Business.customerID, Business.business_name AS name\n" +
                "FROM Business\n" +
                ") AS Customer2Name\n" +
                "ON Repair.customerID = Customer2Name.customerID\n" +
                "LEFT JOIN LoginUser ON Repair.servicewriter_username = LoginUser.username LEFT JOIN (\n" +
                "SELECT vin, start_date, SUM(Part.quantity * Part.price) AS part_total_cost FROM Part\n" +
                "GROUP BY vin, start_date\n" +
                ") AS CostByVINStartDate\n" +
                "ON Repair.vin = CostByVINStartDate.vin AND Repair.start_date = CostByVINStartDate.start_date)\n" +
                "WHERE Repair.vin=?" +
                "ORDER BY complete_date IS NULL DESC, complete_date DESC";
        Object[] args = {vin};
        List<Map<String, Object>> repairHistory = jdbcTemplate.queryForList(sql, args);
        return repairHistory;
    }

    @Override
    public List<Map<String, Object>> findVehicleByDetail(String vin, String vehicleType, String manufacturerName, Integer modelYear, String color, Float minPrice, Float maxPrice, String keyword, Integer saleStatus) {
        String sql = "SELECT Vehicle.vin,\n" +
                "       description,\n" +
                "       invoice_price,\n" +
                "       1.25 * Vehicle.invoice_price          AS list_price,\n" +
                "       model_name,\n" +
                "       YEAR(model_year)                      AS model_year,\n" +
                "       manufacturer_name,\n" +
                "       inventoryclerk_username,\n" +
                "       date_added,\n" +
                "       GROUP_CONCAT(VehicleColorMerge.color) AS colors,\n" +
                "       Sale.salesperson_username,\n" +
                "       customerID,\n" +
                "       sold_date,\n" +
                "       sold_price,\n" +
                "       VehicleType.vehicle_type,\n" +
                "       Car.number_of_doors, Convertible.roof_type, back_seat_count, SUV.drivetrain_type, num_of_cupholders,\n" +
                "       Truck.cargo_capacity, cargo_cover_type, num_of_rear_axies, VanMinivan.has_drivers_side_back_door, \n" +
                "IF(Vehicle.description LIKE ?, 1, 0) AS match_desc\n" +
                "FROM Vehicle\n" +
                "    LEFT JOIN Car\n" +
                "    ON Vehicle.vin = Car.vin\n" +
                "    LEFT JOIN Convertible\n" +
                "    ON Vehicle.vin = Convertible.vin\n" +
                "    LEFT JOIN SUV\n" +
                "    ON Vehicle.vin = SUV.vin\n" +
                "    LEFT JOIN Truck\n" +
                "    ON Vehicle.vin = Truck.vin\n" +
                "    LEFT JOIN VanMinivan\n" +
                "    ON Vehicle.vin = VanMinivan.vin\n" +
                "         LEFT JOIN VehicleColorMerge\n" +
                "                   ON Vehicle.VIN = VehicleColorMerge.VIN\n" +
                "         LEFT OUTER JOIN Sale\n" +
                "                         ON Vehicle.VIN = Sale.VIN\n" +
                "         LEFT JOIN (\n" +
                "    SELECT VIN, 'Car' AS vehicle_type\n" +
                "    FROM Car\n" +
                "    UNION\n" +
                "    SELECT VIN, 'Convertible' AS vehicle_type\n" +
                "    FROM Convertible\n" +
                "    UNION\n" +
                "    SELECT VIN, 'Truck' AS vehicle_type\n" +
                "    FROM Truck\n" +
                "    UNION\n" +
                "    SELECT VIN, 'VanMinivan' AS vehicle_type\n" +
                "    FROM VanMinivan\n" +
                "    UNION\n" +
                "    SELECT VIN, 'SUV' AS vehicle_type\n" +
                "    FROM SUV\n" +
                ") AS VehicleType\n" +
                "                   ON VehicleType.VIN = Vehicle.VIN\n" +
                "WHERE (Vehicle.vin = ? OR ? IS NULL)\n" +
                "  AND (vehicle_type = ? OR ? IS NULL)\n" +
                "  AND (manufacturer_name = ? OR ? IS NULL)\n" +
                "  AND (YEAR(model_year) = ? OR ? IS NULL)\n" +
                "  AND (1.25 * Vehicle.invoice_price >= ? OR ? IS NULL)\n" +
                "  AND (1.25 * Vehicle.invoice_price <= ? OR ? IS NULL)\n" +
                "  AND (? IS NULL OR (\n" +
                "            manufacturer_name LIKE ? OR YEAR(model_year) LIKE ? OR model_name LIKE ? OR description LIKE ?\n" +
                "    ))\n" +
                "  AND (\n" +
                "        ? IS NULL OR (\n" +
                "        ? = 0 AND salesperson_username IS NULL\n" +
                "        ) OR (\n" +
                "            ? = 1 AND salesperson_username IS NOT NULL\n" +
                "            )\n" +
                "    )\n" +
                "GROUP BY Vehicle.vin, description, invoice_price, list_price, model_name, model_year, manufacturer_name,\n" +
                "         inventoryclerk_username, date_added, Sale.salesperson_username, customerID, sold_date, sold_price,\n" +
                "         VehicleType.vehicle_type\n" +
                "HAVING (colors LIKE ? OR ? IS NULL)";
        Object[] args = {keyword, vin, vin, vehicleType, vehicleType, manufacturerName, manufacturerName, modelYear, modelYear, minPrice, minPrice, maxPrice, maxPrice, keyword, keyword, keyword, keyword, keyword, saleStatus, saleStatus, saleStatus, color, color};
        List<Map<String, Object>> vehicleList = jdbcTemplate.queryForList(sql, args);
        return vehicleList;
    }

    @Override
    public List<Map<String, Object>> getAllManufacturers() {
        String sql = "SELECT * FROM Manufacturer";
        return jdbcTemplate.queryForList(sql);
    }

    @Override
    public List<Map<String, Object>> getAllColors() {
        String sql = "SELECT * FROM Color";
        return jdbcTemplate.queryForList(sql);
    }


}
