package gatech.cs6400.team12.jauntyjalopies.serviceImpl;

import gatech.cs6400.team12.jauntyjalopies.common.ErrorCode;
import gatech.cs6400.team12.jauntyjalopies.common.R;
import gatech.cs6400.team12.jauntyjalopies.dao.CustomerDAO;
import gatech.cs6400.team12.jauntyjalopies.service.CustomerService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.SQLException;
import java.sql.SQLIntegrityConstraintViolationException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class CustomerServiceImpl implements CustomerService {
    Logger logger = LoggerFactory.getLogger(CustomerService.class);

    @Autowired
    CustomerDAO customerDAO;

    @Override
    public R findCustomer(String searchID) {
        Map<String, Object> res = customerDAO.findCustomer(searchID);
        return res == null ? R.error("Could not find the user!") : R.ok(res);
    }

    @Override
    @Transactional
    public R addBusiness(String city, String streetAddress, String state, String postalCode, String phoneNumber, String emailAddress, String TIN, String businessName, String title, String contactName) {
        try {
            Integer customerID = customerDAO.addCustomer(city, streetAddress, state, postalCode, phoneNumber, emailAddress);
            boolean res = customerDAO.addBusiness(customerID,TIN, businessName, title, contactName);
            return res ? R.ok("Successfully inserted a business!") : R.error("Inserting a business failed!");
        } catch (DataAccessException e) {
            logger.error(e.getMessage());
            SQLException sqlE = (SQLException) e.getCause();
            logger.error(sqlE.getMessage());
            return R.error(ErrorCode.CUSTOMER_ADDITION_ERROR.getErrorCode(), sqlE.getLocalizedMessage());
        } catch (Exception e) {
            return R.error(ErrorCode.UNABLE_TO_CONNECT.getErrorCode(), e.getMessage());
        }
    }

    @Override
    @Transactional
    public R addIndividual(String city, String streetAddress, String state, String postalCode, String phoneNumber, String emailAddress, String DL, String firstName, String lastName) {
        try {
            Integer customerID = customerDAO.addCustomer(city, streetAddress, state, postalCode, phoneNumber, emailAddress);
            boolean res = customerDAO.addIndividual(customerID, DL, firstName, lastName);
            return res ? R.ok("Successfully inserted an individual!"): R.error("Inserting an individual failed!");
        } catch (DataAccessException e) {
            logger.error(e.getMessage());
            SQLException sqlE = (SQLException) e.getCause();
            logger.error(sqlE.getMessage());
            return R.error(ErrorCode.CUSTOMER_ADDITION_ERROR.getErrorCode(), sqlE.getLocalizedMessage());
        } catch (Exception e) {
            return R.error(ErrorCode.UNABLE_TO_CONNECT.getErrorCode(), e.getMessage());
        }
    }

    @Override
    public R lookupCustomer(String searchID) {
        try {
            Integer customerID = Math.toIntExact((Long) customerDAO.findCustomerID(searchID).get("customerID")) ;
            Map<String, Object> contactInfo = customerDAO.findCustomerByID(customerID);
            List<Map<String, Object>> individualInfo = customerDAO.findCustomerNameByIDFromIndividual(customerID);
            List<Map<String, Object>> businessInfo = customerDAO.findCustomerNameByIDFromBusiness(customerID);
            Map<String, Object> res = new HashMap<>();
            res.putAll(contactInfo);
            if (individualInfo.isEmpty()) {
                res.putAll(businessInfo.get(0));
            } else {
                res.putAll(individualInfo.get(0));
            }
            return R.ok().put("customer", res);
        } catch (DataAccessException e) {
            logger.error(e.getMessage());
            return R.error(ErrorCode.CUSTOMER_NOT_FOUND.getErrorCode(), "Unable to find customer!");
        } catch (NullPointerException e) {
            logger.error(e.getCause().getMessage());
            return R.error(ErrorCode.CUSTOMER_NOT_FOUND.getErrorCode(), e.getCause().getMessage());
        }
    }


}
