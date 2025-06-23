package com.zidio.controller;

import com.zidio.dto.LoginRequest;
import com.zidio.dto.RegisterRequest;
import com.zidio.entity.User;
import com.zidio.service.JwtService;
import com.zidio.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Collections;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserService userService;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;

    public AuthController(UserService userService, JwtService jwtService, PasswordEncoder passwordEncoder, AuthenticationManager authenticationManager) {
        this.userService = userService;
        this.jwtService = jwtService;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
    }

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody RegisterRequest request) {
        if (userService.getUserByEmail(request.email()) != null) {
            return ResponseEntity.status(400).body("Email already registered");
        }
        User user = new User();
        user.setEmail(request.email());
        user.setPassword(passwordEncoder.encode(request.password()));
        user.setRole(request.role()); // Store the selected role
        user.setName(request.name());
        userService.saveUser(user);
        return ResponseEntity.ok("User registered successfully");
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> login(@RequestBody LoginRequest request) {
        System.out.println("Attempting login for email: " + request.email() + ", password: " + request.password());
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.email(), request.password()));
        if (authentication.isAuthenticated()) {
            System.out.println("Authentication successful for: " + request.email());
            String token = jwtService.generateToken(request.email(), userService.getUserByEmail(request.email()).getRole());
            Map<String, String> response = new HashMap<>();
            response.put("token", token);
            return ResponseEntity.ok(response);
        }
        System.out.println("Authentication failed for: " + request.email());
        return ResponseEntity.status(401).body(Collections.singletonMap("error", "Invalid credentials"));
    }

    @GetMapping("/validate")
    public ResponseEntity<String> validate(@RequestParam String token) {
        UserDetails userDetails = userService.loadUserByUsername(jwtService.extractEmail(token));
        boolean isValid = jwtService.validateToken(token, userDetails);
        return isValid ? ResponseEntity.ok("Valid Token") : ResponseEntity.status(401).body("Invalid Token");
    }
}