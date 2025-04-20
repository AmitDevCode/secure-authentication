package com.amit.security.events.listener;

import com.amit.security.employee.model.UserActivityLog;
import com.amit.security.employee.repository.UserActivityLogRepository;
import com.amit.security.events.UserActivityEvent;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

import static java.time.LocalDateTime.now;

@Component
public class ApplicationEventListener {

    private final UserActivityLogRepository activityRepository;

    @Autowired
    public ApplicationEventListener(UserActivityLogRepository activityRepository) {
        this.activityRepository = activityRepository;
    }

    @PostConstruct
    public void init() {
        System.out.println("✅ UserActivityEventListener loaded");
    }


    @EventListener
    public void handleUserActivityEvent(UserActivityEvent event) {
        System.out.println("🔥 Received event for user: " + event.getUsername());
        UserActivityLog activity = UserActivityLog.builder().username(event.getUsername()).action(event.getAction()).details(event.getDetails()).createdAt(now()).build();
        activityRepository.save(activity);
    }
}
