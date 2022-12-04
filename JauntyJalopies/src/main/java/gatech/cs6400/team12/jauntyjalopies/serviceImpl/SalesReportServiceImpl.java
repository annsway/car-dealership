package gatech.cs6400.team12.jauntyjalopies.serviceImpl;

import gatech.cs6400.team12.jauntyjalopies.common.R;
import gatech.cs6400.team12.jauntyjalopies.dao.SalesReportDAO;
import gatech.cs6400.team12.jauntyjalopies.service.SalesReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;

@Service
public class SalesReportServiceImpl implements SalesReportService {
    @Autowired
    SalesReportDAO reportDAO;

    @Override
    public R salesByColor() {
        List<Map<String, Object>> salesByColor30Days = reportDAO.salesByColor30Day();
        List<Map<String, Object>> salesByColorLastYear = reportDAO.salesByColorLastYear();
        List<Map<String, Object>> salesByColorAll = reportDAO.salesByColorAll();
        Map<String, Map<String, Object>> reports = new HashMap<>();
        reports.put("30days", colorConvert(salesByColor30Days));
        reports.put("lastYear", colorConvert(salesByColorLastYear));
        reports.put("allTime", colorConvert(salesByColorAll));
        return R.ok().put("reports", reports);
    }

    @Override
    public R salesByType() {
        List<Map<String, Object>> salesByType30Days = reportDAO.salesByType30Day();
        List<Map<String, Object>> salesByTypeLastYear = reportDAO.salesByTypeLastYear();
        List<Map<String, Object>> salesByTypeAll = reportDAO.salesByTypeAll();
        Map<String, Map<String, Object>> reports = new HashMap<>();
        reports.put("30days", typeConvert(salesByType30Days));
        reports.put("lastYear", typeConvert(salesByTypeLastYear));
        reports.put("allTime", typeConvert(salesByTypeAll));
        return R.ok().put("reports", reports);
    }

    @Override
    public R salesByManufacturer() {
        List<Map<String, Object>> salesByManufacturer30Days = reportDAO.salesByManufacturer30Day();
        List<Map<String, Object>> salesByManufacturerLastYear = reportDAO.salesByManufacturerLastYear();
        List<Map<String, Object>> salesByManufacturerAll =  reportDAO.salesByManufacturerAll();
        Map<String, Map<String, Object>> reports = new HashMap<>();
        reports.put("30days", manufacturerConvert(salesByManufacturer30Days));
        reports.put("lastYear", manufacturerConvert(salesByManufacturerLastYear));
        reports.put("allTime", manufacturerConvert(salesByManufacturerAll));
        return R.ok().put("reports", reports);
    }

    private Map<String, Object> colorConvert(List<Map<String, Object>> list) {
        Map<String, Object> map = new TreeMap<>();
        for (Map<String, Object> row : list) {
            Object color = row.get("color");
            Object number = row.get("num_of_vehicles_sold");
            map.put((String) color, number);
        }
        return map;
    }

    private Map<String, Object> typeConvert(List<Map<String, Object>> list) {
        Map<String, Object> map = new TreeMap<>();
        for (Map<String, Object> row : list) {
            Object color = row.get("vehicle_type");
            Object number = row.get("num_of_vehicles_sold");
            map.put((String) color, number);
        }
        return map;
    }

    private Map<String, Object> manufacturerConvert(List<Map<String, Object>> list) {
        Map<String, Object> map = new TreeMap<>();
        for (Map<String, Object> row : list) {
            Object color = row.get("manufacturer_name");
            Object number = row.get("num_of_vehicles_sold");
            map.put((String) color, number);
        }
        return map;
    }
}
