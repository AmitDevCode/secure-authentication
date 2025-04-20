package com.amit.security.employee.service;

import com.amit.security.auth.request.RegisterRequest;
import com.amit.security.employee.model.User;

import java.util.List;

public interface UserService {
    User getUser(String email);

    User updateUser(RegisterRequest request);

    List<User> getUsers();
}
