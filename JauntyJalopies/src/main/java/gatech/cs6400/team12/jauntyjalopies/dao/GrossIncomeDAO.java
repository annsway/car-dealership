package gatech.cs6400.team12.jauntyjalopies.dao;

import java.util.List;
import java.util.Map;

public interface GrossIncomeDAO {
    List<Map<String, Object>> getGrossIncomeReport();
    List<Map<String, Object>> saleHistoryBuCustomerID(Integer customerID);
    List<Map<String, Object>> repairHistoryByCustomerID(Integer customerID);
}
