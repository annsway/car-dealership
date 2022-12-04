package gatech.cs6400.team12.jauntyjalopies.serviceImpl;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import gatech.cs6400.team12.jauntyjalopies.POJO.Vehicle;
import gatech.cs6400.team12.jauntyjalopies.common.ErrorCode;
import gatech.cs6400.team12.jauntyjalopies.common.R;
import gatech.cs6400.team12.jauntyjalopies.dao.VehicleDAO;
import gatech.cs6400.team12.jauntyjalopies.service.VehicleService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;


@Service
public class VehicleServiceImpl implements VehicleService {
    private static final String VIN = "vin";
    private static final String MANUFACTURER_NAME = "manufacturerName";
    private static final String MODEL_NAME = "modelName";
    private static final String MODEL_YEAR = "modelYear";
    private static final String INVOICE_PRICE = "invoicePrice";
    private static final String INVOICE_DATE = "invoiceDate";
    private static final String CLERK_USERNAME = "clerkUsername";
    private static final String DESC = "description";
    private static final String TYPE = "type";
    private static final String NUM_DOORS = "numDoors";
    private static final String ROOF_TYPE = "roofType";
    private static final String BACK_SEAT_COUNT = "backSeatCount";
    private static final String CARGO_CAPACITY = "cargoCapacity";
    private static final String CARGO_COVER_TYPE = "cargoCoverType";
    private static final String NUM_REAR_AXIES = "numRearAxies";
    private static final String HAS_DRIVER_SIDE_BACK_DOOR = "hasDriverSideBackDoor";
    private static final String DRIVE_TRAIN_TYPE = "driveTrainType";
    private static final String NUM_CUP_HOLDERS = "numCupHolders";
    private static final String COLORS = "colors";
    private static final String LIST_PRICE = "listPrice";
    private final Logger logger = LoggerFactory.getLogger(VehicleServiceImpl.class);
    @Autowired
    VehicleDAO vehicleDAO;
    @Autowired
    ObjectMapper objectMapper;

    @Override
    public R findVehicleByVIN(String vin) throws JsonProcessingException {
        Vehicle vehicle = vehicleDAO.findVehicleByVIN(vin);
        if (vehicle != null) {
            String json = objectMapper.writeValueAsString(vehicle);
            logger.info(json);
            return R.ok().put("vehicle", vehicle);
        }
        return R.error("Unable to locate the car!");
    }

    @Override
    public R countAvailableVehicles() {
        try {
            Map<String, Object> counts = vehicleDAO.countAvailableVehicles();
            return R.ok(counts);
        } catch (DataAccessException e) {
            return R.error(ErrorCode.UNKNOWN_ERROR.getErrorCode(), "Unable to fetch available cars!");
        }
    }

    @Override
    @Transactional
    public R addVehicle(Map<String, Object> vehicle) {
        String vin = (String) vehicle.get(VIN);
        String manufacturerName = (String) vehicle.get(MANUFACTURER_NAME);
        String modelName = (String) vehicle.get(MODEL_NAME);
        String modelYear = vehicle.get(MODEL_YEAR) + "-01-01";
        float invoicePrice = Float.parseFloat((String) vehicle.get(INVOICE_PRICE));
        String invoiceDate = (String) vehicle.get(INVOICE_DATE);
        String clerkName = (String) vehicle.get(CLERK_USERNAME);
        String description = (String) vehicle.get(DESC);
//        String colors = (String) vehicle.get(COLORS);
        try {
            vehicleDAO.addVehicle(vin, manufacturerName, modelName, modelYear, invoicePrice, invoiceDate, clerkName, description);
        } catch (DataAccessException e) {
            logger.error(e.getCause().getMessage());
            return R.error(ErrorCode.VEHICLE_ADDITION_ERROR.getErrorCode(), e.getCause().getMessage());
        }
        String type = (String) vehicle.get(TYPE);
        try {
            if (type.equals("Car")) {
                int numDoors = Integer.parseInt((String) vehicle.get(NUM_DOORS));
                vehicleDAO.addCar(vin, numDoors);
            } else if (type.equals("Convertible")) {
                String roofType = (String) vehicle.get(ROOF_TYPE);
                int backSeatCount = Integer.parseInt((String) vehicle.get(BACK_SEAT_COUNT));
                vehicleDAO.addConvertible(vin, roofType, backSeatCount);
            } else if (type.equals("Truck")) {
                int cargoCapacity = Integer.parseInt((String) vehicle.get(CARGO_CAPACITY));
                String cargoCoverType = (String) vehicle.get(CARGO_COVER_TYPE);
                int numRearAxies = Integer.parseInt((String) vehicle.get(NUM_REAR_AXIES));
                vehicleDAO.addTruck(vin, cargoCapacity, cargoCoverType, numRearAxies);
            } else if (type.equals("VanMinivan")) {
                int hasDriverSideBackDoor = Integer.parseInt((String) vehicle.get(HAS_DRIVER_SIDE_BACK_DOOR));
                vehicleDAO.addVanMinivan(vin, hasDriverSideBackDoor);
            } else if (type.equals("SUV")) {
                String driveTrainType = (String) vehicle.get(DRIVE_TRAIN_TYPE);
                int numCupHolders = Integer.parseInt((String) vehicle.get(NUM_CUP_HOLDERS)) ;
                vehicleDAO.addSUV(vin, driveTrainType, numCupHolders);
            } else return R.error(ErrorCode.VEHICLE_TYPE_UNSUPPORTED.getErrorCode(), "Unsupported vehicle type!");
        } catch (DataAccessException e) {
            logger.error(e.getCause().getMessage());
            return R.error(ErrorCode.VEHICLE_ADDITION_ERROR.getErrorCode(), e.getCause().getMessage());
        }
        List<String> colorArr = (List<String>) vehicle.get(COLORS);
        try {
            boolean res = true;
            for (String eachColor : colorArr) {
                res = res && vehicleDAO.addColor(vin, eachColor);
            }
            return res ? R.ok("Successfully inserted a vehicle!") : R.error(ErrorCode.VEHICLE_ADDITION_ERROR.getErrorCode(), "Inserting vehicle failed!");
        } catch (DataAccessException e) {
            logger.error(e.getCause().getMessage());
            return R.error(ErrorCode.VEHICLE_ADDITION_ERROR.getErrorCode(), e.getCause().getMessage());
        }
    }

