package gatech.cs6400.team12.jauntyjalopies.dao;

import java.util.Date;
import java.util.List;
import java.util.Map;

public interface RepairDAO {
    List<Map<String, Object>> viewRepairHistory(String vin);
    boolean updateLaborCharge(String vin, String startDate, Float laborCharge);
    Date completeRepair(String vin, String startDate);
    boolean createRepair(String vin, String startDate, String serviceWriterUsername, Integer customerID, Integer odometerReading, Float laborCharge, String description);
    boolean changePartQuantity(String vin, String startDate, String partNumber, Integer quantity);
    boolean addPart(String vin, String startDate, String partNumber, Integer quantity, String vendorName, Float price);
}
