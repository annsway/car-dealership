package gatech.cs6400.team12.jauntyjalopies.POJO;

import lombok.Data;

import java.math.BigDecimal;
import java.util.Date;

@Data
public class Repair {
    private String vin;
    private Date startDate;
    private String serviceWriterUsername;
    private Integer customerID;
    private Date completeDate;
    private Integer odometerReading;
    private BigDecimal laborCharge;
    private String description;
}
