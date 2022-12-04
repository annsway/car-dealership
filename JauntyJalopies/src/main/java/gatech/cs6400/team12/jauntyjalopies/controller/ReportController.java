package gatech.cs6400.team12.jauntyjalopies.controller;

import gatech.cs6400.team12.jauntyjalopies.common.R;
import gatech.cs6400.team12.jauntyjalopies.service.SalesReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class ReportController {
    @Autowired
    SalesReportService reportService;

    @GetMapping("/api/report/sales/color")
    public R salesByColorReport() {
        return reportService.salesByColor();
    }

    @GetMapping("/api/report/sales/type")
    public R salesByTypeReport() {
        return reportService.salesByType();
    }

    @GetMapping("/api/report/sales/manufacturer")
    public R salesByManufacturerReport() {
        return reportService.salesByManufacturer();
    }
}
