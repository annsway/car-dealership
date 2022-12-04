package gatech.cs6400.team12.jauntyjalopies.dao;

import gatech.cs6400.team12.jauntyjalopies.POJO.LoginUser;

import java.util.List;
import java.util.Map;

public interface UserDAO {
    LoginUser authenticate(String username, String password);

    List<Map<String, Object>> authenticateAndJob(String username, String password);
}
