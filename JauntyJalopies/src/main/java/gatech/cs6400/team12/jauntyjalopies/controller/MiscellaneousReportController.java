package gatech.cs6400.team12.jauntyjalopies.controller;

import gatech.cs6400.team12.jauntyjalopies.common.R;
import gatech.cs6400.team12.jauntyjalopies.service.MiscellaneousReportService;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
public class MiscellaneousReportController {
    @Autowired
    MiscellaneousReportService miscellaneousReportService;

    @PostMapping("/api/report/averagetime")
    public R getAverageTimeInInventory() {
        return miscellaneousReportService.getAverageTimeInInventory();
    }

    @PostMapping("/api/report/partstatistics")
    public R getPartStatistics() {
        return miscellaneousReportService.getPartStatistics();
    }

    @PostMapping("/api/report/monthlysales")
    public R getMonthlySalesGeneral() {
        return miscellaneousReportService.getMonthlySaleGeneral();
    }

    @PostMapping("/api/report/monthlysales/individual")
    public R getMonthlySalesIndividual(@RequestBody Map<String, String> MonthlySalesIndividualForm) {
    	String year_str = MonthlySalesIndividualForm.get("year");
    	String month_str  = MonthlySalesIndividualForm.get("month");
    	
    	System.out.print(year_str);
    	Integer year = Integer.parseInt(year_str);
    	Integer month = Integer.parseInt(month_str);
        return miscellaneousReportService.getMonthlySaleIndividual(year, month);
    }

    @PostMapping("/api/report/belowcostsales")
    public R getBelowCostSales() {
        return miscellaneousReportService.getBelowCostSales();
    }

}
