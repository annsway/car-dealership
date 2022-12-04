package gatech.cs6400.team12.jauntyjalopies.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import gatech.cs6400.team12.jauntyjalopies.POJO.Vehicle;
import gatech.cs6400.team12.jauntyjalopies.common.R;

import java.util.Map;

public interface VehicleService {
    R findVehicleByVIN(String vin) throws JsonProcessingException;
    R countAvailableVehicles();
    R addVehicle(Map<String, Object> vehicle);
    R checkPrice(String vin);
    R sellVehicle(String vin, String soldDate, String salesUsername, Float soldPrice, String customerSearchID);
    R viewSaleDetailByVIN(String vin);
    R viewRepairByVIN(String vin);
    R findVehiclesByDetail(String vin, String vehicleType, String manufacturerName, Integer modelYear, String color, Float minPrice, Float maxPrice, String keyword, Integer saleStatus);
    R getAllManufacturers();
    R getAllColors();
}
