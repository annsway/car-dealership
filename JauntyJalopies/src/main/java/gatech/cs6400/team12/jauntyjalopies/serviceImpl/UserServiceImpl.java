package gatech.cs6400.team12.jauntyjalopies.serviceImpl;

import gatech.cs6400.team12.jauntyjalopies.POJO.LoginUser;
import gatech.cs6400.team12.jauntyjalopies.common.ErrorCode;
import gatech.cs6400.team12.jauntyjalopies.common.R;
import gatech.cs6400.team12.jauntyjalopies.dao.UserDAO;
import gatech.cs6400.team12.jauntyjalopies.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class UserServiceImpl implements UserService {
    @Autowired
    UserDAO userDAO;

    @Override
    public R authenticate(String username, String password) {
        LoginUser loginUser = userDAO.authenticate(username, password);
        return loginUser == null ? R.error("Username or password invalid!") : R.ok().put("userInfo", loginUser);
    }

    @Override
    public R authenticateJob(String username, String password) {
        List<Map<String, Object>> userJob = userDAO.authenticateAndJob(username, password);
        if (userJob.isEmpty()) return R.error(ErrorCode.USER_INVALID_CREDENTIAL.getErrorCode(), "Invalid username or password!");
        if (userJob.size() == 1) return R.ok().put("userInfo", userJob.get(0));
        String ownerUsername = (String) userJob.get(0).get("username");
        String ownerPassword = (String) userJob.get(0).get("password");
        String role = "Owner";
        Map<String, Object> ownerMap = new HashMap<>();
        ownerMap.put("username", ownerUsername);
        ownerMap.put("password", ownerPassword);
        ownerMap.put("job", role);
        return R.ok().put("userInfo", ownerMap);
    }
}
