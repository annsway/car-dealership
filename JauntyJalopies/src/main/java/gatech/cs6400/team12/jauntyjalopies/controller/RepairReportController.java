package gatech.cs6400.team12.jauntyjalopies.controller;

import gatech.cs6400.team12.jauntyjalopies.common.R;
import gatech.cs6400.team12.jauntyjalopies.service.RepairReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class RepairReportController {
    @Autowired
    RepairReportService reportService;

    @GetMapping("/api/report/repair/general")
    public R getGeneralRepairReport() {
        return reportService.generalReport();
    }

    @GetMapping("api/report/repair/detail")
    public R getDetailedReport(@RequestParam String manufacturer) {
        return reportService.detailedReport(manufacturer);
    }
}
