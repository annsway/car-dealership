package gatech.cs6400.team12.jauntyjalopies.daoImpl;

import gatech.cs6400.team12.jauntyjalopies.dao.SalesReportDAO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

@Repository
public class SalesReportDAOImpl implements SalesReportDAO {
    @Autowired
    JdbcTemplate jdbcTemplate;

    @Override
    public List<Map<String, Object>> salesByColor30Day() {
        String sql = "SELECT DISTINCT\n" +
                "allcolors.color\n" +
                ", CASE WHEN temp.num_of_vehicles_sold IS NULL THEN 0 ELSE temp.num_of_vehicles_sold END AS num_of_vehicles_sold\n" +
                "FROM (SELECT 'Multiple' as color FROM dual\n" +
                "union\n" +
                "SELECT color FROM Color) as allcolors LEFT JOIN\n" +
                "(SELECT\n" +
                "ss.color\n" +
                ", count(ss.vin) as num_of_vehicles_sold FROM (SELECT\n" +
                "CASE WHEN mcolor.vin IS NOT NULL THEN 'Multiple' ELSE vcm.color END AS color , s.vin\n" +
                "FROM Sale s\n" +
                "LEFT JOIN (\n" +
                "SELECT\n" +
                "vcm1.vin\n" +
                ", COUNT(vcm1.color) AS color_cnt\n" +
                "FROM VehicleColorMerge vcm1\n" +
                "GROUP BY vcm1.vin\n" +
                "HAVING color_cnt > 1\n" +
                ") AS mcolor ON s.vin = mcolor.vin\n" +
                "LEFT JOIN (\n" +
                "SELECT\n" +
                "vcm2.vin\n" +
                ", count(vcm2.color) AS color_cnt\n" +
                "FROM VehicleColorMerge vcm2\n" +
                "GROUP BY vcm2.vin\n" +
                "HAVING color_cnt = 1\n" +
                ") as scolor ON s.vin = scolor.vin\n" +
                "LEFT JOIN VehicleColorMerge vcm ON vcm.vin = scolor.vin WHERE s.sold_date <= (SELECT max(sold_date) FROM Sale)\n" +
                "and s.sold_date >= (SELECT sold_date FROM Sale ORDER BY sold_date DESC LIMIT 1) - INTERVAL 30 DAY -- previous 30 days\n" +
                "and s.sold_date <= (SELECT sold_date FROM Sale ORDER BY sold_date DESC LIMIT 1) ) AS ss\n" +
                "GROUP BY ss.color\n" +
                ") AS temp ON allcolors.color = temp.color ORDER BY allcolors.color ASC";
        List<Map<String, Object>> salesByColorReport = jdbcTemplate.queryForList(sql);
        return salesByColorReport;
    }

    @Override
    public List<Map<String, Object>> salesByColorLastYear() {
        String sql = "SELECT DISTINCT\n" +
                "allcolors.color\n" +
                ", CASE WHEN temp.num_of_vehicles_sold IS NULL THEN 0 ELSE temp.num_of_vehicles_sold END AS num_of_vehicles_sold\n" +
                "FROM (SELECT 'Multiple' AS color FROM dual\n" +
                "UNION\n" +
                "SELECT color FROM Color) AS allcolors LEFT JOIN\n" +
                "(SELECT\n" +
                "ss.color\n" +
                ", COUNT(ss.vin) AS num_of_vehicles_sold\n" +
                "FROM (SELECT\n" +
                "CASE WHEN mcolor.vin IS NOT NULL THEN 'Multiple' ELSE vcm.color END AS color\n" +
                ", s.vin\n" +
                "FROM Sale s\n" +
                "LEFT JOIN (\n" +
                "SELECT\n" +
                "vcm1.vin\n" +
                ", count(vcm1.color) AS color_cnt\n" +
                "FROM VehicleColorMerge vcm1\n" +
                "GROUP BY vcm1.vin\n" +
                "HAVING color_cnt > 1\n" +
                ") AS mcolor ON s.vin = mcolor.vin\n" +
                "LEFT JOIN (\n" +
                "SELECT\n" +
                "vcm2.vin\n" +
                ", count(vcm2.color) AS color_cnt\n" +
                "FROM VehicleColorMerge vcm2\n" +
                "GROUP BY vcm2.vin\n" +
                "HAVING color_cnt = 1\n" +
                ") AS scolor ON s.vin = scolor.vin\n" +
                "LEFT JOIN VehicleColorMerge vcm ON vcm.vin = scolor.vin WHERE s.sold_date <= (SELECT max(sold_date) FROM Sale)\n" +
                "AND s.sold_date >= (SELECT sold_date FROM Sale ORDER BY sold_date DESC LIMIT 1) - INTERVAL 365 DAY -- previous year\n" +
                "AND s.sold_date <= (SELECT sold_date FROM Sale ORDER BY sold_date DESC LIMIT 1)) AS ss\n" +
                "GROUP BY ss.color\n" +
                ") AS temp ON allcolors.color = temp.color ORDER BY allcolors.color ASC";
        List<Map<String, Object>> salesByColorReport = jdbcTemplate.queryForList(sql);
        return salesByColorReport;
    }

