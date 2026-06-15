package com.cod8flow.cod8flow.dto.response;

import com.cod8flow.cod8flow.domain.enums.Priority;
import com.cod8flow.cod8flow.domain.enums.TaskStatus;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TaskResponse {

    private UUID id;
    private String title;
    private String description;
    private TaskStatus status;
    private Priority priority;
    private UUID boardId;
    private String assigneeEmail;
    private LocalDateTime dueDate;
    private LocalDateTime createdAt;
}