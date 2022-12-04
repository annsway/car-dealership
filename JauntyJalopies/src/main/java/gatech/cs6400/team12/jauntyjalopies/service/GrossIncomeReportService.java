package gatech.cs6400.team12.jauntyjalopies.service;

import gatech.cs6400.team12.jauntyjalopies.common.R;

public interface GrossIncomeReportService {
    R getGrossIncomeReport();
    R viewSaleHistoryByCustomerID(Integer customerID);
    R viewRepairHistoryByCustomerID(Integer customerID);
}