    @Override
    public List<Map<String, Object>> salesByColorAll() {
        String sql = "SELECT DISTINCT\n" +
                "allcolors.color\n" +
                ", CASE WHEN temp.num_of_vehicles_sold IS NULL THEN 0 ELSE temp.num_of_vehicles_sold END AS num_of_vehicles_sold\n" +
                "FROM (SELECT 'Multiple' AS color FROM dual\n" +
                "UNION\n" +
                "SELECT color FROM Color) AS allcolors LEFT JOIN\n" +
                "(SELECT\n" +
                "ss.color\n" +
                ", COUNT(ss.vin) AS num_of_vehicles_sold FROM (SELECT\n" +
                "CASE WHEN mcolor.vin IS NOT NULL THEN 'Multiple' ELSE vcm.color END AS color , s.vin\n" +
                "FROM Sale s\n" +
                "LEFT JOIN (\n" +
                "SELECT\n" +
                "vcm1.vin\n" +
                ", count(vcm1.color) AS color_cnt\n" +
                "FROM VehicleColorMerge vcm1\n" +
                "GROUP BY vcm1.vin\n" +
                "HAVING color_cnt > 1\n" +
                ") AS mcolor ON s.vin = mcolor.vin\n" +
                "LEFT JOIN (\n" +
                "SELECT\n" +
                "vcm2.vin\n" +
                ", COUNT(vcm2.color) AS color_cnt\n" +
                "FROM VehicleColorMerge vcm2\n" +
                "GROUP BY vcm2.vin\n" +
                "HAVING color_cnt = 1\n" +
                ") AS scolor ON s.vin = scolor.vin\n" +
                "LEFT JOIN VehicleColorMerge vcm ON vcm.vin = scolor.vin WHERE s.sold_date <= (SELECT MAX(sold_date) FROM Sale)\n" +
                ") AS ss\n" +
                "GROUP BY ss.color\n" +
                ") as temp ON allcolors.color = temp.color ORDER BY allcolors.color ASC";
        List<Map<String, Object>> salesByColorReport = jdbcTemplate.queryForList(sql);
        return salesByColorReport;
    }

