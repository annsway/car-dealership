package gatech.cs6400.team12.jauntyjalopies.serviceImpl;

import gatech.cs6400.team12.jauntyjalopies.common.ErrorCode;
import gatech.cs6400.team12.jauntyjalopies.common.R;
import gatech.cs6400.team12.jauntyjalopies.dao.MiscellaneousReportDAO;
import gatech.cs6400.team12.jauntyjalopies.service.MiscellaneousReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;

@Service
public class MiscellaneousReportServiceImpl implements MiscellaneousReportService {
    @Autowired
    MiscellaneousReportDAO miscellaneousReportDAO;

    @Override
    public R getAverageTimeInInventory() {
        try {
            List<Map<String, Object>> res = miscellaneousReportDAO.averageTimeReport();
            Map<String, Object> map = convertAverageTime(res);
            return R.ok().put("averageTime", map);
        } catch (Exception e) {
            return R.error("Could not fetch average time in inventory!" + "\n" + e.getMessage());
        }
    }

    @Override
    public R getPartStatistics() {
        try {
            List<Map<String, Object>> res = miscellaneousReportDAO.partStatistics();
            Map<String, Map<String, Object>> map = convertPartStatistics(res);
            return R.ok().put("partStatistics", map);
        } catch (Exception e) {
            return R.error("Could not fetch part statistics!" + "\n" + e.getMessage());
        }
    }

    @Override
    public R getMonthlySaleGeneral() {
        try {
            List<Map<String, Object>> res = miscellaneousReportDAO.monthlySalesGeneral();
            Map<String, Map<String, Object>> map = convertMonthlySales(res);
            return R.ok().put("monthlySales", map);
        } catch (Exception e) {
            return R.error("Could not fetch monthly sales!" + "\n" + e.getMessage());
        }
    }

    @Override
    public R getMonthlySaleIndividual(Integer year, Integer month) {
        try {
            List<Map<String, Object>> res = miscellaneousReportDAO.monthLySalesIndividual(month, year);
            Map<String, Map<String, Object>> map = convertMonthlySalesIndividual(res);
            return R.ok().put("monthlySalesByIndividual", map);
        } catch (Exception e) {
            return R.error("Could not fetch monthly sales by individual!\n" + e.getMessage());
        }
    }

    @Override
    public R getBelowCostSales() {
        try {
            List<Map<String, Object>> res = miscellaneousReportDAO.belowCostSales();
            return R.ok().put("belowCostSales", res);
        } catch (DataAccessException e) {
            return R.error(ErrorCode.REPORT_NOT_FETCHED.getErrorCode(), "Unable to get below cost sales!");
        }
    }


    private Map<String, Object> convertAverageTime(List<Map<String, Object>> res) {
        Map<String, Object> map = new TreeMap<>();
        for (Map<String, Object> row : res) {
            String type = (String) row.get("vehicle_type");
            Object countDays = row.get("days_in_inventory");
            map.put(type, countDays);
        }
        return map;
    }

    private Map<String, Map<String, Object>> convertPartStatistics(List<Map<String, Object>> res) {
        Map<String, Map<String, Object>> map = new HashMap<>();
        for (Map<String, Object> row : res) {
            String vendor = (String) row.get("vendor_name");
            Object countParts = row.get("count_of_parts");
            Object totalPrice = row.get("total_price");
            Map<String, Object> key_value = new HashMap<>();
            key_value.put("countParts", countParts);
            key_value.put("totalPrice", totalPrice);
            map.put(vendor, key_value);
        }
        return map;
    }

    private Map<String, Map<String, Object>> convertMonthlySales(List<Map<String, Object>> res) {
        Map<String, Map<String, Object>> map = new HashMap<>();
        for (Map<String, Object> row : res) {
            String year = Integer.toString((Integer) row.get("year_sold"));
            String month = Integer.toString((Integer) row.get("month_sold"));
            Object numVehicleSold = row.get("num_of_vehicles_sold");
            Object totalSalesIncome = row.get("total_sales_income");
            Object totalNetIncome = row.get("total_net_income");
            Object incomeRatio = row.get("income_ratio");
            if (!map.containsKey(year)) map.put(year, new HashMap<>());
            HashMap<String, Object> currMonthInfo = new HashMap<>();
            currMonthInfo.put("numVehiclesSold", numVehicleSold);
            currMonthInfo.put("totalSalesIncome", totalSalesIncome);
            currMonthInfo.put("totalNetIncome", totalNetIncome);
            currMonthInfo.put("incomeRatio", incomeRatio);
            map.get(year).put(month, currMonthInfo);
        }
        return map;
    }

    private Map<String, Map<String, Object>> convertMonthlySalesIndividual(List<Map<String, Object>> res) {
        Map<String, Map<String, Object>> map = new HashMap<>();
        for (Map<String, Object> row : res) {
            String name = (String) row.get("salesperson_name");
            Object numVehiclesSold = row.get("num_of_vehicles_sold");
            Object totalSalesIncome = row.get("total_sales_income");
            Map<String, Object> key_value = new HashMap<>();
            key_value.put("numVehiclesSold", numVehiclesSold);
            key_value.put("totalSalesIncome", totalSalesIncome);
            map.put(name, key_value);
        }
        return map;
    }
}
