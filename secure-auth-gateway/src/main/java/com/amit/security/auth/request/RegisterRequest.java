package com.amit.security.auth.request;

import com.amit.security.constants.Role;
import com.amit.security.employee.model.User;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RegisterRequest {

  @NotNull(message = "Firstname can not be empty !!")
  private String firstname;

  @NotNull(message = "Lastname can not be empty !!")
  private String lastname;

  @NotNull(message = "Email can not be empty !!")
  private String email;

  @NotNull(message = "Password can not be empty !!")
  private String password;

  @NotNull(message = "Role can not be empty !!")
  private Role role;

  private boolean mfaEnabled;


  public User buildUpdateEmployee(User user) {
      user.setFirstname(firstname);
      user.setLastname(lastname);
      user.setEmail(email);
      user.setPassword(password);
      user.setRole(role);
      user.setMfaEnabled(mfaEnabled);
      return user;
  }
}