    @Override
    public List<Map<String, Object>> salesByType30Day() {
        String sql = "SELECT DISTINCT\n" +
                "vtt.vehicle_type\n" +
                ", CASE WHEN temp.num_of_vehicles_sold IS NULL THEN 0 ELSE temp.num_of_vehicles_sold END AS num_of_vehicles_sold\n" +
                "FROM (SELECT VIN, 'Car' AS vehicle_type FROM Car UNION\n" +
                "SELECT VIN, 'Convertible' AS vehicle_type FROM Convertible UNION\n" +
                "SELECT VIN, 'Truck' AS vehicle_type FROM Truck UNION\n" +
                "SELECT VIN, 'VanMinivan' AS vehicle_type FROM VanMinivan UNION\n" +
                "SELECT VIN, 'SUV' AS vehicle_type FROM SUV) as vtt\n" +
                "LEFT JOIN\n" +
                "    (SELECT vt.vehicle_type\n" +
                ", count(s.vin) as num_of_vehicles_sold FROM Sale s\n" +
                "LEFT JOIN (\n" +
                "SELECT VIN, 'Car' AS vehicle_type FROM Car UNION\n" +
                "SELECT VIN, 'Convertible' AS vehicle_type FROM Convertible UNION SELECT VIN, 'Truck' AS vehicle_type FROM Truck UNION\n" +
                "SELECT VIN, 'VanMinivan' AS vehicle_type FROM VanMinivan UNION SELECT VIN, 'SUV' AS vehicle_type FROM SUV\n" +
                ") AS vt ON s.vin = vt.vin\n" +
                "WHERE s.sold_date <= (SELECT max(sold_date) FROM Sale)\n" +
                "AND s.sold_date >= (SELECT sold_date FROM Sale ORDER BY sold_date DESC LIMIT 1) - INTERVAL 30 DAY -- previous 30 days\n" +
                "GROUP BY vt.vehicle_type\n" +
                ") AS temp ON vtt.vehicle_type = temp.vehicle_type ORDER BY vtt.vehicle_type ASC";
        List<Map<String, Object>> salesByTypeReport = jdbcTemplate.queryForList(sql);
        return salesByTypeReport;
    }

    @Override
    public List<Map<String, Object>> salesByTypeLastYear() {
        String sql = "SELECT DISTINCT\n" +
                "vtt.vehicle_type\n" +
                ", CASE WHEN temp.num_of_vehicles_sold IS NULL THEN 0 ELSE temp.num_of_vehicles_sold END AS num_of_vehicles_sold\n" +
                "FROM (SELECT VIN, 'Car' AS vehicle_type FROM Car UNION\n" +
                "SELECT VIN, 'Convertible' AS vehicle_type FROM Convertible UNION\n" +
                "SELECT VIN, 'Truck' AS vehicle_type FROM Truck UNION\n" +
                "SELECT VIN, 'VanMinivan' AS vehicle_type FROM VanMinivan UNION\n" +
                "SELECT VIN, 'SUV' AS vehicle_type FROM SUV) as vtt\n" +
                "LEFT JOIN\n" +
                "    (SELECT vt.vehicle_type\n" +
                ", count(s.vin) as num_of_vehicles_sold FROM Sale s\n" +
                "LEFT JOIN (\n" +
                "SELECT VIN, 'Car' AS vehicle_type FROM Car UNION\n" +
                "SELECT VIN, 'Convertible' AS vehicle_type FROM Convertible UNION SELECT VIN, 'Truck' AS vehicle_type FROM Truck UNION\n" +
                "SELECT VIN, 'VanMinivan' AS vehicle_type FROM VanMinivan UNION SELECT VIN, 'SUV' AS vehicle_type FROM SUV\n" +
                ") AS vt ON s.vin = vt.vin\n" +
                "WHERE s.sold_date <= (SELECT max(sold_date) FROM Sale)\n" +
                "AND s.sold_date >= (SELECT sold_date FROM Sale ORDER BY sold_date DESC LIMIT 1) - INTERVAL 365 DAY -- previous 30 days\n" +
                "GROUP BY vt.vehicle_type\n" +
                ") AS temp ON vtt.vehicle_type = temp.vehicle_type ORDER BY vtt.vehicle_type ASC";
        List<Map<String, Object>> salesByTypeReport = jdbcTemplate.queryForList(sql);
        return salesByTypeReport;
    }

