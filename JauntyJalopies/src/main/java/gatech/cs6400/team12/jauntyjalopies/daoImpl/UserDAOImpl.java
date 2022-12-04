package gatech.cs6400.team12.jauntyjalopies.daoImpl;

import gatech.cs6400.team12.jauntyjalopies.POJO.LoginUser;
import gatech.cs6400.team12.jauntyjalopies.dao.UserDAO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.ResultSetExtractor;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Types;
import java.util.List;
import java.util.Map;

@Repository
public class UserDAOImpl implements UserDAO {
    @Autowired
    JdbcTemplate jdbcTemplate;

    @Override
    public LoginUser authenticate(String username, String password) {
        String sql = "SELECT * FROM LoginUser WHERE username = ? AND password = ?";
        LoginUser loginUser = jdbcTemplate.query(sql, new ResultSetExtractor<LoginUser>() {
            @Override
            public LoginUser extractData(ResultSet rs) throws SQLException, DataAccessException {
                LoginUser loginUser1 = null;
                if (rs.next()) {
                    loginUser1 = new LoginUser();
                    loginUser1.setUsername(rs.getString("username"));
                    loginUser1.setPassword(rs.getString("password"));
                    loginUser1.setFirstName(rs.getString("first_name"));
                    loginUser1.setLastName(rs.getString("last_name"));
                }
                return loginUser1;
            }
        }, username, password);
        return loginUser;
    }

    @Override
    public List<Map<String, Object>> authenticateAndJob(String username, String password) {
        String sql = "SELECT * FROM\n" +
                "(\n" +
                "SELECT LoginUser.username, password, JobSearch.job\n" +
                "FROM (\n" +
                "LoginUser\n" +
                "LEFT JOIN (\n" +
                "SELECT username, 'Salesperson' AS job\n" +
                "FROM Salesperson\n" +
                "UNION\n" +
                "SELECT username, 'ServiceWriter' AS job\n" +
                "FROM ServiceWriter\n" +
                "UNION\n" +
                "SELECT username, 'Manager' AS job\n" +
                "FROM Manager\n" +
                "UNION\n" +
                "SELECT username, 'InventoryClerk' AS job\n" +
                "FROM InventoryClerk\n" +
                "UNION\n" +
                "SELECT username, 'Owner' AS job\n" +
                "FROM Owner\n" +
                ") AS JobSearch\n" +
                "ON LoginUser.username = JobSearch.username\n" +
                ")\n" +
                ") AS FullUserInfo\n" +
                "WHERE FullUserInfo.username = ? AND FullUserInfo.password = ?";
        String[] args = {username, password};
        int[] argTypes = {Types.VARCHAR, Types.VARCHAR};
        return jdbcTemplate.queryForList(sql, args, argTypes);
    }
}
