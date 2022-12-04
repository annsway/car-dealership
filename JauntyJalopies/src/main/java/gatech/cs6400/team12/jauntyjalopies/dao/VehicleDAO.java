package gatech.cs6400.team12.jauntyjalopies.dao;

import gatech.cs6400.team12.jauntyjalopies.POJO.Vehicle;

import java.util.Date;
import java.util.List;
import java.util.Map;

public interface VehicleDAO {
    Vehicle findVehicleByVIN(String vin);
    Map<String, Object> countAvailableVehicles();
    boolean addVehicle(String vin, String manufacturerName, String modelName, String modelYear, float invoicePrice, String invoiceDate, String clerkUsername, String description);
    boolean addCar(String vin, int numOfDoors);
    boolean addConvertible(String vin, String roofType, int backSeatCount);
    boolean addTruck(String vin, int cargoCapacity, String cargoCoverType, int numRearAxies);
    boolean addVanMinivan(String vin, int hasDriverSideBackDoor);
    boolean addSUV(String vin, String driverTrainType, int numOfCupHolders);
    boolean addColor(String vin, String color);
    Float findPriceByVIN(String VIN);
    boolean sellVehicle(String vin, String soldDate, String salesUsername, Float soldPrice, String customerSearchID);
    List<Map<String, Object>> viewSaleDetailByVIN(String vin);
    List<Map<String, Object>> viewRepairDetailByVIN(String vin);
    List<Map<String, Object>> findVehicleByDetail(String vin, String vehicleType, String manufacturerName, Integer modelYear, String color, Float minPrice, Float maxPrice, String keyword, Integer saleStatus);
    List<Map<String, Object>> getAllManufacturers();
    List<Map<String, Object>> getAllColors();
}