    @Override
    public List<Map<String, Object>> salesByTypeAll() {
        String sql = "SELECT DISTINCT\n" +
                "vtt.vehicle_type\n" +
                ", CASE WHEN temp.num_of_vehicles_sold IS NULL THEN 0 ELSE temp.num_of_vehicles_sold END AS num_of_vehicles_sold\n" +
                "FROM (SELECT VIN, 'Car' AS vehicle_type FROM Car UNION\n" +
                "SELECT VIN, 'Convertible' AS vehicle_type FROM Convertible UNION\n" +
                "SELECT VIN, 'Truck' AS vehicle_type FROM Truck UNION\n" +
                "SELECT VIN, 'VanMinivan' AS vehicle_type FROM VanMinivan UNION\n" +
                "SELECT VIN, 'SUV' AS vehicle_type FROM SUV) as vtt\n" +
                "LEFT JOIN\n" +
                "    (SELECT vt.vehicle_type\n" +
                ", count(s.vin) as num_of_vehicles_sold FROM Sale s\n" +
                "LEFT JOIN (\n" +
                "SELECT VIN, 'Car' AS vehicle_type FROM Car UNION\n" +
                "SELECT VIN, 'Convertible' AS vehicle_type FROM Convertible UNION SELECT VIN, 'Truck' AS vehicle_type FROM Truck UNION\n" +
                "SELECT VIN, 'VanMinivan' AS vehicle_type FROM VanMinivan UNION SELECT VIN, 'SUV' AS vehicle_type FROM SUV\n" +
                ") AS vt ON s.vin = vt.vin\n" +
                "WHERE s.sold_date <= (SELECT max(sold_date) FROM Sale)\n" +
                "GROUP BY vt.vehicle_type\n" +
                ") AS temp ON vtt.vehicle_type = temp.vehicle_type ORDER BY vtt.vehicle_type ASC";
        List<Map<String, Object>> salesByTypeReport = jdbcTemplate.queryForList(sql);
        return salesByTypeReport;
    }

    @Override
    public List<Map<String, Object>> salesByManufacturer30Day() {
        String sql = "SELECT DISTINCT\n" +
                "m.manufacturer_name\n" +
                ", COUNT(s.vin) AS num_of_vehicles_sold\n" +
                "FROM Sale s\n" +
                "INNER JOIN Vehicle v ON s.vin = v.vin\n" +
                "INNER JOIN Manufacturer m ON v.manufacturer_name = m.manufacturer_name\n" +
                "WHERE s.sold_date <= (SELECT MAX(sold_date) FROM Sale)\n" +
                "AND s.sold_date >= (SELECT MAX(sold_date) FROM Sale) - INTERVAL 30 DAY -- previous 30 days\n" +
                "GROUP BY m.manufacturer_name ORDER BY m.manufacturer_name";
        List<Map<String, Object>> salesByManufacturerReport = jdbcTemplate.queryForList(sql);
        return salesByManufacturerReport;
    }

    @Override
    public List<Map<String, Object>> salesByManufacturerLastYear() {
        String sql = "SELECT DISTINCT\n" +
                "m.manufacturer_name\n" +
                ", COUNT(s.vin) AS num_of_vehicles_sold\n" +
                "FROM Sale s\n" +
                "INNER JOIN Vehicle v ON s.vin = v.vin\n" +
                "INNER JOIN Manufacturer m ON v.manufacturer_name = m.manufacturer_name\n" +
                "WHERE s.sold_date <= (SELECT MAX(sold_date) FROM Sale)\n" +
                "AND s.sold_date >= (SELECT MAX(sold_date) FROM Sale) - INTERVAL 365 DAY -- previous 30 days\n" +
                "GROUP BY m.manufacturer_name ORDER BY m.manufacturer_name";
        List<Map<String, Object>> salesByManufacturerReport = jdbcTemplate.queryForList(sql);
        return salesByManufacturerReport;
    }

    @Override
    public List<Map<String, Object>> salesByManufacturerAll() {
        String sql = "SELECT DISTINCT\n" +
                "m.manufacturer_name\n" +
                ", COUNT(s.vin) AS num_of_vehicles_sold\n" +
                "FROM Sale s\n" +
                "INNER JOIN Vehicle v ON s.vin = v.vin\n" +
                "INNER JOIN Manufacturer m ON v.manufacturer_name = m.manufacturer_name\n" +
                "WHERE s.sold_date <= (SELECT MAX(sold_date) FROM Sale)\n" +
                "GROUP BY m.manufacturer_name ORDER BY m.manufacturer_name";
        List<Map<String, Object>> salesByManufacturerReport = jdbcTemplate.queryForList(sql);
        return salesByManufacturerReport;
    }
}
