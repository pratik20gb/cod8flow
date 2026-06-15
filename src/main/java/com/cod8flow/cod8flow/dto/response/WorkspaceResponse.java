package com.cod8flow.cod8flow.dto.response;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WorkspaceResponse {

    private UUID id;
    private String name;
    private String description;
    private String ownerEmail;
    private int memberCount;
    private int boardCount;
    private LocalDateTime createdAt;

}
