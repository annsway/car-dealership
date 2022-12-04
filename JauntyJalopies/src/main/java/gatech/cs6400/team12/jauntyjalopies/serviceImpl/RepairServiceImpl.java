package gatech.cs6400.team12.jauntyjalopies.serviceImpl;

import gatech.cs6400.team12.jauntyjalopies.common.ErrorCode;
import gatech.cs6400.team12.jauntyjalopies.common.R;
import gatech.cs6400.team12.jauntyjalopies.dao.CustomerDAO;
import gatech.cs6400.team12.jauntyjalopies.dao.RepairDAO;
import gatech.cs6400.team12.jauntyjalopies.service.RepairService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.stereotype.Service;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.Map;

@Service
public class RepairServiceImpl implements RepairService {
    @Autowired
    RepairDAO repairDAO;

    @Autowired
    CustomerDAO customerDAO;

    private Logger logger = LoggerFactory.getLogger(RepairService.class);

    @Override
    public R viewRepairHistoryByVIN(String vin) {
        try {
            List<Map<String, Object>> history = repairDAO.viewRepairHistory(vin);
            return R.ok().put("history", history);
        } catch (DataAccessException e) {
            return R.error(ErrorCode.VEHICLE_NOT_FOUND.getErrorCode(), e.getMessage());
        }
    }

    @Override
    public R updateLaborCharge(String vin, String startDate, Float laborCharge) {
        try {
            boolean res = repairDAO.updateLaborCharge(vin, startDate, laborCharge);
            return res ? R.ok("Successfully updated labor charge") : R.error(ErrorCode.REPAIR_UPDATE_LABOR_CHARGE_FAILURE.getErrorCode(), "Updating labor charge failed!");
        } catch (DataAccessException e) {
            return R.error(ErrorCode.REPAIR_UPDATE_LABOR_CHARGE_FAILURE.getErrorCode(), e.getMessage());
        }
    }

    @Override
    public R completeRepair(String vin, String startDate) {
        try {
            Date completeDate = repairDAO.completeRepair(vin, startDate);
            DateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
            String completeDateString = dateFormat.format(completeDate);
            return R.ok("Successfully completed a repair at " + completeDateString);
        } catch (DataAccessException e) {
            return R.error(ErrorCode.REPAIR_CLOSE_FAILURE.getErrorCode(), e.getMessage());
        }
    }

    @Override
    public R insertRepair(String vin, String startDate, String serviceWriterUsername, String searchID, Integer odometerReading, Float laborCharge, String description) {
        try {
            Map<String, Object> targetCustomer = customerDAO.findCustomer(searchID);
            Integer customerID = ((Long)targetCustomer.get("customerID")).intValue();
            boolean res = repairDAO.createRepair(vin, startDate, serviceWriterUsername, customerID, odometerReading, laborCharge, description);
            return res ? R.ok("Successfully inserted a new repair!") : R.error("Inserting a new repair failed!");
        } catch (DataAccessException e) {
            return R.error(ErrorCode.REPAIR_INSERT_FAILURE.getErrorCode(), e.getMessage());
        }
    }

    @Override
    public R changePartQuantity(String vin, String startDate, String partNumber, Integer quantity) {
        try {
            boolean res = repairDAO.changePartQuantity(vin, startDate,partNumber, quantity);
            return res ? R.ok("Successfully updated the part quantity!") : R.error(ErrorCode.REPAIR_CHANGE_QUANTITY.getErrorCode(), "Updating part quantity failed!");
        } catch (DataAccessException e) {
            return R.error(ErrorCode.REPAIR_CHANGE_QUANTITY.getErrorCode(), e.getMessage());
        }
    }

    @Override
    public R addPart(String vin, String startDate, String partNumber, Integer quantity, String vendorName, Float price) {
        try {
            boolean res = repairDAO.addPart(vin, startDate, partNumber, quantity, vendorName, price);
            return res ? R.ok("Successfully added parts!") : R.error("Failed to add parts!");
        } catch (DataAccessException e) {
            String causeMessage = e.getCause().getMessage();
            logger.error(causeMessage);
            return R.error(ErrorCode.ADD_PART_FAILURE.getErrorCode(), e.getMessage());
        }
    }


}
