package com.skytel.security.google_security.employee.service.impl;

import com.skytel.security.google_security.auth.request.RegisterRequest;
import com.skytel.security.google_security.constants.Role;
import com.skytel.security.google_security.employee.model.Employee;
import com.skytel.security.google_security.employee.repository.EmployeeRepository;
import com.skytel.security.google_security.employee.service.EmployeeService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EmployeeServiceImpl implements EmployeeService {
    private final EmployeeRepository employeeRepository;

    @Override
    public Employee getEmployee(String email) {
        return employeeRepository.findByEmail(email).orElse(null);
    }

    @Override
    public Employee updateEmployee(RegisterRequest request) {
        var employee = employeeRepository.findByEmail(request.getEmail()).orElse(null);
        return employee != null ? employeeRepository.save(request.buildUpdateEmployee(employee)) : null;
    }

    @Override
    public List<Employee> getEmployees() {
        return employeeRepository.findAll().stream().filter(emp -> emp.getRole() != Role.SUPER_ADMIN && emp.getRole() != Role.SYSTEM_ADMIN).collect(Collectors.toList());
    }
}
