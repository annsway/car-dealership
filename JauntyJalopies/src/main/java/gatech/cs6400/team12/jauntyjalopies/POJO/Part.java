package gatech.cs6400.team12.jauntyjalopies.POJO;

import lombok.Data;

import java.math.BigDecimal;
import java.util.Date;

@Data
public class Part {
    private String vin;
    private Date startDate;
    private String partNumber;
    private Integer quantity;
    private String vendorName;
    private BigDecimal price;
}
