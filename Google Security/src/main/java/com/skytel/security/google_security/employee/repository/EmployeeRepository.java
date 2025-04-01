package com.skytel.security.google_security.employee.repository;

import com.skytel.security.google_security.employee.model.Employee;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface EmployeeRepository extends JpaRepository<Employee, String> {

  Optional<Employee> findByEmail(String email);

}
