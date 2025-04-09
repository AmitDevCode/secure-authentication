package com.amit.security.employee.service.impl;

import com.amit.security.auth.request.RegisterRequest;
import com.amit.security.constants.Role;
import com.amit.security.employee.model.Employee;
import com.amit.security.employee.repository.EmployeeRepository;
import com.amit.security.employee.service.EmployeeService;
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
