package gatech.cs6400.team12.jauntyjalopies.service;

import gatech.cs6400.team12.jauntyjalopies.common.R;

public interface CustomerService {
    R findCustomer(String searchID);
    R addBusiness(String city, String streetAddress, String state, String postalCode, String phoneNumber, String emailAddress, String TIN, String businessName, String title, String contactName);
    R addIndividual(String city, String streetAddress, String state, String postalCode, String phoneNumber, String emailAddress, String DL, String firstName, String lastName);
    R lookupCustomer(String searchID);
}
