package project.voting.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
public class HomeController {

    @GetMapping("/")
    public Map<String, Object> home() {

        Map<String, Object> response = new HashMap<>();

        response.put("application", "VoteKu API");
        response.put("status", "online");
        response.put("version", "1.0");
        response.put("message", "Backend server is running successfully");

        return response;
    }
}