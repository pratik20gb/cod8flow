package com.cod8flow.cod8flow.dto.response;

import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AttachmentResponse {

    private UUID id;
    private String fileName;
    private Long fileSize;
    private String contentType;
    private String uploadedByEmail;
    private LocalDateTime createdAt;
}