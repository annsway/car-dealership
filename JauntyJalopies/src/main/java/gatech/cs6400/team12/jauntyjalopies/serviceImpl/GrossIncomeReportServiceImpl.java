package gatech.cs6400.team12.jauntyjalopies.serviceImpl;

import gatech.cs6400.team12.jauntyjalopies.common.ErrorCode;
import gatech.cs6400.team12.jauntyjalopies.common.R;
import gatech.cs6400.team12.jauntyjalopies.dao.GrossIncomeDAO;
import gatech.cs6400.team12.jauntyjalopies.service.GrossIncomeReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class GrossIncomeReportServiceImpl implements GrossIncomeReportService {
    @Autowired
    GrossIncomeDAO grossIncomeDAO;

    @Override
    public R getGrossIncomeReport() {
        List<Map<String, Object>> grossIncomeReport = grossIncomeDAO.getGrossIncomeReport();
        return grossIncomeReport == null ? R.error("Could not fetch gross income report!") : R.ok().put("Report", grossIncomeReport);
    }

    @Override
    public R viewSaleHistoryByCustomerID(Integer customerID) {
        try {
            List<Map<String, Object>> saleHistory = grossIncomeDAO.saleHistoryBuCustomerID(customerID);
            return R.ok().put("sales", saleHistory);
        } catch (DataAccessException e) {
            return R.error(ErrorCode.REPORT_NOT_FETCHED.getErrorCode(), "Unable to get report!");
        }
    }

    @Override
    public R viewRepairHistoryByCustomerID(Integer customerID) {
        try {
            List<Map<String, Object>> repairHistory = grossIncomeDAO.repairHistoryByCustomerID(customerID);
            return R.ok().put("repairs", repairHistory);
        } catch (DataAccessException e) {
            return R.error(ErrorCode.REPORT_NOT_FETCHED.getErrorCode(), "Unable to get report!");
        }
    }
}
