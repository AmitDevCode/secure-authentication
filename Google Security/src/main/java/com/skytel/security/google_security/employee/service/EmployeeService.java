package com.skytel.security.google_security.employee.service;

import com.skytel.security.google_security.auth.request.RegisterRequest;
import com.skytel.security.google_security.employee.model.Employee;

import java.util.List;

public interface EmployeeService {
    Employee getEmployee(String email);

    Employee updateEmployee(RegisterRequest request);

    List<Employee> getEmployees();
}
