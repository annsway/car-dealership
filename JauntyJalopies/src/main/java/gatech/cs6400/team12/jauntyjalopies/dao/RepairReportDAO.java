package gatech.cs6400.team12.jauntyjalopies.dao;

import java.util.List;
import java.util.Map;

public interface RepairReportDAO {
    List<Map<String, Object>> generalInfo();
    List<Map<String, Object>> reportByType(String manufacturer);
    List<Map<String, Object>> reportByModel(String manufacturer);
}
