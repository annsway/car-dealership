package gatech.cs6400.team12.jauntyjalopies.serviceImpl;

import gatech.cs6400.team12.jauntyjalopies.common.ErrorCode;
import gatech.cs6400.team12.jauntyjalopies.common.R;
import gatech.cs6400.team12.jauntyjalopies.dao.RepairReportDAO;
import gatech.cs6400.team12.jauntyjalopies.service.RepairReportService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class RepairReportServiceImpl implements RepairReportService {
    @Autowired
    RepairReportDAO reportDAO;

    private Logger logger = LoggerFactory.getLogger(RepairReportService.class);

    @Override
    public R generalReport() {
        List<Map<String, Object>> prelimGeneralReport = reportDAO.generalInfo();
        Map<String, Map<String, Object>> res = convertByBrand(prelimGeneralReport);
        return R.ok().put("reports", res);
    }

    @Override
    public R detailedReport(String manufacturer) {
        try {
            List<Map<String, Object>> reportByType = reportDAO.reportByType(manufacturer);
            List<Map<String, Object>> reportByModel = reportDAO.reportByModel(manufacturer);
            TreeMap<String, Map<String, Object>> res = merge(reportByType, reportByModel);
            return R.ok().put("details", res);
        } catch (DataAccessException e) {
            String causeMessage = e.getCause().getMessage();
            logger.error(causeMessage);
            return R.error(ErrorCode.INVALID_MANUFACTURER.getErrorCode(), causeMessage);
        }
    }

    private Map<String, Map<String, Object>> convertByBrand(List<Map<String, Object>> prelimGeneralReport) {
        TreeMap<String, Map<String, Object>> map = new TreeMap<>();
        for (Map<String, Object> row : prelimGeneralReport) {
            String manufacturerName = (String) row.get("manufacturer_name");
            Object countRepairs = row.get("count_of_repairs");
            Object partCost = row.get("parts_cost");
            Object laborCost = row.get("labor_cost");
            Object totalRepairCost = row.get("total_repair_cost");
            Object countIncompleteRepairs = row.get("count_of_incomplete_repairs");
            Map<String, Object> key_value = new HashMap<>();
            key_value.put("countRepairs", countRepairs);
            key_value.put("partCost", partCost);
            key_value.put("laborCost", laborCost);
            key_value.put("totalRepairCost", totalRepairCost);
            key_value.put("countIncompleteRepairs", countIncompleteRepairs);
            map.put(manufacturerName, key_value);
        }
        return map;
    }

    private TreeMap<String, Map<String, Object>> merge(List<Map<String, Object>> reportByType, List<Map<String, Object>> reportByModel) {
        TreeMap<String, Map<String, Object>> map = new TreeMap<>();
        for (Map<String, Object> row : reportByType) {
            String type = (String) row.get("type");
            Object countRepairs = row.get("count_of_repairs");
            Object partCost = row.get("parts_cost");
            Object laborCost = row.get("labor_cost");
            Object totalRepairCost = row.get("total_repair_cost");
            Map<String, Object> key_value = new HashMap<>();
            key_value.put("countRepairs", countRepairs);
            key_value.put("partCost", partCost);
            key_value.put("laborCost", laborCost);
            key_value.put("totalRepairCost", totalRepairCost);
            map.put(type, key_value);
        }
        for (Map<String, Object> row : reportByModel) {
            String typeModel = (String) row.get("model");
            int hyphenIndex = typeModel.indexOf("-");
            String type = typeModel.substring(0, hyphenIndex);
            String model = typeModel.substring(hyphenIndex + 1);
            Object countRepairs = row.get("count_of_repairs");
            Object partCost = row.get("parts_cost");
            Object laborCost = row.get("labor_cost");
            Object totalRepairCost = row.get("total_repair_cost");
            Map<String, Object> currentModelInfo = new HashMap<>();
            currentModelInfo.put("countRepairs", countRepairs);
            currentModelInfo.put("partCost", partCost);
            currentModelInfo.put("laborCost", laborCost);
            currentModelInfo.put("totalRepairCost", totalRepairCost);
            if (!map.get(type).containsKey("models")) map.get(type).put("models", new HashMap<>());
            HashMap<String, Object> currModel = (HashMap<String, Object>) map.get(type).get("models");
            currModel.put(model, currentModelInfo);
        }
        return map;
    }
}
