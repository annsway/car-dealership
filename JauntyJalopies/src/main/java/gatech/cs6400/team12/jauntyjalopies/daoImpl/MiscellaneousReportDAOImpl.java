package gatech.cs6400.team12.jauntyjalopies.daoImpl;

import gatech.cs6400.team12.jauntyjalopies.dao.MiscellaneousReportDAO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

@Repository
public class MiscellaneousReportDAOImpl implements MiscellaneousReportDAO {
    @Autowired
    JdbcTemplate jdbcTemplate;

    @Override
    public List<Map<String, Object>> averageTimeReport() {
        String sql = "SELECT FullTypeList.vehicle_type, IFNULL(Daysgroup.days, 'N/A') AS days_in_inventory FROM (\n" +
                "SELECT 'Car' AS vehicle_type\n" +
                "UNION\n" +
                "SELECT 'Convertible' AS vehicle_type UNION\n" +
                "SELECT 'Truck' AS vehicle_type UNION\n" +
                "SELECT 'VanMinivan' AS vehicle_type UNION\n" +
                "SELECT 'SUV'\n" +
                ") AS FullTypeList\n" +
                "LEFT JOIN (\n" +
                "SELECT vehicle_type, ROUND(AVG(days), 1) AS days FROM (\n" +
                "SELECT DATEDIFF(sold_date, date_added) + 1 AS days, VehicleType.vehicle_type AS vehicle_type FROM Vehicle\n" +
                "NATURAL JOIN Sale\n" +
                "LEFT JOIN (\n" +
                "SELECT VIN, 'Car' AS vehicle_type\n" +
                "FROM Car\n" +
                "UNION\n" +
                "SELECT VIN, 'Convertible' AS vehicle_type\n" +
                "FROM Convertible\n" +
                "UNION\n" +
                "SELECT VIN, 'Truck' AS vehicle_type\n" +
                "FROM Truck\n" +
                "UNION\n" +
                "SELECT VIN, 'VanMinivan' AS vehicle_type\n" +
                "FROM VanMinivan\n" +
                "UNION\n" +
                "SELECT VIN, 'SUV' AS vehicle_type\n" +
                "FROM SUV\n" +
                ") AS VehicleType\n" +
                "ON VehicleType.VIN = Vehicle.VIN\n" +
                ") AS SaleTimeTable\n" +
                "GROUP BY SaleTimeTable.vehicle_type\n" +
                ") AS Daysgroup\n" +
                "ON Daysgroup.vehicle_type = FullTypeList.vehicle_type ORDER BY vehicle_type ASC";
        return jdbcTemplate.queryForList(sql);
    }

    @Override
    public List<Map<String, Object>> partStatistics() {
        String sql = "SELECT vendor_name,\n" +
                "SUM(quantity) AS count_of_parts, SUM(price * Part.quantity) AS total_price FROM Part\n" +
                "GROUP BY vendor_name\n" +
                "ORDER BY total_price DESC";
        return jdbcTemplate.queryForList(sql);
    }

    @Override
    public List<Map<String, Object>> monthlySalesGeneral() {
        String sql = "SELECT\n" +
                "YEAR(s.sold_date) AS year_sold\n" +
                ", MONTH(s.sold_date) AS month_sold\n" +
                ", COUNT(CONCAT(s.salesperson_username, s.vin, s.customerID)) AS num_of_vehicles_sold\n" +
                ", SUM(s.sold_price) AS total_sales_income\n" +
                ", SUM(s.sold_price) - SUM(v.invoice_price) AS total_net_income\n" +
                ", CONCAT(FORMAT(SUM(s.sold_price)*100.0 / SUM(v.invoice_price),0),'%') AS income_ratio FROM Sale s\n" +
                "INNER JOIN Vehicle v ON s.vin = v.vin\n" +
                "GROUP BY YEAR(s.sold_date), MONTH(s.sold_date)\n" +
                "ORDER BY year_sold DESC, month_sold DESC";
        return jdbcTemplate.queryForList(sql);
    }

    @Override
    public List<Map<String, Object>> monthLySalesIndividual(Integer month, Integer year) {
        String sql = "SELECT\n" +
                "CONCAT(uu.first_name, ' ', uu.last_name) AS salesperson_name\n" +
                ", COUNT(CONCAT(s.salesperson_username, s.vin, s.customerID)) AS num_of_vehicles_sold , SUM(s.sold_price) AS total_sales_income\n" +
                "FROM Sale s\n" +
                "INNER JOIN Salesperson sp ON s.salesperson_username = sp.username INNER JOIN LoginUser uu ON sp.username = uu.username\n" +
                "WHERE YEAR(s.sold_date) = ? AND MONTH(s.sold_date) = ?\n" +
                "GROUP BY CONCAT(uu.first_name, ' ', uu.last_name)\n" +
                "ORDER BY num_of_vehicles_sold DESC, total_sales_income DESC;";
        Object[] args = {year, month};
        return jdbcTemplate.queryForList(sql, args);
    }

    @Override
    public List<Map<String, Object>> belowCostSales() {
        String sql = "SELECT Sale.sold_date AS sold_date,\n" +
                "Vehicle.invoice_price AS invoice_price,\n" +
                "Sale.sold_price AS sold_price,\n" +
                "CONCAT(ROUND(sold_price / invoice_price * 100, 0), '%') AS percentage_ratio, Customer2Name.name AS customer_name,\n" +
                "CONCAT(LoginUser.first_name, ' ', LoginUser.last_name) AS salesperson_name FROM Sale\n" +
                "LEFT JOIN Vehicle ON Sale.vin = Vehicle.vin\n" +
                "LEFT JOIN (\n" +
                "SELECT Customer.customerID, CONCAT(Individual.first_name, ' ', Individual.last_name) AS name\n" +
                "FROM Customer\n" +
                "NATURAL JOIN Individual\n" +
                "UNION\n" +
                "SELECT Customer.customerID, Business.business_name AS name FROM Customer\n" +
                "NATURAL JOIN Business\n" +
                ") AS Customer2Name\n" +
                "ON Sale.customerID = Customer2Name.customerID\n" +
                "INNER JOIN Salesperson ON Salesperson.username = Sale.salesperson_username INNER JOIN LoginUser ON Salesperson.username = LoginUser.username\n" +
                "WHERE sold_price < invoice_price\n" +
                "ORDER BY sold_date DESC, percentage_ratio DESC";
        return jdbcTemplate.queryForList(sql);
    }
}
