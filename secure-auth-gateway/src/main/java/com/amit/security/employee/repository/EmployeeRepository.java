package com.amit.security.employee.repository;

import com.amit.security.employee.model.Employee;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;


public interface EmployeeRepository extends JpaRepository<Employee, String> {

  Optional<Employee> findByEmail(String email);

}
