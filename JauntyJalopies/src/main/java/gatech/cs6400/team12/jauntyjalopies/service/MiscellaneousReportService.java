package gatech.cs6400.team12.jauntyjalopies.service;

import gatech.cs6400.team12.jauntyjalopies.common.R;

public interface MiscellaneousReportService {
    R getAverageTimeInInventory();
    R getPartStatistics();
    R getMonthlySaleGeneral();
    R getMonthlySaleIndividual(Integer year, Integer month);
    R getBelowCostSales();
}
