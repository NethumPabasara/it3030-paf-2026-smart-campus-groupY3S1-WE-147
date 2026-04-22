package com.smartcampus.backend.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HomeController {

    @GetMapping("/")
    public String home() {
        return "Smart Campus Backend Running!";
    }

    @GetMapping("/login-success")
    public String loginSuccess() {
        return "Login successful!";
    }
}