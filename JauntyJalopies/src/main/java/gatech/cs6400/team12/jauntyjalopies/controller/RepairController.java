package gatech.cs6400.team12.jauntyjalopies.controller;

import gatech.cs6400.team12.jauntyjalopies.common.R;
import gatech.cs6400.team12.jauntyjalopies.service.RepairService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
public class RepairController {
    private static final String VIN_STR = "vin";
    private static final String START_DATE = "startDate";
    private static final String LABOR_CHARGE = "laborCharge";
    private static final String SERVICE_WRITER_USERNAME = "serviceWriterUsername";
    private static final String SEARCH_ID = "searchID";
    private static final String ODOMETER_READING = "odometerReading";
    private static final String DESC = "description";

    private static final String QUANTITY = "quantity";
    private static final String PART_NUMBER = "partNumber";
    private static final String VENDOR_NAME = "vendorName";
    private static final String PART_PRICE = "partPrice";

    @Autowired
    RepairService repairService;

    @GetMapping("/api/repair/history")
    public R viewRepairHistory(@RequestParam String vin) {
        return repairService.viewRepairHistoryByVIN(vin);
    }


    @PostMapping("/api/repair/update/laborcharge")
    public R updateLaborCharge(@RequestBody Map<String, Object> updateForm) {
        String vin = (String) updateForm.get(VIN_STR);
        String startDate = (String) updateForm.get(START_DATE);
        Float laborCharge = Float.parseFloat((String) updateForm.get(LABOR_CHARGE));
        return repairService.updateLaborCharge(vin, startDate, laborCharge);
    }

    @PostMapping("/api/repair/close")
    public R closeRepair(@RequestBody Map<String, Object> completeForm) {
        String vin = (String) completeForm.get(VIN_STR);
        String startDate = (String) completeForm.get(START_DATE);
        return repairService.completeRepair(vin, startDate);
    }

    @PostMapping("/api/repair/create")
    public R createRepair(@RequestBody Map<String, Object> repairForm) {
        String vin = (String) repairForm.get(VIN_STR);
        String startDate = (String) repairForm.get(START_DATE);
        String serviceWriterUsername = (String) repairForm.get(SERVICE_WRITER_USERNAME);
        String searchID = (String) repairForm.get(SEARCH_ID);
        Integer odometerReading = Integer.parseInt((String) repairForm.get(ODOMETER_READING));
        Float laborCharge = Float.parseFloat((String) repairForm.get(LABOR_CHARGE));
        String description = (String) repairForm.get(DESC);
        return repairService.insertRepair(vin,startDate, serviceWriterUsername, searchID, odometerReading, laborCharge, description);
    }

    @PostMapping("/api/part/update/quantity")
    public R changePartQuantity(@RequestBody Map<String, Object> quantityChangeForm) {
        String vin = (String) quantityChangeForm.get(VIN_STR);
        String startDate = (String) quantityChangeForm.get(START_DATE);
        String partNumber = (String) quantityChangeForm.get(PART_NUMBER);
        Integer quantity = Integer.parseInt((String) quantityChangeForm.get(QUANTITY));
        return repairService.changePartQuantity(vin, startDate, partNumber, quantity);
    }

    @PostMapping("/api/part/insert")
    public R addPart(@RequestBody Map<String, Object> partAdditionForm) {
        String vin = (String) partAdditionForm.get(VIN_STR);
        String startDate = (String) partAdditionForm.get(START_DATE);
        String partNumber = (String) partAdditionForm.get(PART_NUMBER);
        Integer quantity = Integer.parseInt((String) partAdditionForm.get(QUANTITY)) ;
        String vendorName = (String) partAdditionForm.get(VENDOR_NAME);
        Float partPrice = Float.parseFloat((String) partAdditionForm.get(PART_PRICE));
        return repairService.addPart(vin, startDate,partNumber, quantity, vendorName, partPrice);
    }
}
