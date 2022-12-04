package gatech.cs6400.team12.jauntyjalopies.daoImpl;

import gatech.cs6400.team12.jauntyjalopies.dao.GrossIncomeDAO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

@Repository
public class GrossIncomeDAOImpl implements GrossIncomeDAO {
    @Autowired
    JdbcTemplate jdbcTemplate;

    @Override
    public List<Map<String, Object>> getGrossIncomeReport() {
        String sql = "SELECT temp.customerID\n" +
                "     , temp.customer_name\n" +
                "     , temp.first_sale_or_repair_date\n" +
                "     , temp.last_sale_or_repair_date\n" +
                "     , IFNULL(temp.num_of_sales, 0)   AS num_of_sales\n" +
                "     , IFNULL(temp.num_of_repairs, 0) AS num_of_repairs\n" +
                "     , IFNULL(temp.gross_income, 0)   AS gross_income\n" +
                "FROM (WITH SaleIncome AS (\n" +
                "    SELECT s.customerID\n" +
                "         , MIN(s.sold_date)  AS first_sale_date\n" +
                "         , MAX(s.sold_date)  AS last_sale_date\n" +
                "         , SUM(s.sold_price) AS sales_income\n" +
                "         , COUNT(s.vin)      AS num_of_sales\n" +
                "    FROM Sale s\n" +
                "    GROUP BY s.customerID\n" +
                ")\n" +
                "         , RepairIncome AS (\n" +
                "        SELECT customerID,\n" +
                "       COUNT(customerID)  AS num_of_repairs,\n" +
                "       SUM(repair_income) AS repair_income,\n" +
                "       MIN(start_date)    AS first_repair_date\n" +
                "     , MAX(start_date) AS last_repair_date\n" +
                "FROM (\n" +
                "         SELECT customerID,\n" +
                "                r.start_date,\n" +
                "                SUM(r.labor_charge + ifnull(price * quantity, 0)) AS repair_income\n" +
                "         FROM (Repair r\n" +
                "                  LEFT JOIN Part p ON r.vin = p.vin AND r.start_date = p.start_date)\n" +
                "         GROUP BY r.vin, r.start_date\n" +
                "     ) AS repair_income_table\n" +
                "GROUP BY customerID\n" +
                "    )\n" +
                "         , CustName AS (\n" +
                "        SELECT ic.customerID, CONCAT(ic.first_name, ' ', ic.last_name) AS customer_name\n" +
                "        FROM Individual ic\n" +
                "        union\n" +
                "        SELECT bc.customerID, bc.business_name as customer_name\n" +
                "        FROM Business bc)\n" +
                "      SELECT CustName.customerID\n" +
                "           , CustName.customer_name\n" +
                "           , MIN(income.fd)                   AS first_sale_or_repair_date\n" +
                "           , MAX(income.ld)                   AS last_sale_or_repair_date\n" +
                "           , MAX(SaleIncome.num_of_sales)     AS num_of_sales\n" +
                "           , MAX(RepairIncome.num_of_repairs) AS num_of_repairs\n" +
                "           , SUM(income.gross_income)         AS gross_income\n" +
                "      FROM (SELECT s.customerID, s.sales_income AS gross_income, s.first_sale_date AS fd, s.last_sale_date AS ld\n" +
                "            FROM SaleIncome s\n" +
                "            UNION\n" +
                "            SELECT r.customerID, r.repair_income, r.first_repair_date, r.last_repair_date\n" +
                "            FROM RepairIncome r) AS income\n" +
                "               LEFT JOIN SaleIncome ON income.customerID = SaleIncome.customerID\n" +
                "               LEFT JOIN RepairIncome ON income.customerID = RepairIncome.customerID\n" +
                "               INNER JOIN CustName ON CustName.customerID = income.customerID\n" +
                "      GROUP BY CustName.customer_name, CustName.customerID\n" +
                "      ORDER BY gross_income DESC\n" +
                "      LIMIT 15\n" +
                "     ) temp\n" +
                "ORDER BY temp.gross_income DESC, temp.last_sale_or_repair_date DESC;";
        return jdbcTemplate.queryForList(sql);
    }

    @Override
    public List<Map<String, Object>> saleHistoryBuCustomerID(Integer customerID) {
        String sql = "SELECT\n" +
                "s.sold_date AS sale_date\n" +
                ", s.sold_price\n" +
                ", s.vin\n" +
                ", YEAR(v.model_year) AS `year`\n" +
                ", m.manufacturer_name AS `manufacturer`,\n" +
                "       v.model_name AS model_name\n" +
                ", CONCAT(uu.first_name, ' ', uu.last_name) AS salesperson_name\n" +
                "FROM Sale s\n" +
                "INNER JOIN Vehicle v ON s.vin = v.vin\n" +
                "INNER JOIN Manufacturer m ON v.manufacturer_name = m.manufacturer_name INNER JOIN Salesperson sp ON s.salesperson_username = sp.username\n" +
                "INNER JOIN LoginUser uu ON sp.username = uu.username\n" +
                "WHERE s.customerID = ?\n" +
                " ORDER BY sold_date DESC, v.vin ASC";
        Object[] args = {customerID};
        return jdbcTemplate.queryForList(sql, args);
    }

    @Override
    public List<Map<String, Object>> repairHistoryByCustomerID(Integer customerID) {
        String sql = "SELECT\n" +
                "r.start_date\n" +
                ", r.complete_date AS end_date\n" +
                ", r.vin\n" +
                ", r.odometer_reading AS odometer_reading\n" +
                ", SUM(ifnull(p.price * p.quantity, 0)) AS parts_cost\n" +
                ", SUM(r.labor_charge) AS labor_cost\n" +
                ", SUM(r.labor_charge + ifnull(p.price * p.quantity, 0)) AS total_cost\n" +
                ", CONCAT(uu.first_name, ' ', uu.last_name) AS servicewriter_name FROM `Repair` r\n" +
                "LEFT JOIN Part p on r.vin = p.vin AND r.start_date = p.start_date\n" +
                "INNER JOIN ServiceWriter sw ON r.servicewriter_username = sw.username INNER JOIN LoginUser uu ON sw.username = uu.username\n" +
                "WHERE r.customerID = ?\n" +
                "GROUP BY r.vin, r.start_date, r.complete_date\n" +
                "ORDER BY r.start_date DESC, r.complete_date DESC, r.vin ASC";
        Object[] args = {customerID};
        return jdbcTemplate.queryForList(sql, args);
    }
}
