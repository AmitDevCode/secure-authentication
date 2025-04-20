package com.amit.security.events;

import lombok.Getter;
import org.springframework.context.ApplicationEvent;


@Getter
public class UserActivityEvent extends ApplicationEvent {
    private final String username;
    private final String action;
    private final String details;

    public UserActivityEvent(Object source, String username, String action, String details) {
        super(source);
        this.username = username;
        this.action = action;
        this.details = details;
    }

}
