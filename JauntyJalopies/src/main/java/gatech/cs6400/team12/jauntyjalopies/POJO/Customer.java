package gatech.cs6400.team12.jauntyjalopies.POJO;

import lombok.Data;

@Data
public class Customer {
    private Integer customerID;
    private String city;
    private String streetAddress;
    private String state;
    private String postalCode;
    private String phoneNumber;
    private String emailAddress;
}
