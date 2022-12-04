package gatech.cs6400.team12.jauntyjalopies.service;

import gatech.cs6400.team12.jauntyjalopies.common.R;

public interface RepairService {
    R viewRepairHistoryByVIN(String vin);
    R updateLaborCharge(String vin, String startDate, Float laborCharge);
    R completeRepair(String vin, String startDate);
    R insertRepair(String vin, String startDate, String serviceWriterUsername, String searchID, Integer odometerReading, Float laborCharge, String description);
    R changePartQuantity(String vin, String startDate, String partNumber, Integer quantity);
    R addPart(String vin, String startDate, String partNumber, Integer quantity, String vendorName, Float price);
}
