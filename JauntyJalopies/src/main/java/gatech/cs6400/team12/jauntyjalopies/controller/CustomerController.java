package gatech.cs6400.team12.jauntyjalopies.controller;

import gatech.cs6400.team12.jauntyjalopies.common.R;
import gatech.cs6400.team12.jauntyjalopies.service.CustomerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
public class CustomerController {
    private static final String TYPE = "type";
    private static final String CITY = "city";
    private static final String STREET_ADDRESS = "streetAddress";
    private static final String STATE = "state";
    private static final String POSTAL_CODE = "postalCode";
    private static final String PHONE_NUMBER = "phoneNumber";
    private static final String EMAIL_ADDRESS = "emailAddress";

    private static final String TIN_STR = "TIN";
    private static final String BUSINESS_NAME = "businessName";
    private static final String TITLE = "title";
    private static final String CONTACT_NAME = "contactName";

    private static final String DRIVER_LICENSE = "driverLicense";
    private static final String FIRST_NAME = "firstName";
    private static final String LAST_NAME = "lastName";

    @Autowired
    CustomerService customerService;

    @PostMapping("/api/lookupcustomer")
    public R lookUpCustomer(@RequestBody Map<String, String> lookUpForm) {
        String searchID = lookUpForm.get("searchID");
        return customerService.findCustomer(searchID);
    }

    @PostMapping("/api/addcustomer")
    public R addCustomer(@RequestBody Map<String, String> additionForm) {
        String type = additionForm.get(TYPE);
        if (type.equals("business")) {
            String city = additionForm.get(CITY);
            String streetAddress = additionForm.get(STREET_ADDRESS);
            String state = additionForm.get(STATE);
            String postalCode = additionForm.get(POSTAL_CODE);
            String phoneNumber = additionForm.get(PHONE_NUMBER);
            String emailAddress = additionForm.get(EMAIL_ADDRESS);
            String TIN = additionForm.get(TIN_STR);
            String businessName = additionForm.get(BUSINESS_NAME);
            String title = additionForm.get(TITLE);
            String contactName = additionForm.get(CONTACT_NAME);
            return customerService.addBusiness(city,streetAddress, state, postalCode, phoneNumber, emailAddress, TIN,businessName, title, contactName);
        } else if (type.equals("individual")) {
            String city = additionForm.get(CITY);
            String streetAddress = additionForm.get(STREET_ADDRESS);
            String state = additionForm.get(STATE);
            String postalCode = additionForm.get(POSTAL_CODE);
            String phoneNumber = additionForm.get(PHONE_NUMBER);
            String emailAddress = additionForm.get(EMAIL_ADDRESS);
            String DL = additionForm.get(DRIVER_LICENSE);
            String firstName = additionForm.get(FIRST_NAME);
            String lastName = additionForm.get(LAST_NAME);
            return customerService.addIndividual(city, streetAddress, state, postalCode, phoneNumber, emailAddress, DL, firstName, lastName);
        } else return R.error("Unsupported customer type!");
    }

    @GetMapping("/api/customer/find")
    public R findCustomer(@RequestParam String searchID) {
        return customerService.lookupCustomer(searchID);
    }
}
