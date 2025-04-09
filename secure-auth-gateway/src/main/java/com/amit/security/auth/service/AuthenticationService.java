package com.amit.security.auth.service;


import com.amit.security.auth.request.AuthenticationRequest;
import com.amit.security.auth.request.RegisterRequest;
import com.amit.security.auth.request.VerificationRequest;
import com.amit.security.auth.response.AuthenticationResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;

public interface AuthenticationService {
    AuthenticationResponse register(RegisterRequest request);

    AuthenticationResponse authenticate(AuthenticationRequest request);

    void refreshToken(HttpServletRequest request, HttpServletResponse response) throws IOException;

    AuthenticationResponse verifyCode(VerificationRequest verificationRequest);
}
