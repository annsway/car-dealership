package gatech.cs6400.team12.jauntyjalopies.controller;

import gatech.cs6400.team12.jauntyjalopies.common.R;
import gatech.cs6400.team12.jauntyjalopies.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
public class UserController {
    @Autowired
    UserService userService;

    @GetMapping("/login")
    public R authenticateUser(@RequestParam String username, @RequestParam String password) {
        return userService.authenticate(username, password);
    }

    @PostMapping("/api/login")
    public R authenticateUserJob(@RequestBody Map<String, String> loginForm) {
        String username = loginForm.get("username");
        String password = loginForm.get("password");
        return userService.authenticateJob(username, password);
    }
}
