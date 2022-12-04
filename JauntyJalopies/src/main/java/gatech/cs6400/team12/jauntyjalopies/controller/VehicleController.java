package gatech.cs6400.team12.jauntyjalopies.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import gatech.cs6400.team12.jauntyjalopies.common.R;
import gatech.cs6400.team12.jauntyjalopies.service.VehicleService;
import org.apache.http.HttpStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
public class VehicleController {
    private static final String VIN_STR = "vin";
    private static final String SALESPERSON_USERNAME = "salesUsername";
    private static final String SEARCH_ID = "searchID";
    private static final String SOLD_DATE = "soldDate";
    private static final String SOLD_PRICE = "soldPrice";

    private static final String VEHICLE_TYPE = "type";
    private static final String MANUFACTURER_NAME = "manufacturerName";
    private static final String MODEL_YEAR = "modelYear";
    private static final String MAX_PRICE = "maxPrice";
    private static final String MIN_PRICE = "minPrice";
    private static final String KEYWORD = "keyword";
    private static final String SALE_STATUS = "saleStatus";
    private static final String COLOR = "color";


    @Autowired
    VehicleService vehicleService;

    @GetMapping("/vehicle/{vin}")
    public R findVehicle(@PathVariable String vin) throws JsonProcessingException {
        return vehicleService.findVehicleByVIN(vin);
    }

    @GetMapping("/api/countAvailable")
    public R countAvailableVehicles() {
        return vehicleService.countAvailableVehicles();
    }

    @PostMapping("/api/addVehicle")
    public R addVehicle(@RequestBody Map<String, Object> vehicle) {
//        return R.ok("Success!");
        return vehicleService.addVehicle(vehicle);
    }

    @GetMapping("/api/checkprice")
    public R checkPrice(@RequestParam String vin) {
        return vehicleService.checkPrice(vin);
    }

    @PostMapping("/api/sellVehicle")
    public R sellVehicle(@RequestBody Map<String, Object> salesDetail) {
        String vin = (String) salesDetail.get(VIN_STR);
        String salesUsername = (String) salesDetail.get(SALESPERSON_USERNAME);
        String searchID = (String) salesDetail.get(SEARCH_ID);
        String soldDate = (String) salesDetail.get(SOLD_DATE);
        Float soldPrice = Float.parseFloat((String) salesDetail.get(SOLD_PRICE)) ;
        return vehicleService.sellVehicle(vin, soldDate, salesUsername, soldPrice,searchID);
    }

    @GetMapping("/api/vehicle/sale/detail")
    public R viewSaleDetail(@RequestParam String vin) {
        return vehicleService.viewSaleDetailByVIN(vin);
    }

    @GetMapping("/api/vehicle/repair/detail")
    public R viewRepairDetail(@RequestParam String vin) {
        return vehicleService.viewRepairByVIN(vin);
    }

    @PostMapping("/api/vehicle/search")
    public R findVehicle(@RequestBody Map<String, Object> vehicleSearchForm) {
        String vin = vehicleSearchForm.get(VIN_STR) == null ? null : (String) vehicleSearchForm.get(VIN_STR);
        String type = vehicleSearchForm.get(VEHICLE_TYPE) == null ? null : (String) vehicleSearchForm.get(VEHICLE_TYPE);
        String manufacturerName = vehicleSearchForm.get(MANUFACTURER_NAME) == null ? null : (String) vehicleSearchForm.get(MANUFACTURER_NAME);
        Integer modelYear = vehicleSearchForm.get(MODEL_YEAR) == null ? null : Integer.parseInt((String) vehicleSearchForm.get(MODEL_YEAR));
        Float maxPrice =  vehicleSearchForm.get(MAX_PRICE) == null ? null : Float.parseFloat((String) vehicleSearchForm.get(MAX_PRICE));
        Float minPrice =  vehicleSearchForm.get(MIN_PRICE) == null ? null : Float.parseFloat((String) vehicleSearchForm.get(MIN_PRICE));
        Integer saleStatus = vehicleSearchForm.get(SALE_STATUS) == null ? null : Integer.parseInt((String) vehicleSearchForm.get(SALE_STATUS));
        String color = vehicleSearchForm.get(COLOR) == null ? null : (String) vehicleSearchForm.get(COLOR);
        String keyword = vehicleSearchForm.get(KEYWORD) == null ? null : (String) vehicleSearchForm.get(KEYWORD);
        return vehicleService.findVehiclesByDetail(vin, type, manufacturerName, modelYear, color, minPrice, maxPrice, keyword, saleStatus);
    }

    @GetMapping("/api/manufacturer/all")
    public R getAllManufacturers() {
        return vehicleService.getAllManufacturers();
    }

    @GetMapping("/api/color/all")
    public R getAllColors() {
        return vehicleService.getAllColors();
    }
}
