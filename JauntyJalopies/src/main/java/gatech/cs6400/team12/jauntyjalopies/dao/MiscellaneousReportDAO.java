package gatech.cs6400.team12.jauntyjalopies.dao;

import java.util.List;
import java.util.Map;

public interface MiscellaneousReportDAO {
    List<Map<String, Object>> averageTimeReport();
    List<Map<String, Object>> partStatistics();
    List<Map<String, Object>> monthlySalesGeneral();
    List<Map<String, Object>> monthLySalesIndividual(Integer month, Integer year);
    List<Map<String, Object>> belowCostSales();
}
