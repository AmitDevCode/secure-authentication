package com.amit.security.auth.request;

import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class VerificationRequest {

    @NotNull(message = "Email can not be empty !!")
    private String email;

    @NotNull(message = "Validation code can not be empty !!")
    private String code;
}
