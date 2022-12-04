package gatech.cs6400.team12.jauntyjalopies.dao;

import java.util.List;
import java.util.Map;

public interface SalesReportDAO {
    List<Map<String, Object>> salesByColor30Day();
    List<Map<String, Object>> salesByColorLastYear();
    List<Map<String, Object>> salesByColorAll();
    List<Map<String, Object>> salesByType30Day();
    List<Map<String, Object>> salesByTypeLastYear();
    List<Map<String, Object>> salesByTypeAll();
    List<Map<String, Object>> salesByManufacturer30Day();
    List<Map<String, Object>> salesByManufacturerLastYear();
    List<Map<String, Object>> salesByManufacturerAll();
}
