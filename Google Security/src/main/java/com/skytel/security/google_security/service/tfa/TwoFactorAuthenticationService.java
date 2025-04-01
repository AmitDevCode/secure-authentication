package com.skytel.security.google_security.service.tfa;

public interface TwoFactorAuthenticationService {
    String generateNewSecret();
    String generateQrCodeImageUri(String secret);
    boolean isOtpValid(String secret, String code);
    boolean isOtpNotValid(String secret, String code);
}

