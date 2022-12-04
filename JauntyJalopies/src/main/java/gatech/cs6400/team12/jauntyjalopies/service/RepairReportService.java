package gatech.cs6400.team12.jauntyjalopies.service;

import gatech.cs6400.team12.jauntyjalopies.common.R;

public interface RepairReportService {
    R generalReport();
    R detailedReport(String manufacturer);
}
