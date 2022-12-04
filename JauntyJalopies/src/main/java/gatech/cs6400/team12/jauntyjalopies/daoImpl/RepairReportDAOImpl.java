package gatech.cs6400.team12.jauntyjalopies.daoImpl;

import gatech.cs6400.team12.jauntyjalopies.dao.RepairReportDAO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

@Repository
public class RepairReportDAOImpl implements RepairReportDAO {
    @Autowired
    JdbcTemplate jdbcTemplate;

    @Override
    public List<Map<String, Object>> generalInfo() {
        String sql = "SELECT m.manufacturer_name\n" +
                "     , COUNT(DISTINCT CONCAT(r.vin, r.start_date))                      AS count_of_repairs\n" +
                "     , SUM(IFNULL(p.price * p.quantity, 0))                             AS parts_cost\n" +
                "     , SUM(IFNULL(r.labor_charge, 0))                                   AS labor_cost\n" +
                "     , SUM(IFNULL(r.labor_charge, 0) + IFNULL(p.price * p.quantity, 0)) AS total_repair_cost\n" +
                "     , SUM(complete_date IS NULL AND p.vin IS NOT NULL ) AS count_of_incomplete_repairs\n" +
                "FROM Manufacturer m\n" +
                "         INNER JOIN Vehicle v ON m.manufacturer_name = v.manufacturer_name\n" +
                "         LEFT JOIN `Repair` r ON r.vin = v.vin\n" +
                "         LEFT JOIN Part p ON r.vin = p.vin AND r.start_date = p.start_date\n" +
                "GROUP BY m.manufacturer_name\n" +
                "ORDER BY m.manufacturer_name ASC";
        return jdbcTemplate.queryForList(sql);
    }

    @Override
    public List<Map<String, Object>> reportByType(String manufacturer) {
        String sql = "WITH vt AS (\n" +
                "SELECT VIN, 'Car' AS vehicle_type FROM Car UNION\n" +
                "SELECT VIN, 'Convertible' AS vehicle_type FROM Convertible UNION SELECT VIN, 'Truck' AS vehicle_type FROM Truck UNION\n" +
                "SELECT VIN, 'VanMinivan' AS vehicle_type FROM VanMinivan UNION SELECT VIN, 'SUV' AS vehicle_type FROM SUV\n" +
                ")\n" +
                "SELECT\n" +
                "vt.vehicle_type AS type\n" +
                ", COUNT(DISTINCT CONCAT(r.vin, r.start_date)) AS count_of_repairs\n" +
                ", SUM(IFNULL(p.price * p.quantity, 0)) AS parts_cost\n" +
                ", SUM(r.labor_charge) AS labor_cost\n" +
                ", SUM(r.labor_charge + ifnull(p.price * p.quantity, 0)) AS total_repair_cost\n" +
                "FROM `Repair` r\n" +
                "INNER JOIN Vehicle v ON r.vin = v.vin\n" +
                "INNER JOIN Manufacturer m ON m.manufacturer_name = v.manufacturer_name INNER JOIN vt ON r.vin = vt.vin\n" +
                "LEFT JOIN Part p ON r.vin = p.vin AND r.start_date = p.start_date\n" +
                "WHERE m.manufacturer_name = ? GROUP BY vt.vehicle_type";
        Object[] args = {manufacturer};
        return jdbcTemplate.queryForList(sql, args);
    }

    @Override
    public List<Map<String, Object>> reportByModel(String manufacturer) {
        String sql = "WITH vt AS (\n" +
                "SELECT VIN, 'Car' AS vehicle_type FROM Car UNION\n" +
                "SELECT VIN, 'Convertible' AS vehicle_type FROM Convertible UNION SELECT VIN, 'Truck' AS vehicle_type FROM Truck UNION\n" +
                "SELECT VIN, 'VanMinivan' AS vehicle_type FROM VanMinivan UNION SELECT VIN, 'SUV' AS vehicle_type FROM SUV\n" +
                ")\n" +
                "SELECT\n" +
                "CONCAT(vt.vehicle_type, '-', v.model_name) AS model\n" +
                ", COUNT(DISTINCT CONCAT(r.vin, r.start_date)) AS count_of_repairs\n" +
                ", SUM(IFNULL(p.price * p.quantity, 0)) AS parts_cost\n" +
                ", SUM(r.labor_charge) AS labor_cost\n" +
                ", SUM(r.labor_charge + IFNULL(p.price * p.quantity, 0)) AS total_repair_cost\n" +
                "FROM `Repair` r\n" +
                "INNER JOIN Vehicle v ON r.vin = v.vin\n" +
                "INNER JOIN Manufacturer m ON m.manufacturer_name = v.manufacturer_name INNER JOIN vt ON r.vin = vt.vin\n" +
                "LEFT JOIN Part p ON r.vin = p.vin AND r.start_date = p.start_date\n" +
                "WHERE m.manufacturer_name = ? GROUP BY vt.vehicle_type\n" +
                ", v.model_name";
        Object[] args = {manufacturer};
        return jdbcTemplate.queryForList(sql, args);
    }
}
