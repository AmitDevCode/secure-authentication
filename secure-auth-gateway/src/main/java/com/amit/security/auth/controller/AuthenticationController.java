package com.amit.security.auth.controller;

import com.amit.security.auth.request.AuthenticationRequest;
import com.amit.security.auth.request.RegisterRequest;
import com.amit.security.auth.request.VerificationRequest;
import com.amit.security.auth.response.AuthenticationResponse;
import com.amit.security.auth.service.AuthenticationService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

@RestController
@RequiredArgsConstructor
@CrossOrigin(value = "*")
@RequestMapping("/api/v1/auth")
public class AuthenticationController {

    private final AuthenticationService service;

    // Here SUPER_ADMIN Can Only Create  Endpoint For All
    @PostMapping("/register")
    public ResponseEntity<Object> register(@RequestBody RegisterRequest request) {
        var response = service.register(request);
        if (request.isMfaEnabled()) return ResponseEntity.ok(response);
        return ResponseEntity.accepted().build();
    }

    // This Auth Endpoint For All
    @PostMapping("/authenticate")
    public ResponseEntity<AuthenticationResponse> authenticate(@RequestBody AuthenticationRequest request) {
        System.out.println("Authenticating request: " + request);
        return ResponseEntity.ok(service.authenticate(request));
    }

    @PostMapping("/refresh-token")
    public void refreshToken(HttpServletRequest request, HttpServletResponse response) throws IOException {
        service.refreshToken(request, response);
    }

    @PostMapping("/verify")
    public ResponseEntity<Object> verifyCode(@RequestBody VerificationRequest verificationRequest) {
        return ResponseEntity.ok(service.verifyCode(verificationRequest));
    }
}
