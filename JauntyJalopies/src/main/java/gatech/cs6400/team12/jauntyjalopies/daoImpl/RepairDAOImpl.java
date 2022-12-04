package gatech.cs6400.team12.jauntyjalopies.daoImpl;

import gatech.cs6400.team12.jauntyjalopies.dao.RepairDAO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.ResultSetExtractor;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Types;
import java.util.Date;
import java.util.List;
import java.util.Map;

@Repository
public class RepairDAOImpl implements RepairDAO {
    @Autowired
    JdbcTemplate jdbcTemplate;


    @Override
    public List<Map<String, Object>> viewRepairHistory(String vin) {
        String sql = "SELECT vin, start_date,\n" +
                "servicewriter_username, CN.customerID, CN.customer_name, complete_date, odometer_reading, labor_charge, description\n" +
                "FROM `Repair` LEFT JOIN (\n" +
                "SELECT ic.customerID, CONCAT(ic.first_name, ' ', ic.last_name) AS customer_name FROM Individual ic UNION\n" +
                "SELECT bc.customerID, bc.business_name AS customer_name FROM Business bc ) AS CN ON `Repair`.customerID = CN.customerID\n" +
                "WHERE VIN = ? \n" +
                "ORDER BY complete_date IS NULL DESC, complete_date DESC";
        Object[] args = {vin};
        int[] argTypes = {Types.VARCHAR};
        try {
            List<Map<String, Object>> res = jdbcTemplate.queryForList(sql, vin);
            return res;
        } catch (Exception e) {
            return null;
        }
    }

    @Override
    public boolean updateLaborCharge(String vin, String startDate, Float laborCharge) {
        String sql = "UPDATE Repair SET labor_charge = ? WHERE vin= ? and start_date =\n" +
                " ?";
        Object[] args = {laborCharge, vin, startDate};
        return jdbcTemplate.update(sql, args) > 0;
    }

    @Override
    @Transactional
    public Date completeRepair(String vin, String startDate) {
        String sql = "UPDATE Repair SET complete_date = CURDATE() WHERE vin= ? and start_date = ?";
        Object[] args = {vin, startDate};
        jdbcTemplate.update(sql, args);
        String checkDate = "SELECT complete_date FROM Repair WHERE vin= ? AND start_date = ?";
        Date completeDate = jdbcTemplate.queryForObject(checkDate, Date.class, args);
        return completeDate;
    }

    @Override
    public boolean createRepair(String vin, String startDate, String serviceWriterUsername, Integer customerID, Integer odometerReading, Float laborCharge, String description) {
        String sql = "INSERT INTO Repair (vin, start_date, servicewriter_username, customerID,  odometer_reading, labor_charge, description)\n" +
                "VALUES (?, ?, ?, ?, ?, ?, ?)";
        Object[] args = {vin, startDate, serviceWriterUsername, customerID, odometerReading, laborCharge, description};
        return jdbcTemplate.update(sql, args) > 0;
    }

    @Override
    public boolean changePartQuantity(String vin, String startDate, String partNumber, Integer quantity) {
        String sql = "UPDATE Part\n" +
                "SET quantity = ?\n" +
                "WHERE vin = ?\n" +
                "AND start_date = ?\n" +
                "AND part_number = ?";
        Object[] args = {quantity, vin, startDate, partNumber};
        return jdbcTemplate.update(sql, args) > 0;
    }

    @Override
    public boolean addPart(String vin, String startDate, String partNumber, Integer quantity, String vendorName, Float price) {
        String sql = "INSERT INTO Part (vin, start_date, part_number, quantity, vendor_name, price) VALUES (?, ?, ?, ?, ?, ?)";
        Object[] args = {vin, startDate, partNumber, quantity, vendorName, price};
        return jdbcTemplate.update(sql, args) > 0;
    }

}
