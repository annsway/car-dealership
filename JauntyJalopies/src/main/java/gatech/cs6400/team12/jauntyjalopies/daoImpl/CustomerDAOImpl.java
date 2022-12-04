package gatech.cs6400.team12.jauntyjalopies.daoImpl;

import gatech.cs6400.team12.jauntyjalopies.dao.CustomerDAO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.PreparedStatementCreator;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.sql.*;
import java.util.List;
import java.util.Map;

@Repository
public class CustomerDAOImpl implements CustomerDAO {
    @Autowired
    JdbcTemplate jdbcTemplate;

    @Override
    public Map<String, Object> findCustomer(String searchID) {
        String sql = "SELECT CustomerFullInfo.customerID as customerID,\n" +
                "       CustomerFullInfo.customerID, DL, TIN, city, street_address, state, postal_code, phone_number, email_address\n" +
                "       FROM\n" +
                "(\n" +
                "SELECT Customer.customerID AS customerID, Individual.drivers_license_no AS DL, Business.TIN AS TIN,\n" +
                "       Customer.city, street_address, state, postal_code, phone_number, email_address\n" +
                "FROM (\n" +
                "Customer\n" +
                "LEFT OUTER JOIN Individual ON Customer.customerID = Individual.customerID\n" +
                "LEFT OUTER JOIN Business ON Customer.customerID = Business.customerID\n" +
                ")\n" +
                ") AS CustomerFullInfo\n" +
                "WHERE CustomerFullInfo.DL = ? OR CustomerFullInfo.TIN = ?";
        Object[] args = {searchID, searchID};
        int[] argTypes = {Types.VARCHAR, Types.VARCHAR};
        try {
            return jdbcTemplate.queryForMap(sql, args, argTypes);
        } catch (Exception e) {
            return null;
        }
    }

    @Override
    public Integer addCustomer(String city, String streetAddress, String state, String postalCode, String phoneNumber, String emailAddress) {
        String sql = "INSERT INTO Customer\n" +
                "(city, street_address, state, postal_code, phone_number, email_address)\n" +
                "VALUES (?, ?, ?, ?, ?, ?)";
        String[] args = {city, streetAddress, state, postalCode, phoneNumber, emailAddress};
        KeyHolder keyHolder = new GeneratedKeyHolder();
        jdbcTemplate.update(new PreparedStatementCreator() {
            @Override
            public PreparedStatement createPreparedStatement(Connection con) throws SQLException {
                PreparedStatement ps = con.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
                for (int i = 1; i <= 6; i++) {
                    ps.setString(i, args[i - 1]);
                }
                return ps;
            }
        }, keyHolder);
        Integer primaryKey = keyHolder.getKey().intValue();
        return primaryKey;
    }

    @Override
    public boolean addBusiness(Integer customerID, String TIN, String businessName, String title, String contactName) {
        String sql = "INSERT INTO Business\n" +
                "(TIN, business_name, title, contact_name,customerID)\n" +
                "VALUES (?, ?, ?, ?, ?)";
        Object[] args = {TIN, businessName, title, contactName, customerID};
        return jdbcTemplate.update(sql, args) > 0;
    }

    @Override
    public boolean addIndividual(Integer customerID, String DL, String firstName, String lastName) {
        String sql = "INSERT INTO Individual\n" +
                "(drivers_license_no, first_name, last_name, customerID)\n" +
                "VALUES (?, ?, ?, ?);";
        Object[] args = {DL, firstName, lastName, customerID};
        return jdbcTemplate.update(sql, args) > 0;
    }

    @Override
    public Map<String, Object> findCustomerID(String searchID) {
        String sql = "SELECT CustomerFullInfo.customerID as customerID FROM\n" +
                "(\n" +
                "SELECT Customer.customerID AS customerID, Individual.drivers_license_no AS DL, Business.TIN AS TIN\n" +
                "FROM (\n" +
                "Customer\n" +
                "LEFT OUTER JOIN Individual ON Customer.customerID = Individual.customerID LEFT OUTER JOIN Business ON Customer.customerID = Business.customerID\n" +
                ")\n" +
                ") AS CustomerFullInfo\n" +
                "WHERE CustomerFullInfo.DL = ? OR CustomerFullInfo.TIN = ?";
        Object[] args = {searchID, searchID};
        return jdbcTemplate.queryForMap(sql, args);
    }

    @Override
    public Map<String, Object> findCustomerByID(Integer customerID) {
        String sql = "SELECT city, street_address, state, postal_code, phone_number, email_address, customerID FROM Customer WHERE customerID = ?";
        Object[] args = {customerID};
        return jdbcTemplate.queryForMap(sql, args);
    }

    @Override
    public List<Map<String, Object>> findCustomerNameByIDFromIndividual(Integer customerID) {
        String sql = "SELECT drivers_license_no, first_name, last_name, customerID  FROM Individual WHERE customerID = ?";
        Object[] args = {customerID};
        return jdbcTemplate.queryForList(sql, args);
    }

    @Override
    public List<Map<String, Object>> findCustomerNameByIDFromBusiness(Integer customerID) {
        String sql = "SELECT tin, business_name, title, contact_name, customerID FROM Business WHERE customerID = ?";
        Object[] args = {customerID};
        return jdbcTemplate.queryForList(sql, args);
    }


}
