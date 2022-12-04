package gatech.cs6400.team12.jauntyjalopies.dao;

import java.util.List;
import java.util.Map;

public interface CustomerDAO {
    Map<String, Object> findCustomer(String searchID);
    Integer addCustomer(String city, String streetAddress, String state, String postalCode, String phoneNumber, String emailAddress);
    boolean addBusiness(Integer customerID, String TIN, String businessName, String title, String contactName);
    boolean addIndividual(Integer customerID, String DL, String firstName, String lastName);
    Map<String, Object> findCustomerID(String searchID);
    Map<String, Object> findCustomerByID(Integer customerID);
    List<Map<String, Object>> findCustomerNameByIDFromIndividual(Integer customerID);
    List<Map<String, Object>> findCustomerNameByIDFromBusiness(Integer customerID);
}
