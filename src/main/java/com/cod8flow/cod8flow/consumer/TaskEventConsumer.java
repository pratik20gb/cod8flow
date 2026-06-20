package com.cod8flow.cod8flow.consumer;

import com.cod8flow.cod8flow.event.TaskAssignedEvent;
import tools.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class TaskEventConsumer {

    private final ObjectMapper objectMapper;

    @KafkaListener(
            topics = "task_event",
            groupId = "cod8flow-group"
    )
    public void handleTaskAssigned(String message) {
        try {
            TaskAssignedEvent event = objectMapper.readValue(message, TaskAssignedEvent.class);
            log.info("Received TaskAssignedEvent — task: '{}', assignee: {}",
                    event.getTaskTitle(),
                    event.getAssigneeEmail()
            );
        } catch (Exception e) {
            log.error("Failed to deserialize TaskAssignedEvent: {}", e.getMessage());
        }
    }
}