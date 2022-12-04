package gatech.cs6400.team12.jauntyjalopies.POJO;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.Data;
import lombok.SneakyThrows;
import org.springframework.beans.factory.annotation.Autowired;

import java.math.BigDecimal;
import java.util.Date;

@Data
public class Vehicle {
    private String vin;
    private String description;
    private BigDecimal invoicePrice;
    private String modelName;
    private Date modelYear;
    private String manufacturerName;
    private String inventoryClerkName;
    private Date dateAdded;
}
