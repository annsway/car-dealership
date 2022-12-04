package gatech.cs6400.team12.jauntyjalopies.service;

import gatech.cs6400.team12.jauntyjalopies.common.R;

public interface UserService {
    R authenticate(String username, String password);

    R authenticateJob(String username, String password);
}
