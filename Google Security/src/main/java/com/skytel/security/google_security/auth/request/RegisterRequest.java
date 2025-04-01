package com.skytel.security.google_security.auth.request;

import com.skytel.security.google_security.constants.Department;
import com.skytel.security.google_security.constants.Role;
import com.skytel.security.google_security.employee.model.Employee;
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

  @NotNull(message = "Department can not be empty !!")
  private Department department;

  private boolean mfaEnabled;


  public Employee buildUpdateEmployee(Employee employee) {
      employee.setFirstname(firstname);
      employee.setLastname(lastname);
      employee.setEmail(email);
      employee.setPassword(password);
      employee.setRole(role);
      employee.setDepartment(department);
      employee.setMfaEnabled(mfaEnabled);
      return employee;
  }
}
