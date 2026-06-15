package com.cod8flow.cod8flow.dto.response;

import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BoardResponse {

    private UUID id;
    private String name;
    private String description;
    private UUID workspaceId;
    private int taskCount;
    private LocalDateTime createdAt;
}