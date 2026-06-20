package com.cod8flow.cod8flow.event;


import lombok.*;

import java.util.UUID;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class TaskAssignedEvent {
    private UUID taskId;
    private String taskTitle;
    private UUID assigneeId;
    private String assigneeEmail;
    private UUID boardId;
    private String priority;

}
