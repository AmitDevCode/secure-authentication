package com.amit.security.employee.service.impl;

import com.amit.security.auth.request.RegisterRequest;
import com.amit.security.constants.Role;
import com.amit.security.employee.model.User;
import com.amit.security.employee.repository.UserRepository;
import com.amit.security.employee.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;


@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;

    @Override
    public User getUser(String email) {
        return userRepository.findByEmail(email).orElse(null);
    }

    @Override
    public User updateUser(RegisterRequest request) {
        var employee = userRepository.findByEmail(request.getEmail()).orElse(null);
        return employee != null ? userRepository.save(request.buildUpdateEmployee(employee)) : null;
    }

    @Override
    public List<User> getUsers() {
        return userRepository.findAll().stream().filter(emp -> emp.getRole() != Role.SUPER_ADMIN && emp.getRole() != Role.SYSTEM_ADMIN).collect(Collectors.toList());
    }
}
