package com.cod8flow.cod8flow.dto.request;


import com.cod8flow.cod8flow.domain.enums.Priority;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateTaskRequest {

    @NotBlank
    @Size(min=2,max=100)
    private String title;
    private String description;

    private Priority priority;

    private UUID assigneeId;

    private LocalDateTime dueDate;

}
