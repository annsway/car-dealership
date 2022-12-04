package gatech.cs6400.team12.jauntyjalopies.POJO;

import lombok.Data;

import java.math.BigDecimal;
import java.util.Date;

@Data
public class Sale {
    private String salespersonUsername;
    private Integer customerID;
    private String vin;
    private Date soldDate;
    private BigDecimal soldPrice;
}
