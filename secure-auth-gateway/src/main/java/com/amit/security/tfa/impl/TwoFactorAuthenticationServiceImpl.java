package com.amit.security.tfa.impl;

import com.amit.security.tfa.TwoFactorAuthenticationService;
import dev.samstevens.totp.code.*;
import dev.samstevens.totp.exceptions.QrGenerationException;
import dev.samstevens.totp.qr.QrData;
import dev.samstevens.totp.qr.QrGenerator;
import dev.samstevens.totp.qr.ZxingPngQrGenerator;
import dev.samstevens.totp.secret.DefaultSecretGenerator;
import dev.samstevens.totp.time.SystemTimeProvider;
import dev.samstevens.totp.time.TimeProvider;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;



@Service
@RequiredArgsConstructor
public class TwoFactorAuthenticationServiceImpl implements TwoFactorAuthenticationService {
    private static final Logger log = LoggerFactory.getLogger(TwoFactorAuthenticationServiceImpl.class);

    @Override
    public String generateNewSecret() {
        return new DefaultSecretGenerator().generate();
    }

    @Override
    public String generateQrCodeImageUri(String secret) {
        QrData data = new QrData.Builder()
                .label("Amit Coding 2FA example")
                .secret(secret)
                .issuer("Amit-Coding")
                .algorithm(HashingAlgorithm.SHA1)
                .digits(6)
                .period(30)
                .build();

        QrGenerator generator = new ZxingPngQrGenerator();
        byte[] imageData = new byte[0];
        try {
            imageData = generator.generate(data);
        } catch (QrGenerationException e) {
            log.warn(e.getMessage());
            log.error("Error while generating QR-CODE", e);
        }

        return getDataUriForImage(imageData, generator.getImageMimeType());
    }

    @Override
    public boolean isOtpValid(String secret, String code) {
        TimeProvider timeProvider = new SystemTimeProvider();
        CodeGenerator codeGenerator = new DefaultCodeGenerator();
        CodeVerifier verifier = new DefaultCodeVerifier(codeGenerator, timeProvider);
        return verifier.isValidCode(secret, code);
    }

    @Override
    public boolean isOtpNotValid(String secret, String code) {
        return !this.isOtpValid(secret, code);
    }

    private String getDataUriForImage(byte[] imageData, String mimeType) {
        return "data:" + mimeType + ";base64," + java.util.Base64.getEncoder().encodeToString(imageData);
    }
}
