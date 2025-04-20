package com.amit.security.auth.service.impl;

import com.amit.security.auth.request.AuthenticationRequest;
import com.amit.security.auth.request.RegisterRequest;
import com.amit.security.auth.request.VerificationRequest;
import com.amit.security.auth.response.AuthenticationResponse;
import com.amit.security.auth.service.AuthenticationService;
import com.amit.security.config.JwtService;
import com.amit.security.employee.model.User;
import com.amit.security.employee.repository.UserRepository;
import com.amit.security.events.UserActivityEvent;
import com.amit.security.tfa.TwoFactorAuthenticationService;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.EntityNotFoundException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.io.IOException;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthenticationServiceImpl implements AuthenticationService {
    private final UserRepository repository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final TwoFactorAuthenticationService tfaService;
    private final ApplicationEventPublisher eventPublisher;


    @Override
    public AuthenticationResponse register(RegisterRequest request) {
        var user = User.builder().firstname(request.getFirstname()).lastname(request.getLastname()).email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword())).role(request.getRole()).mfaEnabled(request.isMfaEnabled()).build();

        // if MFA enabled --> Generate Secret
        if (request.isMfaEnabled()) user.setSecret(tfaService.generateNewSecret());

        var updatedUser = repository.save(user);
        var jwtToken = jwtService.generateToken(updatedUser);
        var refreshToken = jwtService.generateRefreshToken(updatedUser);

        return AuthenticationResponse.builder().secretImageUri(tfaService.generateQrCodeImageUri(updatedUser.getSecret())).accessToken(jwtToken)
                .refreshToken(refreshToken).mfaEnabled(user.isMfaEnabled()).build();
    }

    @Override
    public AuthenticationResponse authenticate(AuthenticationRequest request) {
        System.out.println("Authenticating request from service: " + request);
        Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));
        System.out.println("IsAuthenticated : " + authentication.isAuthenticated());

        var user = repository.findByEmail(request.getEmail()).orElseThrow();
        if (user.isMfaEnabled()) return AuthenticationResponse.builder().accessToken("").refreshToken("").mfaEnabled(true).build();
        var jwtToken = jwtService.generateToken(user);
        var refreshToken = jwtService.generateRefreshToken(user);

        if (authentication.isAuthenticated()) eventPublisher.publishEvent(new UserActivityEvent(this, request.getEmail(), "LOGIN", "User logged in successfully"));
        return AuthenticationResponse.builder().accessToken(jwtToken).refreshToken(refreshToken).mfaEnabled(false).build();
    }

    @Override
    public void refreshToken(HttpServletRequest request, HttpServletResponse response) throws IOException {
        final String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);
        final String refreshToken;
        final String userEmail;
        if (authHeader == null || !authHeader.startsWith("Bearer ")) return;

        refreshToken = authHeader.substring(7);
        userEmail = jwtService.extractUsername(refreshToken);
        if (userEmail != null) {
            var user = this.repository.findByEmail(userEmail).orElseThrow();
            if (jwtService.isTokenValid(refreshToken, user)) {
                var accessToken = jwtService.generateToken(user);
                var authResponse = AuthenticationResponse.builder().accessToken(accessToken).refreshToken(refreshToken).mfaEnabled(false).build();
                new ObjectMapper().writeValue(response.getOutputStream(), authResponse);
            }
        }
    }

    @Override
    public AuthenticationResponse verifyCode(VerificationRequest verificationRequest) {
        var user = repository.findByEmail(verificationRequest.getEmail())
                .orElseThrow(() -> new EntityNotFoundException(String.format("No user found with %s", verificationRequest.getEmail())));
        if (tfaService.isOtpNotValid(user.getSecret(), verificationRequest.getCode())) throw new BadCredentialsException("Code is not correct");

        var jwtToken = jwtService.generateToken(user);

        eventPublisher.publishEvent(new UserActivityEvent(this, verificationRequest.getEmail(), "LOGIN", "User logged in successfully"));
        return AuthenticationResponse.builder().accessToken(jwtToken).mfaEnabled(user.isMfaEnabled()).build();
    }
}
