package gatech.cs6400.team12.jauntyjalopies.controller;

import gatech.cs6400.team12.jauntyjalopies.common.R;
import gatech.cs6400.team12.jauntyjalopies.service.GrossIncomeReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class GrossIncomeReportController {
    @Autowired
    GrossIncomeReportService grossIncomeReportService;

    @GetMapping("/api/report/grossincome")
    public R getGrossIncomeReport() {
        return grossIncomeReportService.getGrossIncomeReport();
    }

    @GetMapping("/api/report/grossincome/sale")
    public R getSaleHistoryByCustomerID(@RequestParam Integer customerID) {
        return grossIncomeReportService.viewSaleHistoryByCustomerID(customerID);
    }

    @GetMapping("/api/report/grossincome/repair")
    public R getRepairHistoryByCustomerID(@RequestParam Integer customerID) {
        return grossIncomeReportService.viewRepairHistoryByCustomerID(customerID);
    }
}
