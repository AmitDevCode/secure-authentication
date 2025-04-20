package com.amit.security.employee.repository;

import com.amit.security.employee.model.UserActivityLog;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UserActivityLogRepository extends JpaRepository<UserActivityLog,String> {

    List<UserActivityLog> getUserActivityLogByUsername(String email);
}
