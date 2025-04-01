package com.skytel.security.google_security.auth.service;


import com.skytel.security.google_security.auth.request.RegisterRequest;
import com.skytel.security.google_security.auth.request.VerificationRequest;
import com.skytel.security.google_security.auth.request.AuthenticationRequest;
import com.skytel.security.google_security.auth.response.AuthenticationResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;

public interface AuthenticationService {
    AuthenticationResponse register(RegisterRequest request);

    AuthenticationResponse authenticate(AuthenticationRequest request);

    void refreshToken(HttpServletRequest request, HttpServletResponse response) throws IOException;

    AuthenticationResponse verifyCode(VerificationRequest verificationRequest);
}