    @Override
    public R checkPrice(String vin) {
        try {
            Float ans = vehicleDAO.findPriceByVIN(vin);
            return ans == null ? R.error(ErrorCode.VEHICLE_NOT_FOUND.getErrorCode(), "Vehicle not found!") : R.ok().put("invoicePrice", ans);
        } catch (DataAccessException e) {
            return R.error(ErrorCode.VEHICLE_NOT_FOUND.getErrorCode(), e.getMessage());
        }
    }

    @Override
    public R sellVehicle(String vin, String soldDate, String salesUsername, Float soldPrice, String customerSearchID) {
        try {
            boolean res = vehicleDAO.sellVehicle(vin, soldDate, salesUsername, soldPrice, customerSearchID);
            return res ? R.ok("Successfully inserted a sales record!") : R.error(ErrorCode.VEHICLE_SALE_FAILURE.getErrorCode(), "Inserting sales record failed!");
        } catch (DataAccessException e) {
            return R.error(ErrorCode.VEHICLE_SALE_FAILURE.getErrorCode(), e.getMessage());
        }
    }

    @Override
    public R viewSaleDetailByVIN(String vin) {
        try {
            List<Map<String, Object>> saleHistory = vehicleDAO.viewSaleDetailByVIN(vin);
            Map<String, Object> sales = new HashMap<>();
            if (!saleHistory.isEmpty() && saleHistory.size() != 1) {
                return R.error(ErrorCode.DATABASE_ERROR.getErrorCode(), "Database error, multi sales record detected!");
            }
            if (saleHistory.isEmpty()) return R.ok().put("sales", saleHistory);
            Map<String, Object> record = saleHistory.get(0);
            sales.put(VIN, record.get("VIN"));
            sales.put(LIST_PRICE, record.get("list_price"));
            sales.put("soldPrice", record.get("sold_price"));
            sales.put("soldDate", record.get("sold_date"));
            sales.put("salespersonUsername", record.get("salesperson_name"));
            Map<String, Object> customerInfo = new HashMap<>();
            customerInfo.put("city", record.get("city"));
            customerInfo.put("streetAddress", record.get("street_address"));
            customerInfo.put("state", record.get("state"));
            customerInfo.put("postalCode", record.get("postal_code"));
            customerInfo.put("phoneNumber", record.get("phone_number"));
            customerInfo.put("emailAddress", record.get("email_address"));
            if (record.get("tin") != null) {
                customerInfo.put("tin", record.get("tin"));
                customerInfo.put("businessName", record.get("business_name"));
                customerInfo.put("title", record.get("title"));
                customerInfo.put("contactName", record.get("contact_name"));
            } else {
                customerInfo.put("driverLicense", record.get("drivers_license_no"));
                customerInfo.put("firstName", record.get("first_name"));
                customerInfo.put("lastName", record.get("last_name"));
            }
            sales.put("customer", customerInfo);
            return R.ok().put("sales", sales);
        } catch (DataAccessException e) {
            return R.error(ErrorCode.VEHICLE_NOT_FOUND.getErrorCode(), e.getMessage());
        }
    }

    @Override
    public R viewRepairByVIN(String vin) {
        try {
            List<Map<String, Object>> repairHistory = vehicleDAO.viewRepairDetailByVIN(vin);
            return R.ok().put("repairs", repairHistory);
        } catch (DataAccessException e) {
            return R.error(ErrorCode.VEHICLE_NOT_FOUND.getErrorCode(), e.getMessage());
        }
    }

    @Override
    public R findVehiclesByDetail(String vin, String vehicleType, String manufacturerName, Integer modelYear, String color, Float minPrice, Float maxPrice, String keyword, Integer saleStatus) {
        try {
            color = color == null ? null : "%" + color + "%";
            keyword = keyword == null ? null : "%" + keyword + "%";
            List<Map<String, Object>> res = vehicleDAO.findVehicleByDetail(vin, vehicleType, manufacturerName, modelYear, color, minPrice, maxPrice, keyword, saleStatus);
            return R.ok().put("vehicles", res);
        } catch (DataAccessException e) {
            return R.error(ErrorCode.VEHICLE_NOT_FOUND.getErrorCode(), e.getMessage());
        }
    }

    @Override
    public R getAllManufacturers() {
        try {
            List<Map<String, Object>> res = vehicleDAO.getAllManufacturers();
            List<Object> manufacturerList = res.stream().map(row -> row.get("manufacturer_name")).collect(Collectors.toList());
            return R.ok().put("manufacturers", manufacturerList);
        } catch (DataAccessException e) {
            return R.error("Unable to obtain manufacturers!").put("manufacturers", new ArrayList<>());
        }
    }

    @Override
    public R getAllColors() {
        try {
            List<Map<String, Object>> res = vehicleDAO.getAllColors();
            List<Object> colorList = res.stream().map(row -> row.get("color")).collect(Collectors.toList());
            return R.ok().put("colors", colorList);
        } catch (DataAccessException e) {
            return R.error("Unable to obtain colors").put("colors", new ArrayList<>());
        }
    }
}
